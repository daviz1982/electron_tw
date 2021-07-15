import React from 'react'
import './Tweet.css'

export const Tweet = ({ data, user }) => {
  const extractUrl = () => {
    const { tweet, author_id, id } = data
    const url = `//twitter.com/${author_id}/status/${id}`
    return { url, tweet }
  }
  const { url, tweet } = extractUrl()
  return (
    <div className='tweet'>
      <p>{tweet}</p>
      {!!url && (
        <span>
          <a href={url} target='_blank' rel='noreferrer'>
            Go to tweet
          </a>
        </span>
      )}
    </div>
  )
}
