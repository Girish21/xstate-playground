import { Outlet } from 'react-router-dom'
import { Header } from '../header'

export function Wrapper() {
  return (
    <main className='flex flex-col'>
      <Header />
      <Outlet />
    </main>
  )
}
