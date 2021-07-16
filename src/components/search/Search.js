import React, { useState, useRef, useEffect } from 'react'
import './Search.css'

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

  const handleSubmit = (event) => {
    event.preventDefault()
    handleSubmitSearch({ searchTerm })
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
          <div>use @ to look for users</div>
          <div>use # to look for hashtags</div>
        </small>
      </form>
    </div>
  )
}
