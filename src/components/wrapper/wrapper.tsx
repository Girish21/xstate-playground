import { Outlet } from 'react-router-dom'
import { AppNav } from '../app-nav'

export function Wrapper() {
  return (
    <main className='flex flex-col'>
      <AppNav />
      <Outlet />
    </main>
  )
}
