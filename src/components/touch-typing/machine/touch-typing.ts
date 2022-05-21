import { ActorRefFrom, assign, createMachine, send, spawn } from 'xstate'
import { createWordMachine } from './word'

const context = {
  sentence: '',
  words: [] as Array<{
    word: string
    ref: ActorRefFrom<typeof createWordMachine>
  }>,
  length: 0,
  currentWordPosition: 0,
  startTime: 0,
  time: 0,
  wpm: 0,
  errors: 0,
}

export const machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcD2BXAxgCwLTIE8AHASwDsoA6AG1QEMJyoBiRUI1WE5E1MtkAA9EAJgDMAFkoiArAEYZMgGxiAnEokAOCWM0AaEAURiRUgAyqxVhfIDsShwF9HBtFjyFSFSkTBlGFMwA1mAEEKgA7vxIIBxcPHwCwggStnLSZhIa2pkyZvqGxqaUFlZiNnL2Ti4gbjj4xEyUdJg8AG5gzGRggsgA6qgAThACcdy80aDJMppKlDKqqqkmmmIW9gZGCHKqtpT2ZmY7DiaVqiLOrhj1nk0t7Z1kqDwAZgQAcj39QyMxYwmTISIVZSVJKET5BxyMwyXSbRASZTSVQyLJyESWTRySQyS61a4eRrePwQZiDODIUaccaJGLJTS2TSURZHMSM2ySJTneEIRnSJSHdZKZSyI7OGpPCBwAR1QleKi0BhMKnxCZJBEiHkY9ILKwSOQSCSWBa4mqyhrynwk5V-akA9UIKwyea2dRaCS5fI8tbO3WSA1GsQmvHm27ee4kDoqmmA6azfZB1QWFFyLmqApbcpMg6HLGpswicEhgkWpok6P2umIdRmShclaFpSzRTekyUCQQw755QWU1XdyligVtVV7YZxDOwuHNmafKzo1ycWOIA */
  createMachine(
    {
      context: context,
      tsTypes: {} as import('./touch-typing.typegen').Typegen0,
      schema: { context: {} as TContext, events: {} as TEvents },
      preserveActionOrder: true,
      id: 'touch-typing',
      initial: 'LOADING',
      states: {
        LOADING: {
          entry: 'initializeMachine',
          always: {
            target: 'PENDING',
          },
        },
        PENDING: {
          entry: 'notifyWord',
          on: {
            KEYDOWN: {
              target: 'ACTIVE',
            },
          },
        },
        ACTIVE: {
          entry: assign({ startTime: _ => Date.now() }),
          invoke: {
            id: 'timer',
            src: _ => cb => {
              let frameId: number
              function tick() {
                cb({ type: 'TICK' })
                frameId = requestAnimationFrame(tick)
              }
              tick()

              return () => {
                cancelAnimationFrame(frameId)
              }
            },
          },
          on: {
            NEXT_WORD: {
              actions: ['nextWord', 'notifyNextWord'],
            },
            NOTIFY_NEXT_WORD: [
              {
                cond: 'hasNextWord',
                target: 'END',
              },
              {
                actions: 'notifyWord',
              },
            ],
            TICK: {
              actions: ['tick', 'wpm'],
            },
            ERROR: {
              actions: ['error'],
            },
          },
        },
        END: {
          on: {
            RESET: {
              target: 'LOADING',
            },
          },
        },
      },
    },
    {
      actions: {
        initializeMachine: assign({
          words: context =>
            context.sentence
              .split(/([\w.,;'"]+ ?)/)
              .filter(Boolean)
              .map(word => ({
                word,
                ref: spawn(createWordMachine(word)),
              })),
          length: context => context.sentence.length,
          currentWordPosition: _ => 0,
        }),
        notifyWord: context =>
          context.words[context.currentWordPosition].ref.send({
            type: 'ENTER',
          }),
        nextWord: assign({
          currentWordPosition: context => context.currentWordPosition + 1,
        }),
        notifyNextWord: send({ type: 'NOTIFY_NEXT_WORD' }),
        tick: assign({
          time: context => Date.now() - context.startTime,
        }),
        wpm: assign({
          wpm: context => {
            const minutes = context.time / 60000
            return Math.floor(context.currentWordPosition / minutes)
          },
        }),
        error: assign({ errors: contex => contex.errors + 1 }),
      },
      guards: {
        hasNextWord: context =>
          context.currentWordPosition === context.words.length,
      },
    },
  )

type TContext = typeof context

type TEvents =
  | { type: 'KEYDOWN'; key: string }
  | { type: 'NEXT_WORD' }
  | { type: 'NOTIFY_NEXT_WORD' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'ERROR' }
