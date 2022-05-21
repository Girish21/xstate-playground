// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    nextWord: 'NEXT_WORD'
    notifyNextWord: 'NEXT_WORD'
    notifyWord: 'NOTIFY_NEXT_WORD' | ''
    tick: 'TICK'
    wpm: 'TICK'
    initializeMachine: 'RESET'
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
    hasNextWord: 'NOTIFY_NEXT_WORD'
  }
  eventsCausingDelays: {}
  matchesStates: 'LOADING' | 'PENDING' | 'ACTIVE' | 'END'
  tags: never
}
