import { gameMachine } from './game'
import { createButtonMachine } from './button'

export { gameMachine as machine }

export type GameMachine = typeof gameMachine
export type ButtonMachine = typeof createButtonMachine
