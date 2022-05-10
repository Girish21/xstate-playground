// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    setCurrentTime: 'START' | 'RESUME'
    updateTick: 'TICK'
    addOffset: 'PAUSE'
    reset: 'RESET'
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
  eventsCausingGuards: {}
  eventsCausingDelays: {}
  matchesStates: 'idle' | 'running' | 'stop' | 'pause'
  tags: never
}
