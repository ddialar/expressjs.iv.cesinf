import { connect, disconnect } from '../../../core'
import { User } from '../../../models'
import { UserDto, NewUserDatabaseDto } from '../../../../../dtos'

import { testingUsers } from '../../../../../../test/fixtures'

import { create } from '../../user.mongodb.requests'

const { username, password, email } = testingUsers[0]

describe('[ORM] MongoDB - create', () => {
  const mockedUserData: NewUserDatabaseDto = {
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

  it('must persist the new user successfully', async (done) => {
    const newUserData = { ...mockedUserData }
    await create(newUserData)

    const retrievedUser = (await User.findOne({ username: newUserData.username }))?.toJSON() as UserDto

    const expectedFields = ['_id', 'username', 'password', 'email', 'name', 'surname', 'avatar', 'token', 'enabled', 'deleted', 'lastLoginAt', 'createdAt', 'updatedAt']
    const retrievedUserFields = Object.keys(retrievedUser).sort()
    expect(retrievedUserFields.sort()).toEqual(expectedFields.sort())

    expect(retrievedUser._id).not.toBeNull()
    expect(retrievedUser.username).toBe(mockedUserData.username)
    expect(retrievedUser.password).toBe(mockedUserData.password)
    expect(retrievedUser.email).toBe(mockedUserData.email)
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

  it('must throw an error when we try to persist the same username', async (done) => {
    const newUserData = { ...mockedUserData }
    await create(newUserData)

    // MongoError: E11000 duplicate key error collection: ts-course-test.users index: username_1 dup key: { username: "test@mail.com" }
    await expect(create(newUserData)).rejects.toThrow(/duplicate key error/)

    done()
  })
})
