// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    notifyCharacterActorExit: 'keydown'
    keydown: 'keydown'
    notifyCharacterActorEnter: 'keydown' | ''
    initializeMachine: 'xstate.init'
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
    endReached: 'keydown'
  }
  eventsCausingDelays: {}
  matchesStates: 'loading' | 'ready' | 'end'
  tags: never
}
