import { PageWrapper, Stopwatch as StopwatchImpl } from '../components'

export default function Stopwatch() {
  return (
    <PageWrapper>
      <div className='col-span-12 grid place-content-center'>
        <StopwatchImpl />
      </div>
    </PageWrapper>
  )
}
