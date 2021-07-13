import React, { useEffect, useState } from 'react'
import isElectron from 'is-electron'
import { TwitterFeed } from './components/twitterfeed/TwitterFeed'
import { Search } from './components/search/Search'
import { Loader } from './components/loader/Loader'
import './App.css'
import { useLocalStorage, usePrevious } from './hooks'

export const App = () => {
  const feed = useLocalStorage('feed', [])
  const account = useLocalStorage('account', undefined)
  const [showSearch, setShowSearch] = useState(true)
  const [showFeed, setShowFeed] = useState(false)
  const [loading, setLoading] = useState(false)

  const prevAccount = usePrevious(account.current)

  useEffect(() => {
    if (isElectron()) {
      window.ipcRenderer.on('message', (event, data) => {
        feed.set(data)
        setLoading(false)
        setShowFeed(true)
      })
      window.ipcRenderer.on('twitter-account', (event, data) => {
        account.set(data)
      })
    }
  })

  useEffect(() => {
    if (isElectron()) {
      if (account.value !== prevAccount) {
        //
        window.ipcRenderer.send('search', account.value)
      }
    }
  }, [account, prevAccount])

  const handleSubmitSearch = ({ searchTerm }) => {
    account.set(searchTerm)
    setShowSearch(false)
    setShowFeed(false)
    setLoading(true)
  }

  const showOnlySearchBox = () => {
    setShowSearch(true)
    setShowFeed(false)
    setLoading(false)
  }

  return (
    <>
      {showSearch ? (
        <Search handleSubmitSearch={handleSubmitSearch} />
      ) : (
        <>
          <button onClick={showOnlySearchBox}>&lt; search again</button>
          <header>{!!account.value && <h1>{account.value}</h1>}</header>
        </>
      )}
      {loading && <Loader />}
      {showFeed && !!feed.value && <TwitterFeed feed={feed.value.tweets} />}
    </>
  )
}
