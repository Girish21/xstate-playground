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
      </Nav>
    </Header>
  )
}
