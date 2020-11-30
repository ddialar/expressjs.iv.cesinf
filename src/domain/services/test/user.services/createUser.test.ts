import { compare } from 'bcrypt'
import { mongodb } from '../../../../infrastructure/orm'
import { userDataSource } from '../../../../infrastructure/dataSources'
import { NewUserDomainModel } from '../../../models'
import { NewUserAlreadyExistsError, CreatingUserError } from '../../../errors'
import { testingUsers } from './../../../../test/fixtures'

import { createUser } from '../..'
import { UserDto } from '../../../../infrastructure/dtos'

const { username, password, email } = testingUsers[0]

describe('[SERVICES] User - createUser', () => {
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
    await User.deleteMany({})
  })

  afterAll(async () => {
    await User.deleteMany({})
    await disconnect()
  })

  it('must persist the user successfully', async (done) => {
    const newUserData: NewUserDomainModel = { ...mockedUserData }

    await createUser(newUserData)

    const retrievedUser = (await User.findOne({ username: newUserData.username }))?.toJSON() as UserDto

    const expectedFields = ['_id', 'username', 'password', 'email', 'name', 'surname', 'avatar', 'token', 'enabled', 'deleted', 'lastLoginAt', 'createdAt', 'updatedAt']
    const retrievedUserFields = Object.keys(retrievedUser).sort()
    expect(retrievedUserFields.sort()).toEqual(expectedFields.sort())

    expect(retrievedUser._id).not.toBeNull()
    expect(retrievedUser.username).toBe(newUserData.username)
    expect(retrievedUser.password).toMatch(/^\$[$/.\w\d]{59}$/)
    expect((await compare(newUserData.password, retrievedUser.password))).toBeTruthy()
    expect(retrievedUser.email).toBe(newUserData.email)
    expect(retrievedUser.enabled).toBeTruthy()
    expect(retrievedUser.deleted).toBeFalsy()
    expect(retrievedUser.createdAt).not.toBeNull()
    expect(retrievedUser.updatedAt).not.toBeNull()

    expect(retrievedUser.name).toBeNull()
    expect(retrievedUser.surname).toBeNull()
    expect(retrievedUser.avatar).toBeNull()
    expect(retrievedUser.token).toBeNull()
    expect(retrievedUser.lastLoginAt).toBeNull()

    done()
  })

  it('must throw an INTERNAL_SERVER_ERROR (500) when the datasource throws an unexpected error', async (done) => {
    jest.spyOn(userDataSource, 'createUser').mockImplementation(() => {
      throw new CreatingUserError('Testing error')
    })

    const newUserData: NewUserDomainModel = { ...mockedUserData }

    try {
      await createUser(newUserData)
    } catch (error) {
      expect(error).toStrictEqual(new CreatingUserError(`Error updating user with username '${newUserData.username}' login data. ${error.message}`))
    }

    jest.spyOn(userDataSource, 'createUser').mockRestore()

    done()
  })

  it('must throw a BAD_REQUEST (400) error when we try to persist the same username', async (done) => {
    const newUserData = { ...mockedUserData }
    const expectedError = new NewUserAlreadyExistsError(`User with username '${newUserData.username}' already exists.`)

    await createUser(newUserData)
    await expect(createUser(newUserData)).rejects.toThrowError(expectedError)

    done()
  })
})
