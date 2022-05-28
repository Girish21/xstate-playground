import { PageWrapper, TicTacToe as TicTacToeImpl } from '../components'

export default function TicTacToe() {
  return (
    <PageWrapper>
      <div className='col-span-12 grid place-content-center'>
        <TicTacToeImpl />
      </div>
    </PageWrapper>
  )
}
