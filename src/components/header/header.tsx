import { NavLink } from '../nav-link'

export function Header({ children }: { children: React.ReactNode }) {
  return <header className='px-6 py-2'>{children}</header>
}
