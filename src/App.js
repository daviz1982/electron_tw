import React, { useEffect } from 'react'
import isElectron from 'is-electron'
import { TwitterFeed } from './components/twitterfeed/TwitterFeed'
import './App.css'
import { useLocalStorage } from './hooks/useLocalStorage'

function App() {
  const feed = useLocalStorage('feed', [])
  const account = useLocalStorage('account', '')

  useEffect(() => {
    if (isElectron()) {
      window.ipcRenderer.on('message', (event, data) => {
        feed.set(data)
      })
      window.ipcRenderer.on('twitter-account', (event, data) => {
        account.set(data)
      })
    }
  })
  return (
    <>
      {!!account.value && <h1>{account.value}</h1>}
      {!!feed.value && <TwitterFeed feed={feed.value.tweets} />}
    </>
  )
}

export default App
