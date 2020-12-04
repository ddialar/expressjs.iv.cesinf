import { connect, disconnect } from '../../../core'
import { User } from '../../../models'
import { UserDto, NewUserDatabaseDto } from '../../../../../dtos'
import { testingUsers, testingNonPersistedUsername, cleanUsersCollection } from '../../../../../../test/fixtures'

import { getByUsername } from '../../user.mongodb.requests'

const { username, password, email } = testingUsers[0]

describe('[ORM] MongoDB - getByUsername', () => {
  const mockedUserData: NewUserDatabaseDto = {
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
    const username = testingNonPersistedUsername
    const retrievedUser = await getByUsername(username)
    expect(retrievedUser).toBeNull()

    done()
  })

  it('must retrieve the persisted user', async (done) => {
    const newUserData: NewUserDatabaseDto = { ...mockedUserData }
    await (new User(newUserData)).save()

    const username = newUserData.username
    const retrievedUser = await getByUsername(username) as UserDto

    const expectedFields = ['_id', 'username', 'password', 'email', 'name', 'surname', 'avatar', 'token', 'enabled', 'deleted', 'lastLoginAt', 'createdAt', 'updatedAt']
    const retrievedUserFields = Object.keys(retrievedUser).sort()
    expect(retrievedUserFields.sort()).toEqual(expectedFields.sort())

    expect(retrievedUser._id).not.toBeNull()
    expect(retrievedUser.username).toBe(newUserData.username)
    expect(retrievedUser.password).toBe(newUserData.password)
    expect(retrievedUser.email).toBe(newUserData.email)
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
})
