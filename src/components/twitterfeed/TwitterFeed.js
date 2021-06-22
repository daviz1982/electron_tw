import React from 'react'
import { Tweet } from '../tweet/Tweet'

export const TwitterFeed = ({ feed }) => {
  return (
    <div>
      <ul>{feed && feed.map((item) => <Tweet data={item} key={item.id} />)}</ul>
    </div>
  )
}
