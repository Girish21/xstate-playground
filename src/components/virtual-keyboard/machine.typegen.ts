// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    keydown: 'KEYDOWN'
    keyup: 'KEYUP'
    shift: 'SHIFT'
    caps: 'CAPS'
  }
  internalEvents: {
    '': { type: '' }
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
    keyGuard: 'KEYDOWN' | 'KEYUP'
  }
  eventsCausingDelays: {}
  matchesStates: 'IDLE' | 'START'
  tags: never
}
