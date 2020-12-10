import { mongodb } from '../../../../infrastructure/orm'
import { userDataSource } from '../../../../infrastructure/dataSources'
import { UserDomainModel, NewUserDomainModel } from '../../../models'
import { GettingUserError } from '../../../errors'
import { testingUsers, cleanUsersCollection } from './../../../../test/fixtures'

import { getUserByUsername } from '../..'

const { username, password, email } = testingUsers[0]

describe('[SERVICES] User - getUserByUsername', () => {
  const { connect, disconnect, models: { User } } = mongodb

  const mockedUserData: NewUserDomainModel = {
    username,
    password,
    email
  }

  beforeAll(async () => {
    await connect()
  })

  beforeEach(async () => {
    await cleanUsersCollection()
  })

  afterAll(async () => {
    await cleanUsersCollection()
    await disconnect()
  })

  it('must not retrieve any user', async (done) => {
    const username = 'user@test.com'
    const retrievedUser = await getUserByUsername(username)
    expect(retrievedUser).toBeNull()

    done()
  })

  it('must retrieve the persisted user', async (done) => {
    const newUserData: NewUserDomainModel = { ...mockedUserData }

    await (new User(newUserData)).save()

    const username = newUserData.username
    const retrievedUser = await getUserByUsername(username) as UserDomainModel

    const expectedFields = ['id', 'username', 'password', 'email', 'name', 'surname', 'avatar', 'token', 'enabled', 'deleted', 'lastLoginAt', 'createdAt', 'updatedAt']
    const retrievedUserFields = Object.keys(retrievedUser).sort()
    expect(retrievedUserFields.sort()).toEqual(expectedFields.sort())

    expect(retrievedUser.id).not.toBeNull()
    expect(retrievedUser.username).toBe(mockedUserData.username)
    expect(retrievedUser.password).toBe(mockedUserData.password)
    expect(retrievedUser.email).toBe(mockedUserData.email)
    expect(retrievedUser.enabled).toBeTruthy()
    expect(retrievedUser.deleted).toBeFalsy()
    expect(retrievedUser.createdAt).not.toBeNull()
    expect(retrievedUser.updatedAt).not.toBeNull()

    expect(retrievedUser.name).toBe('')
    expect(retrievedUser.surname).toBe('')
    expect(retrievedUser.avatar).toBe('')
    expect(retrievedUser.token).toBe('')
    expect(retrievedUser.lastLoginAt).toBe('')

    done()
  })

  it('must throw an INTERNAL_SERVER_ERROR (500) when the datasource throws an unexpected error', async (done) => {
    jest.spyOn(userDataSource, 'getUserByUsername').mockImplementation(() => {
      throw new GettingUserError('Testing error')
    })

    const { username } = mockedUserData

    try {
      await getUserByUsername(username)
    } catch (error) {
      expect(error).toStrictEqual(new GettingUserError(`Error retrieving user with username '${username}' login data. ${error.message}`))
    }

    jest.spyOn(userDataSource, 'getUserByUsername').mockRestore()

    done()
  })
})
