import { Header } from '../header'
import { Nav } from '../nav'
import { NavLink } from '../nav-link'

export function KeyboardSubnav() {
  return (
    <Header>
      <Nav>
        <NavLink to='virtual-keyboard'>Virtual Keyboard</NavLink>
        <NavLink to='touch-typing'>Touch Typing</NavLink>
      </Nav>
    </Header>
  )
}
