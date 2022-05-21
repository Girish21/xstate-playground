// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    active: 'ENTER'
    inactive: 'xstate.init'
  }
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
    correct: 'EXIT'
    incorrect: 'EXIT'
  }
  eventsCausingDelays: {}
  matchesStates: 'idle' | 'ACTIVE' | 'DONE' | 'ERROR'
  tags: never
}
