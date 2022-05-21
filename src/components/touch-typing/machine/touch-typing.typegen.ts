// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    nextWord: 'nextWord'
    notifyNextWord: 'nextWord'
    notifyWord: 'notifyNextWord' | ''
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
  matchesStates: 'loading' | 'active' | 'end'
  tags: never
}
