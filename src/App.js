import React, { useEffect } from 'react'
import isElectron from 'is-electron'
import { TwitterFeed } from './components/twitterfeed/TwitterFeed'
import { Search } from './components/search/Search'
import './App.css'
import { useLocalStorage, usePrevious } from './hooks'

export const App = () => {
  const feed = useLocalStorage('feed', [])
  const account = useLocalStorage('account', undefined)

  const prevAccount = usePrevious(account.current)

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

  useEffect(() => {
    if (isElectron()) {
      if (account.value !== prevAccount) {
        window.ipcRenderer.send('search', account.value)
      }
    }
  }, [account, prevAccount])

  const handleSubmitSearch = ({ searchTerm }) => {
    account.set(searchTerm)
    // TODO: add loader for feed
  }

  return (
    <>
      <header>
        {!!account.value && <h1>{account.value}</h1>}
        <Search handleSubmitSearch={handleSubmitSearch} />
      </header>
      {!!feed.value && <TwitterFeed feed={feed.value.tweets} />}
    </>
  )
}
