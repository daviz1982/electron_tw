import React from 'react'
import './Tweet.css'

export const Tweet = ({ data }) => {
  const extractUrl = () => {
    const txt = data.text
    const { index } = txt.match(/https:\/\/.*$/) || txt.length
    const url = txt.slice(index, -1)
    const tweet = txt.slice(0, index)
    return { url, tweet }
  }
  const { url, tweet } = extractUrl()
  return (
    <div className='tweet'>
      <p>{tweet}</p>
      <span>
        <a href={url} target='_blank' rel='noreferrer'>
          Go to tweet
        </a>
      </span>
    </div>
  )
}
