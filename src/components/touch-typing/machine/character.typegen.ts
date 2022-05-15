// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {}
  internalEvents: {
    'xstate.init': { type: 'xstate.init' }
  }
  invokeSrcNameMap: {}
  missingImplementations: {
    actions: never
    services: never
    guards: never
    delays: never
  }
  eventsCausingServices: {}
  eventsCausingGuards: {
    correct: 'exit'
    incorrect: 'exit'
  }
  eventsCausingDelays: {}
  matchesStates: 'idle' | 'active' | 'done' | 'error'
  tags: never
}
