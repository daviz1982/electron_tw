import React, { useState } from 'react'
import './Search.css'

export const Search = ({ handleSubmitSearch }) => {
  const [searchTerm, setSearchTerm] = useState()

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
          type='search'
          id='searchfield'
          placeholder=''
          onChange={handleChangeSearch}
          value={searchTerm}
        />
        {/* <small>
          <div>use @ to look for users</div>
          <div>use # to look for hashtags</div>
        </small> */}
      </form>
    </div>
  )
}
