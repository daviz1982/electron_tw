import React from 'react'
import { useLocalStorage } from '../../hooks'
import './LastSearch.css'

export const LastSearch = ({ handleSubmit }) => {
  const searchHistory = useLocalStorage('SEARCH_HISTORY')

  const arrHistory = searchHistory.value.reverse()

  return (
    <div className='list-last-searches'>
      <ul>
        {arrHistory.map((item, index) => (
          <li key={index} onClick={() => handleSubmit(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
