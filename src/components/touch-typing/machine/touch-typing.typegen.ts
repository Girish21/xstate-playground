// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    nextWord: 'nextWord'
    notifyNextWord: 'nextWord'
    notifyWord: 'notifyNextWord' | ''
    tick: 'tick'
    wpm: 'tick'
    initializeMachine: 'rest'
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
    hasNextWord: 'notifyNextWord'
  }
  eventsCausingDelays: {}
  matchesStates: 'loading' | 'pending' | 'active' | 'end'
  tags: never
}
