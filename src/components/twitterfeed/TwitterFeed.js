import React from 'react'
import { Tweet } from '../tweet/Tweet'
import './TwitterFeed.css'

export const TwitterFeed = ({ feed }) => {
  return (
    <div className='twitter-feed'>
      <ul>
        {feed &&
          feed.map((item) => (
            <li>
              <Tweet data={item} key={item.id} />
            </li>
          ))}
      </ul>
    </div>
  )
}
