const needle = require('needle')

const search = async (searchTerm, callback) => {
  let feed, error
  try {
    // TODO: add logic to perform search when it's an user and when isn't
    if (searchTerm.length > 0) {
      // console.log(searchTerm)
      const { userIds } = await getUserId({ usernames: searchTerm })
      userIds.forEach(async (item) => {
        feed = await searchTweets({ userId: item })
        callback({ searchTerm, feed, error })
      })
    }
  } catch (e) {
    // console.log({ e })
    error = e
    callback({ searchTerm, feed, error })
  }
}

const getUserId = async ({ usernames }) => {
  const endpointURL = 'https://api.twitter.com/2/users/by?usernames='
  const params = {
    usernames: usernames.join(','),
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

const searchTweets = async ({ userId }) => {
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

const api = {
  search,
}

module.exports = api
