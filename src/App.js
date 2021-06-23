import React, { useEffect } from 'react'
import isElectron from 'is-electron'
import { TwitterFeed } from './components/twitterfeed/TwitterFeed'
import './App.css'
import { useLocalStorage } from './hooks/useLocalStorage'

function App() {
  const feed = useLocalStorage('feed', [])

  useEffect(() => {
    if (isElectron()) {
      window.ipcRenderer.on('message', (event, data) => {
        feed.set(data)
      })
    }
  })
  return !!feed.value && <TwitterFeed feed={feed.value.tweets} />
}

export default App
