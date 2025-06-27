import './App.css'
import { SSEClient } from './SSEClient'
import { ChunkedClient } from './ChunkedClient'

function App() {
  return (
    <>
      <h1>Streaming Client Demo</h1>
      <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
        <SSEClient />
        <ChunkedClient />
      </div>
    </>
  )
}

export default App
