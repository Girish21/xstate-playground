// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    restCurrentPosition: 'ENTER'
    startTimer: 'KEYDOWN'
    notifyCharacterActorExit: 'KEYDOWN'
    keydown: 'KEYDOWN'
    notifyCharacterActorEnter: 'KEYDOWN' | 'ENTER'
    checkDone: 'KEYDOWN'
    error: 'ERROR'
    initializeMachine: 'xstate.init'
    nextWord: 'CHECK_DONE'
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
    isDone: 'CHECK_DONE'
  }
  eventsCausingDelays: {}
  matchesStates: 'IDLE' | 'ACTIVE' | 'DONE'
  tags: never
}
