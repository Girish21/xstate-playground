// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    restCurrentPosition: 'enter'
    startTimer: 'keydown'
    notifyCharacterActorExit: 'keydown'
    keydown: 'keydown'
    notifyCharacterActorEnter: 'keydown' | 'enter'
    checkDone: 'keydown'
    initializeMachine: 'xstate.init'
    nextWord: 'checkDone'
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
    isDone: 'checkDone'
  }
  eventsCausingDelays: {}
  matchesStates: 'idle' | 'active' | 'done'
  tags: never
}
