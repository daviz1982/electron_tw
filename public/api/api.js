const needle = require('needle')

const search = async (searchTerm, callback) => {
  console.log('Enter search')
  let feed, error
  // TODO: add logic to perform search when it's an user and when isn't
  const { type } = getSearchType({ str: searchTerm })
  try {
    if (searchTerm.length > 0) {
      if (type === 'user') {
        const usernames = searchTerm.slice(1)
        const { userIds } = await getUserId({ usernames })
        console.log(userIds)
        userIds.forEach(async (item) => {
          feed = await searchTweetsByUser({ userId: item })
          callback({ searchTerm, feed, error })
        })
      } else {
        const query = searchTerm
        feed = await searchTweets({ query })
        callback({ searchTerm, feed, error })
      }
    }
  } catch (e) {
    // console.log({ e })
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
  const endpointURL = 'https://api.twitter.com/2/users/by?usernames='
  const params = {
    usernames: typeof usernames === 'object' ? usernames.join(',') : usernames,
  }
  const res = await needle('get', endpointURL, params, {
    headers: {
      authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
  })
  if (res.body && res.body.data) {
    return { userIds: res.body.data.map((item) => item.id) }
  } else {
    // console.log(res.body)
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
    {},
    {
      headers: {
        authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    }
  )

  if (res.body) {
    const response = {
      tweets: res.body.data,
    }
    return response
  } else {
    const err = res.body.errors[0].message
    throw new Error(err)
  }
}

const searchTweets = async ({ query }) => {
  const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent'

  const res = await needle(
    'get',
    endpointUrl,
    { query },
    {
      headers: {
        authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    }
  )

  if (res.body) {
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
