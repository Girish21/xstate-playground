import { Outlet } from 'react-router-dom'
import { KeyboardSubnav, PageWrapper } from '../components'

export default function Keyboard() {
  return (
    <PageWrapper>
      <div className='col-span-12 flex flex-col pt-2'>
        <KeyboardSubnav />
        <div className='grid flex-1 place-content-center'>
          <Outlet />
        </div>
      </div>
    </PageWrapper>
  )
}
