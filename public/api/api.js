const needle = require('needle')

const search = async (searchTerm, callback) => {
  console.log('Enter search')
  let feed, error
  const { type } = getSearchType({ str: searchTerm })
  try {
    if (searchTerm.length > 0) {
      if (type === 'user') {
        const usernames = searchTerm.slice(1)
        const userProfile = await getUserId({ usernames })
        feed = await searchTweetsByUser({ userId: userProfile.id })
        callback({ userProfile, feed, error })
      } else {
        const query = searchTerm
        feed = await searchTweets({ query })
        callback({ searchTerm, feed, error })
      }
    }
  } catch (e) {
    console.error({ e })
    error = e
    callback({ searchTerm, feed, error })
  }
}

const getSearchType = ({ str }) => {
  const reUser = /^@.*$/i
  const reHashtag = /^#.*$/i

  const type = reUser.test(str) ? 'user' : reHashtag.test(str) ? 'hash' : ''

  return { type }
}

const getUserId = async ({ usernames }) => {
  const endpointURL = 'https://api.twitter.com/2/users/by'
  const params = {
    usernames: typeof usernames === 'object' ? usernames.join(',') : usernames,
    'user.fields': 'profile_image_url,url,name',
  }
  const res = await needle('get', endpointURL, params, {
    headers: {
      authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
  })
  if (res.body && res.body.data) {
    return res.body.data[0]
  } else {
    const err = res.body.errors[0].message
      ? res.body.errors[0].message
      : `${res.body.errors[0].title}: ${res.body.errors[0].detail}`
    console.error(err)
    throw new Error(err)
  }
}

const searchTweetsByUser = async ({ userId }) => {
  const endpointURL = `https://api.twitter.com/2/users/${userId}/tweets`
  const res = await needle(
    'get',
    endpointURL,
    { 'tweet.fields': 'author_id,text,id' },
    {
      headers: {
        authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    }
  )
  if (res.body && res.body.data) {
    const response = {
      tweets: res.body.data,
    }
    return response
  } else {
    const err = res.body.errors[0].message
    console.error(err)
    throw new Error(err)
  }
}

const searchTweets = async ({ query }) => {
  const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent'

  const res = await needle(
    'get',
    endpointUrl,
    {
      query,
      'tweet.fields':
        'attachments,author_id,conversation_id,created_at,entities,id,in_reply_to_user_id,public_metrics,referenced_tweets,reply_settings,text',
    },
    {
      headers: {
        authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    }
  )
  if (res.body && res.body.data) {
    const response = {
      tweets: res.body.data,
    }
    return response
  } else {
    const err = res.body.errors[0].message
    throw new Error(err)
  }
}
const api = {
  search,
}

module.exports = api
