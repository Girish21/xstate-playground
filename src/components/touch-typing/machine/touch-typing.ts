import { ActorRefFrom, assign, createMachine, send, spawn } from 'xstate'
import { characterMachine } from './character'

const context = {
  sentence: '',
  characters: [] as Array<{
    character: string
    ref: ActorRefFrom<typeof characterMachine>
  }>,
  currentPosition: 0,
}

export const machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcD2BXAxgCwLTIE8AHASwDsoA6AG1QEMJyoBiRUI1WE5E1MtkAA9EAJgAcYygAYAjAFYAbDIDsAZgCc6mavkAWADQgCoqVMq7N6sTPXLdE2wF9HhtFjyFSFSgCcwDAmYAazACCFQAd34kEA4uHj4BYQRlWUplBUVxEXVVCRlDYwR1M0srGQsRGQlM5xcQMlQIOAE3HHxiJhp6RgoBOO5eaNBk3RFCxBkFSTKxJRLVOTsxZ1cMds8uvwD+zkHEmOS89UpVXVU7ZSWxDLFVCYR5UssxESrlXJKRVZA2j07vGAyBBdvEhklEOoFAppAoRHIZFI5It1Es5A8bLpzJY7CUpqoRMofn8Ol4oKD9sMhJMxBjlJQyh9UlJdNUbgo6o4gA */
  createMachine(
    {
      context: context,
      tsTypes: {} as import('./touch-typing.typegen').Typegen0,
      schema: { context: {} as TContext, events: {} as TEvents },
      preserveActionOrder: true,
      id: 'touch-typing',
      initial: 'loading',
      states: {
        loading: {
          entry: 'initializeMachine',
          always: {
            target: 'ready',
          },
        },
        ready: {
          entry: 'notifyCharacterActorEnter',
          invoke: {
            id: 'key handler',
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
          },
          on: {
            keydown: [
              {
                cond: 'endReached',
                target: 'end',
              },
              {
                actions: [
                  'notifyCharacterActorExit',
                  'keydown',
                  'notifyCharacterActorEnter',
                ],
              },
            ],
          },
        },
        end: {},
      },
    },
    {
      actions: {
        keydown: assign({
          currentPosition: context => context.currentPosition + 1,
        }),
        notifyCharacterActorExit: (context, event) => {
          if (context.currentPosition < context.characters.length) {
            context.characters[context.currentPosition].ref.send({
              type: 'exit',
              key: event.key,
            })
          }
        },
        notifyCharacterActorEnter: (context, event) => {
          if (context.currentPosition < context.characters.length) {
            context.characters[context.currentPosition].ref.send({
              type: 'enter',
            })
          }
        },
        initializeMachine: assign({
          characters: context =>
            context.sentence.split('').map(character => ({
              character,
              ref: spawn(characterMachine(character)),
            })),
        }),
      },
      guards: {
        endReached: context =>
          context.currentPosition === context.characters.length,
      },
    },
  )

type TContext = typeof context

type TEvents = { type: 'keydown'; key: string }
