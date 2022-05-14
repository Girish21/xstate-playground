import clsx from 'clsx'
import * as React from 'react'

export const keys = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

export function Container({ children }: Props) {
  return (
    <div className='flex select-none flex-col justify-center gap-y-2'>
      {children}
    </div>
  )
}

export function Row({ children, rowIndex }: Props & { rowIndex: number }) {
  return (
    <div
      style={
        {
          '--offset': `${16 * rowIndex}px`,
        } as React.CSSProperties
      }
      className='ml-[var(--offset)] flex items-center gap-x-2'
    >
      {children}
    </div>
  )
}

export function Key({ children, active }: Props & { active: boolean }) {
  return (
    <span
      className={clsx(
        'relative isolate grid h-16 w-16 place-content-center rounded-xl text-white transition duration-200 ease-out after:absolute after:left-1/2 after:top-1/2 after:z-0 after:h-10 after:w-10 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-lg after:bg-gradient-to-t after:content-[""]',
        active
          ? 'scale-125 bg-green-400 after:from-emerald-500 after:to-emerald-600 dark:bg-green-700 dark:after:from-emerald-500 dark:after:to-emerald-600'
          : 'bg-slate-700 after:from-slate-500 after:to-slate-600',
      )}
      data-active={active || undefined}
    >
      <span className='z-10'>{children}</span>
    </span>
  )
}

type Props = {
  children: React.ReactNode
}
