import React from 'react'
import './Tweet.css'

export const Tweet = ({ data, user }) => {
  const { text, author_id, id } = data

  const buildUrl = () => {
    const url = `//twitter.com/${author_id}/status/${id}`
    return url
  }

  const getTweetText = () => {
    // TODO: this funciotn was intended to parse the tweet and
    // decorate links and mentions
    return text
  }

  const url = buildUrl()

  return (
    <div className='tweet'>
      <p>
        <>{getTweetText()}</>
      </p>
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
