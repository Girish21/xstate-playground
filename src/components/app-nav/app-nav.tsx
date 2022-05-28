import { Header } from '../header'
import { Nav } from '../nav'
import { NavLink } from '../nav-link'

export function AppNav() {
  return (
    <Header>
      <Nav>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/stopwatch'>Stopwatch</NavLink>
        <NavLink to='/keyboard'>Keyboard</NavLink>
        <NavLink to='/notifications'>Notifications</NavLink>
        <NavLink to='/tic-tac-toe'>Tic-Tac-Toe</NavLink>
      </Nav>
    </Header>
  )
}
