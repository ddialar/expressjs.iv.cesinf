import { WrongUsernameError } from './../../../errors/AuthenticationErrors/401.unauthorized/WrongUsernameError'
import { UpdatingUserError } from './../../../errors/UserErrors/500.internal.server.error/UpdatingUserError'
import { CheckingPasswordError } from './../../../errors/AuthenticationErrors/500.internal.server.error/CheckingPasswordError'
import { userDataSource } from '../../../../infrastructure/dataSources'
import { mongodb } from '../../../../infrastructure/orm'
import { GettingTokenError, GettingUserError, WrongPasswordError } from '../../../errors'
import { UserDomainModel, NewUserDomainModel } from '../../../models'
import * as hashServices from '../../hash.services'
import * as token from '../../../../infrastructure/authentication/token'
import { testingUsers, testingValidPlainPassword } from '../../../../test/fixtures'

import { login } from '../../authentication.services'

const { username, password, email } = testingUsers[0]

describe('[SERVICES] Authentication - login', () => {
  const { connect, disconnect, models: { User } } = mongodb
  const plainPassword = testingValidPlainPassword
  const mockedUserData: NewUserDomainModel = {
    username,
    password,
    email
  }

  beforeAll(async () => {
    await connect()
    await User.deleteMany({})
  })

  beforeEach(async () => {
    await User.deleteMany({})
    await (new User(mockedUserData)).save()
  })

  afterAll(async () => {
    await disconnect()
  })

  it('must authenticate the user and return a valid identification object', async (done) => {
    const { username } = mockedUserData
    const password = plainPassword

    const unauthenticatedUser = (await User.findOne({ username }))?.toJSON() as UserDomainModel

    expect(unauthenticatedUser.token).toBeNull()
    expect(unauthenticatedUser.avatar).toBeNull()
    expect(unauthenticatedUser.lastLoginAt).toBeNull()

    const authenticationData = await login(username, password)

    expect(authenticationData.token).not.toBeNull()
    expect(authenticationData.username).toBe(username)
    expect(authenticationData.avatar).toBeNull()

    const authenticatedUser = (await User.findOne({ username: username }))?.toJSON() as UserDomainModel

    expect(authenticatedUser.token).toBe(authenticationData.token)
    expect(authenticatedUser.lastLoginAt).not.toBeNull()

    done()
  })

  it('must throw an UNAUTHORIZED (401) error when we use a non persisted username', async (done) => {
    const username = 'user@test.com'
    const password = plainPassword

    await expect(login(username, password)).rejects.toThrowError(new WrongUsernameError(`User with username '${username}' doesn't exist in login process.`))

    done()
  })

  it('must throw an UNAUTHORIZED (401) error when we use a wrong password', async (done) => {
    const { username } = mockedUserData
    const password = 'wr0np4$$w0rd'

    await expect(login(username, password)).rejects.toThrowError(new WrongPasswordError(`Password missmatches for username '${username}'.`))

    done()
  })

  it('must throw an INTERNAL_SERVER_ERROR (500) when the retrieving user process fails', async (done) => {
    jest.spyOn(userDataSource, 'getUserByUsername').mockImplementation(() => {
      throw new GettingUserError('Testing error')
    })

    const { username } = mockedUserData
    const password = plainPassword

    try {
      await login(username, password)
    } catch (error) {
      expect(error).toStrictEqual(new GettingUserError(`Error retrieving user with username '${username}' login data. ${error.message}`))
    }

    jest.spyOn(userDataSource, 'getUserByUsername').mockRestore()

    done()
  })

  it('must throw an INTERNAL_SERVER_ERROR (500) when the checking password process fails', async (done) => {
    jest.spyOn(hashServices, 'checkPassword').mockImplementation(() => {
      throw new CheckingPasswordError('Error checking password')
    })

    const { username } = mockedUserData
    const password = plainPassword

    try {
      await login(username, password)
    } catch (error) {
      expect(error).toStrictEqual(new CheckingPasswordError(`Error checking password. ${error.message}`))
    }

    jest.spyOn(hashServices, 'checkPassword').mockRestore()

    done()
  })

  it('must throw an INTERNAL_SERVER_ERROR (500) when the getting token process fails', async (done) => {
    jest.spyOn(token, 'generateToken').mockImplementation(() => {
      throw new Error('Testing Error')
    })

    const { username } = mockedUserData
    const password = plainPassword

    try {
      await login(username, password)
    } catch (error) {
      expect(error).toStrictEqual(new GettingTokenError(`Error getting token for username '${username}'. ${error.message}`))
    }

    jest.spyOn(token, 'generateToken').mockRestore()

    done()
  })

  it('must throw an INTERNAL_SERVER_ERROR (500) when the updating login user data process fails', async (done) => {
    jest.spyOn(userDataSource, 'updateUserById').mockImplementation(() => {
      throw new Error('Testing Error')
    })

    const { username } = mockedUserData
    const password = plainPassword

    const { id: userId } = (await User.findOne({ username }))?.toJSON() as UserDomainModel

    try {
      await login(username, password)
    } catch (error) {
      expect(error).toStrictEqual(new UpdatingUserError(`Error updating user '${userId}' login data. ${error.message}`))
    }

    jest.spyOn(userDataSource, 'updateUserById').mockRestore()

    done()
  })
})
