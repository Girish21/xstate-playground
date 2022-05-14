import * as React from 'react'

export function Nav({ children }: { children: React.ReactNode }) {
  return <nav className='flex gap-2'>{children}</nav>
}
