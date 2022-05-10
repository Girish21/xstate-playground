import loader from '../../assets/loader.svg'
import { PageWrapper } from '../page-wrapper'

export function Fallback() {
  return (
    <PageWrapper>
      <div className='col-span-12 grid place-content-center'>
        <svg className='w-24 h-24 text-blue-500 animate-spin'>
          <use href={`${loader}#loader`} />
        </svg>
      </div>
    </PageWrapper>
  )
}
