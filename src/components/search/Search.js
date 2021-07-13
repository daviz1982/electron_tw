import React, { useState } from 'react'
// import './Search.css'

export const Search = ({ handleSubmitSearch }) => {
  const [searchTerm, setSearchTerm] = useState('GitKraken')

  const handleChangeSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleSubmitSearch({ searchTerm })
  }

  return (
    <div className='tweet'>
      <form onSubmit={handleSubmit}>
        <label htmlFor='searchfield'>Search: </label>
        <input
          type='search'
          id='searchfield'
          placeholder='Enter account'
          onChange={handleChangeSearch}
          value={searchTerm}
        />
        <button>Search</button>
      </form>
    </div>
  )
}
