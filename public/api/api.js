const needle = require('needle')

const search = async (searchTerm, callback) => {
  //console.log('Enter search')
  let feed, error
  const { type } = getSearchType({ str: searchTerm })
  try {
    if (searchTerm.length > 0) {
      if (type === 'user') {
        const usernames = searchTerm.slice(1)
        const userProfile = await getUserId({ usernames })
        //console.log(userProfile)
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
  console.log('Entro en getUserId')
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
    // //console.log(res.body)
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
    { expansions: 'author_id' },
    {
      headers: {
        authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    }
  )

  if (res.body) {
    //console.log(res.body.data)
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
    //console.log(res.body.data)
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
