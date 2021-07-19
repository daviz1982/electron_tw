import React from 'react'
import { Tweet } from '../tweet/Tweet'
import './TwitterFeed.css'

export const TwitterFeed = ({ feed, user }) => (
  <div className='twitter-feed'>
    <ul>
      {feed &&
        feed.map((item) => (
          <li key={item.id}>
            <Tweet data={item} user={user} />
          </li>
        ))}
    </ul>
  </div>
)
