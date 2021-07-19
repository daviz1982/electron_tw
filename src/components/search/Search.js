import React, { useState, useRef, useEffect } from 'react'
import './Search.css'
import { LastSearch } from '../../components/lastsearch/LastSearch'

export const Search = ({ handleSubmitSearch }) => {
  const inputSearch = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (inputSearch.current) {
      inputSearch.current.focus()
    }
  }, [])

  const handleChangeSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSubmit = (event = false) => {
    if (typeof event === 'string') {
      setSearchTerm(event)
      handleSubmitSearch({ searchTerm: event })
    } else {
      if (!event.defaultPrevented) {
        event.preventDefault()
        handleSubmitSearch({ searchTerm })
      }
    }
  }

  return (
    <div className='searchBox'>
      <form onSubmit={handleSubmit}>
        <label htmlFor='searchfield'>Enter a topic to search</label>
        <input
          autoFocus
          id='searchfield'
          onChange={handleChangeSearch}
          placeholder=''
          type='text'
          ref={inputSearch}
          value={searchTerm}
        />
        <small>
          <div>Hint: use @ to look for users</div>
        </small>
      </form>
      <LastSearch handleSubmit={handleSubmit} />
    </div>
  )
}
