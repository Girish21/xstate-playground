// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    click: 'CLICK'
    nextState: 'CLICK'
    initializeMachine: 'done.state.game.ready'
    player1Turn: 'NEXT_STATE'
    dispathchCurrentPlayer: 'NEXT_STATE'
    player2Turn: 'NEXT_STATE'
    gameEnd: 'NEXT_STATE'
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
    isPlayerWon: 'NEXT_STATE'
    isDraw: 'NEXT_STATE'
  }
  eventsCausingDelays: {}
  matchesStates:
    | 'idle'
    | 'ready'
    | 'ready.player 1'
    | 'ready.player 2'
    | 'ready.player 1 win'
    | 'ready.player 2 win'
    | 'ready.draw'
    | 'ready.end'
    | {
        ready?:
          | 'player 1'
          | 'player 2'
          | 'player 1 win'
          | 'player 2 win'
          | 'draw'
          | 'end'
      }
  tags: never
}
