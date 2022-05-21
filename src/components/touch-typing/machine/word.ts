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
      initial: 'IDLE',
      states: {
        IDLE: {
          entry: 'initializeMachine',
          on: {
            ENTER: {
              actions: 'restCurrentPosition',
              target: 'ACTIVE',
            },
          },
        },
        ACTIVE: {
          entry: 'notifyCharacterActorEnter',
          invoke: {
            src: _ => cb => {
              function keydownHandler(e: KeyboardEvent) {
                if (/^[A-Za-z0-9 .,;:'"]$/.test(e.key)) {
                  cb({ type: 'KEYDOWN', key: e.key })
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
            KEYDOWN: {
              actions: [
                'startTimer',
                'notifyCharacterActorExit',
                'keydown',
                'notifyCharacterActorEnter',
                'checkDone',
              ],
            },
            CHECK_DONE: {
              cond: 'isDone',
              target: 'DONE',
            },
          },
        },
        DONE: {
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
              type: 'EXIT',
              key: event.key,
            })
          }
        },
        notifyCharacterActorEnter: context => {
          if (context.currentPosition < context.length) {
            context.characters[context.currentPosition].ref.send({
              type: 'ENTER',
            })
          }
        },
        keydown: assign({
          currentPosition: context => context.currentPosition + 1,
        }),
        nextWord: sendParent(_ => ({ type: 'NEXT_WORD' })),
        checkDone: send({ type: 'CHECK_DONE' }),
        startTimer: sendParent(_ => ({ type: 'KEYDOWN' })),
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
  | { type: 'KEYDOWN'; key: string }
  | { type: 'ENTER' }
  | { type: 'DONE' }
  | { type: 'CHECK_DONE' }
