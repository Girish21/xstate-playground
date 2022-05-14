import * as React from 'react'
import clsx from 'clsx'

export const PageWrapper: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <div className={clsx('grid flex-1 grid-cols-12', className)}>
      {children}
    </div>
  )
}
