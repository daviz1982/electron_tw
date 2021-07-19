import React, { useEffect, useState } from 'react'
import isElectron from 'is-electron'
import { TwitterFeed } from './components/twitterfeed/TwitterFeed'
import { Search } from './components/search/Search'
import { Loader } from './components/loader/Loader'
import { Error } from './components/error/Error'
import { usePrevious, useLocalStorage } from './hooks'
import './App.css'

export const App = () => {
  const [feed, setFeed] = useState([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [showSearch, setShowSearch] = useState(true)
  const [showFeed, setShowFeed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [userProfile, setUserProfile] = useState()

  const searchHistory = useLocalStorage('SEARCH_HISTORY', [])
  const MAX_HISTORY_SEARCH_VALUES = 5

  const prevQuery = usePrevious(query)

  useEffect(() => {
    if (isElectron()) {
      window.ipcRenderer.on('received-tweets', (event, data) => {
        setFeed(data)
        setLoading(false)
        setShowFeed(true)
      })
      window.ipcRenderer.on('received-user-profile', (event, data) => {
        setUserProfile(data)
      })
      window.ipcRenderer.on('received-error', (event, data) => {
        setError(data.message)
        setShowError(true)
        setLoading(false)
      })
    }
  })

  useEffect(() => {
    if (isElectron()) {
      if (query !== prevQuery) {
        window.ipcRenderer.send('search', query)
      }
    }
  }, [query, prevQuery])

  const addItemHistoricSearch = ({ term }) => {
    let actualValue = searchHistory.value
    if (actualValue.includes(term)) {
      return
    }
    if (actualValue.length === MAX_HISTORY_SEARCH_VALUES) {
      actualValue = actualValue.slice(1, MAX_HISTORY_SEARCH_VALUES)
    }
    actualValue.push(term)
    searchHistory.set(actualValue)
  }

  const handleSubmitSearch = ({ searchTerm }) => {
    setQuery(searchTerm)
    setShowSearch(false)
    setShowFeed(false)
    setLoading(true)
    addItemHistoricSearch({ term: searchTerm })
  }

  const showOnlySearchBox = () => {
    setShowSearch(true)
    setShowFeed(false)
    setLoading(false)
    setShowError(false)
    setQuery('')
  }

  return (
    <>
      {showSearch ? (
        <Search handleSubmitSearch={handleSubmitSearch} />
      ) : (
        <>
          <button className='backLink' onClick={showOnlySearchBox}>
            ↪️ Search again
          </button>
          <header>{!!query && <h1>{query}</h1>}</header>
        </>
      )}
      {loading && <Loader />}
      {showFeed && !!feed && (
        <TwitterFeed feed={feed.tweets} user={userProfile} />
      )}
      {showError && <Error message={error} />}
    </>
  )
}
