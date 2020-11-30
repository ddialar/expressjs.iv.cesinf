import { connect, disconnect } from '../../../core'
import { User } from '../../../models'
import { UserDto, UserProfileDto, NewUserProfileDto } from '../../../../../dtos'

import { updateProfileById } from '../../user.mongodb.requests'
import { testingUsers } from '../../../../../../test/fixtures'

const { username, password, email, avatar, name, surname, token } = testingUsers[0]

interface TestingProfileDto extends UserProfileDto {
  password: string
  token: string
}

describe('[ORM] MongoDB - updateProfileById', () => {
  const mockedUserData: TestingProfileDto = {
    username,
    password,
    email,
    avatar,
    name,
    surname,
    token
  }

  beforeAll(async () => {
    await connect()
  })

  beforeEach(async () => {
    await User.deleteMany({})
    await (new User(mockedUserData)).save()
  })

  afterAll(async () => {
    await User.deleteMany({})
    await disconnect()
  })

  it('must update the user\'s profile successfully', async (done) => {
    const originalUser = (await User.findOne({ username }))?.toJSON() as UserDto

    const expectedFields = ['_id', 'username', 'password', 'email', 'name', 'surname', 'avatar', 'token', 'enabled', 'deleted', 'lastLoginAt', 'createdAt', 'updatedAt']
    const originalUserFields = Object.keys(originalUser).sort()
    expect(originalUserFields.sort()).toEqual(expectedFields.sort())

    expect(originalUser._id).not.toBeNull()
    expect(originalUser.username).toBe(mockedUserData.username)
    expect(originalUser.password).toBe(mockedUserData.password)
    expect(originalUser.email).toBe(mockedUserData.email)
    expect(originalUser.name).toBe(mockedUserData.name)
    expect(originalUser.surname).toBe(mockedUserData.surname)
    expect(originalUser.avatar).toBe(mockedUserData.avatar)
    expect(originalUser.token).toBe(mockedUserData.token)
    expect(originalUser.enabled).toBeTruthy()
    expect(originalUser.deleted).toBeFalsy()
    expect(originalUser.createdAt).not.toBeNull()
    expect(originalUser.updatedAt).not.toBeNull()

    expect(originalUser.lastLoginAt).toBeNull()

    const { name: newName, surname: newSurname, avatar: newAvatar } = testingUsers[1]
    const payload: NewUserProfileDto = {
      name: newName,
      surname: newSurname,
      avatar: newAvatar
    }

    await updateProfileById(originalUser._id, payload)

    const updatedUser = (await User.findOne({ username }))?.toJSON() as UserDto

    const updatedUserFields = Object.keys(updatedUser).sort()
    expect(updatedUserFields.sort()).toEqual(expectedFields.sort())

    expect(updatedUser._id).toEqual(originalUser._id)
    expect(updatedUser.username).toBe(originalUser.username)
    expect(updatedUser.password).toBe(originalUser.password)
    expect(updatedUser.token).toBe(originalUser.token)
    expect(updatedUser.email).toBe(originalUser.email)
    expect(updatedUser.createdAt).toEqual(originalUser.createdAt)
    expect(updatedUser.enabled).toBe(originalUser.enabled)
    expect(updatedUser.deleted).toBe(originalUser.deleted)
    expect(updatedUser.updatedAt).not.toBe(originalUser.updatedAt)
    expect(updatedUser.lastLoginAt).toBe(originalUser.lastLoginAt)

    expect(updatedUser.name).toBe(payload.name)
    expect(updatedUser.surname).toBe(payload.surname)
    expect(updatedUser.avatar).toBe(payload.avatar)

    done()
  })
})
