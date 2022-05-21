import { ActorRefFrom, assign, createMachine, send, spawn } from 'xstate'
import { createWordMachine } from './word'

const context = {
  sentence: '',
  words: [] as Array<{
    word: string
    ref: ActorRefFrom<typeof createWordMachine>
  }>,
  currentWordPosition: 0,
}

export const machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcD2BXAxgCwLTIE8AHASwDsoA6AG1QEMJyoBiRUI1WE5E1MtkAA9EAJhEBOSiICsARmnSAbAGZxigCwAOdcs0AaEAVEAGdZWnjlykbMXT1sgOzLH6gL5uDaLHkKkKlHSYPABuYMxkYILIAOqoAE4QAhxcPHwCwghWxpTqOiLWygqa4rKmBkYIjppSisb14o52ijIeXhg4+MRMgcEkYRGoPABmBAByUbEJSUggKdy8-LOZKo6UxoqyWsb2jpbG+oaIyoo1WiJN9eoX0k0eniBkqBBwAt6dfj20DEzJnAvpZaIa4VRCyTSKdaWKzyORNRQtNogd6+boBIKhMB-VKLDLHZQ5W5qLTqUzSA6ghCycSSGQ08SaGzaKwiTRIlFdfxUMBkGbsf5pJagTJyMyyAnOZymU6OaSUpmUWQSGlWIotYzVdkdVFc7EAoVCMGHSrSWr1FyaA6WrRqe5uIA */
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
            target: 'active',
          },
        },
        active: {
          entry: 'notifyWord',
          on: {
            nextWord: {
              actions: ['nextWord', 'notifyNextWord'],
            },
            notifyNextWord: [
              {
                cond: 'hasNextWord',
                target: 'end',
              },
              {
                actions: 'notifyWord',
              },
            ],
          },
        },
        end: {
          on: {
            rest: {
              target: 'loading',
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
          currentWordPosition: _ => 0,
        }),
        notifyWord: context =>
          context.words[context.currentWordPosition].ref.send({
            type: 'enter',
          }),
        nextWord: assign({
          currentWordPosition: context => context.currentWordPosition + 1,
        }),
        notifyNextWord: send({ type: 'notifyNextWord' }),
      },
      guards: {
        hasNextWord: context =>
          context.currentWordPosition === context.words.length,
      },
    },
  )

type TContext = typeof context

type TEvents =
  | { type: 'keydown'; key: string }
  | { type: 'nextWord' }
  | { type: 'notifyNextWord' }
  | { type: 'rest' }
