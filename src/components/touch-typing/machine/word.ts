import {
  ActorRefFrom,
  assign,
  createMachine,
  spawn,
  sendParent,
  send,
} from 'xstate'
import { createCharacterMachine } from './character'

export const createWordMachine = (word: string) =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiMfAFzACdFQAHAe1l3tw-1YgAHogBMADnEkADAEYArADZZigOzzR06fICcAGhABPRLPGyZW6aNkAWO6vE3FNgL4uDaLHkKksvAG40ANZghhAcAO4CSCCc3Lz8giIIDookOvIAzLLSilY6ypnyBsYIOuaWctkFqjra8m7uIPgcEHCCnjgExGSUYIJxPHzRoMk2oiUmijoWWtZ2Ng5Ork2d3j1+uIEDXEOJMWOqNiRZsqKZOqKqqnk3xUYm8hWWmdZqsjc6mW4eGF0+JHChB28WGSRM2nMohsOh0qiuZmUOhskwQKhmlXm9kczh+IDW3SIIL2I2EJnEqNMsysuVksPEGlEjRcQA */
  createMachine(
    {
      context: {
        characters: [],
        currentPosition: 0,
        length: word.length,
        word,
      },
      tsTypes: {} as import('./word.typegen').Typegen0,
      schema: { context: {} as TContext, events: {} as TEvent },
      preserveActionOrder: true,
      id: `words-${Math.random().toString(32).substring(5)}-${word}`,
      initial: 'idle',
      states: {
        idle: {
          entry: 'initializeMachine',
          on: {
            enter: {
              actions: 'restCurrentPosition',
              target: 'active',
            },
          },
        },
        active: {
          entry: 'notifyCharacterActorEnter',
          invoke: {
            src: _ => cb => {
              function keydownHandler(e: KeyboardEvent) {
                if (/^[A-Za-z0-9 .,;:'"]$/.test(e.key)) {
                  cb({ type: 'keydown', key: e.key })
                }
              }

              window.addEventListener('keydown', keydownHandler)

              return () => {
                window.removeEventListener('keydown', keydownHandler)
              }
            },
            id: 'key handler',
          },
          on: {
            keydown: {
              actions: [
                'startTimer',
                'notifyCharacterActorExit',
                'keydown',
                'notifyCharacterActorEnter',
                'checkDone',
              ],
            },
            checkDone: {
              cond: 'isDone',
              target: 'done',
            },
          },
        },
        done: {
          entry: 'nextWord',
        },
      },
    },
    {
      actions: {
        initializeMachine: assign({
          characters: _ =>
            word.split('').map(character => ({
              character,
              ref: spawn(createCharacterMachine(character)),
            })),
          currentPosition: _ => 0,
        }),
        restCurrentPosition: assign({ currentPosition: _ => 0 }),
        notifyCharacterActorExit: (context, event) => {
          if (context.currentPosition < context.length) {
            context.characters[context.currentPosition].ref.send({
              type: 'exit',
              key: event.key,
            })
          }
        },
        notifyCharacterActorEnter: context => {
          if (context.currentPosition < context.length) {
            context.characters[context.currentPosition].ref.send({
              type: 'enter',
            })
          }
        },
        keydown: assign({
          currentPosition: context => context.currentPosition + 1,
        }),
        nextWord: sendParent(_ => ({ type: 'nextWord' })),
        checkDone: send({ type: 'checkDone' }),
        startTimer: sendParent(_ => ({ type: 'keydown' })),
      },
      guards: {
        isDone: context => context.currentPosition === context.length,
      },
    },
  )

type TContext = {
  characters: Array<{
    character: string
    ref: ActorRefFrom<typeof createCharacterMachine>
  }>
  currentPosition: number
  length: number
  word: string
}

type TEvent =
  | { type: 'keydown'; key: string }
  | { type: 'enter' }
  | { type: 'done' }
  | { type: 'checkDone' }
