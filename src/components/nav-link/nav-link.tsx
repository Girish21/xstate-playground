import clsx from 'clsx'
import { NavLink as RRNavLink, NavLinkProps } from 'react-router-dom'

export function NavLink({ className, ...rest }: NavLinkProps) {
  return (
    <RRNavLink
      className={({ isActive }) =>
        clsx(
          className,
          'relative rounded px-2 py-1 text-lg text-gray-700 transition-colors duration-150 ease-out hover:bg-gray-100 dark:text-neutral-100 dark:hover:bg-gray-700',
          isActive &&
            'bg-gray-100 text-gray-900 after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-zinc-900 after:content-[""] dark:bg-gray-700 dark:text-neutral-50 dark:after:bg-gray-50',
        )
      }
      {...rest}
    />
  )
}
