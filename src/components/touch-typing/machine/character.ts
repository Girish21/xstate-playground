import { assign, createMachine } from 'xstate'
import { sendParent } from 'xstate/lib/actions'

const context = {
  character: '',
  active: false,
}

export const createCharacterMachine = (character: string) =>
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiMfAFzACdFQAHAe1l3tw-1YgAHogBMARnEkAHKOniALAGYlAVmnTVATgBsqgDQgAnonFLRJBVusB2TfJUAGBQF8XhtFjyFSWXgDcaMCEeQU5uXn5BEQQFBR0ScVFVR3EdGwVpZSUFQxMELUcSa1sbHXEUjPK3dxB8Dgg4QU8cAmIySjAwrh4+ASRhRAVRPNNRIqsSxz0tVVEbVVdalu92v1xA7oi+6MQlCpI1LQUzPUdRJUdpHVGERVVikuklGxydY7m3DwxWnxIIfhdAbhXpRAYxdJFfbJURxOwKGyzW73R7WZ6veIfURfEArNqkZhMDgsYE9SL9UAQh46aQZLSaFLlHQ5W6wiYlDKqLmiHTxHQ4vE+LagimDO7SZE2VFaRHXXQ2RTYmpAA */
  createMachine(
    {
      context,
      tsTypes: {} as import('./character.typegen').Typegen0,
      schema: { context: {} as TContext, events: {} as TEvents },
      id: `${character}-${Math.random().toString(32).substring(5)}`,
      initial: 'idle',
      states: {
        idle: {
          entry: 'inactive',
          on: {
            ENTER: {
              actions: 'active',
              target: 'ACTIVE',
            },
          },
        },
        ACTIVE: {
          on: {
            EXIT: [
              {
                cond: 'correct',
                target: 'DONE',
              },
              {
                cond: 'incorrect',
                target: 'ERROR',
              },
            ],
          },
        },
        DONE: {},
        ERROR: {
          entry: sendParent({ type: 'ERROR' }),
        },
      },
    },
    {
      actions: {
        active: assign({ active: _ => true }),
        inactive: assign({ active: _ => false }),
      },
      guards: {
        correct: (_, event) => event.key === character,
        incorrect: (_, event) => event.key !== character,
      },
    },
  )

type TContext = typeof context

type TEvents = { type: 'ENTER' } | { type: 'EXIT'; key: string }
