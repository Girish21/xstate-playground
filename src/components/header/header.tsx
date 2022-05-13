import clsx from 'clsx'
import { NavLink as RRNavLink, NavLinkProps } from 'react-router-dom'

function NavLink({ className, ...rest }: NavLinkProps) {
  return (
    <RRNavLink
      className={({ isActive }) =>
        clsx(
          className,
          'relative text-lg rounded px-2 py-1 text-gray-700 dark:text-neutral-100 transition-colors ease-out duration-150 hover:bg-gray-100 dark:hover:bg-gray-700',
          isActive &&
            'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-neutral-50 after:content-[""] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-zinc-900 dark:after:bg-gray-50',
        )
      }
      {...rest}
    />
  )
}

export function Header() {
  return (
    <header className='px-6 py-2'>
      <nav className='flex gap-2'>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/stopwatch'>Stopwatch</NavLink>
        <NavLink to='/keyboard'>Keyboard</NavLink>
      </nav>
    </header>
  )
}
