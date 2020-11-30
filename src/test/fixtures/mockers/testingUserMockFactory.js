const { sign } = require('jsonwebtoken')
const { name } = require('faker')
const { avatarUrls } = require('../assets/avatarUrls.json')
const { validHashedPassword } = require('../assets/authentication.json')
const { generateMockedMongoDbId } = require('./utils')

const encodeJwt = (username) => {
  const payload = {
    sub: username
  }
  const secret = process.env.JWT_KEY
  const options = {
    algorithm: process.env.JWT_ALGORITHM || 'HS512',
    expiresIn: 3153600000 // 100 years
  }

  return sign(payload, secret, options)
}

const testingUserFactory = (usersAmount) => {
  const avatars = [...avatarUrls]

  const mockedUsers = [...Array(usersAmount)].map(() => {
    const firstName = name.firstName()
    const surname = name.lastName()
    const username = `${firstName.toLowerCase()}.${surname.toLowerCase()}@mail.com`
    const avatarIndex = Math.floor(Math.random() * (avatars.length - 1)) + 1

    return {
      id: generateMockedMongoDbId(),
      name: firstName,
      surname,
      email: username,
      username,
      password: validHashedPassword.value,
      avatar: avatars[avatarIndex],
      token: encodeJwt(username),
      enabled: true,
      deleted: false,
      lastLoginAt: ''
    }
  })

  return { mockedUsers }
}

const createMockedUsers = (usersAmount) => testingUserFactory(usersAmount)

module.exports = { createMockedUsers }
