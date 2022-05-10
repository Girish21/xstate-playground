import * as React from 'react'
import clsx from 'clsx'

export const PageWrapper: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <div className={clsx('flex-1 pt-6 px-6 grid grid-cols-12', className)}>
      {children}
    </div>
  )
}
