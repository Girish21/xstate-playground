import { Notifications as NotificationsImpl, PageWrapper } from '../components'

export default function Notifications() {
  return (
    <PageWrapper>
      <div className='col-span-12 grid place-content-center'>
        <NotificationsImpl />
      </div>
    </PageWrapper>
  )
}
