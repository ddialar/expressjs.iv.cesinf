import { userDataSource } from '../../../../infrastructure/dataSources'
import { mongodb } from '../../../../infrastructure/orm'
import { UpdatingUserError } from '../../../errors'
import { NewUserDomainModel, UserDomainModel } from '../../../models'
import { testingUsers } from '../../../../test/fixtures'

import { logout } from '../../authentication.services'
import { UserDto } from '../../../../infrastructure/dtos'

const { username, password, email, token } = testingUsers[0]

describe('[SERVICES] Authentication - logout', () => {
  const { connect, disconnect, models: { User } } = mongodb
  const mockedUserData: NewUserDomainModel & { token: string } = {
    username,
    password,
    email,
    token
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

  it('must logout the user and remove the persisted token', async (done) => {
    const { username } = mockedUserData
    const authenticatedUser = (await User.findOne({ username }))?.toJSON() as UserDto
    expect(authenticatedUser.token).toBe(token)

    const { _id: userId } = authenticatedUser
    await logout(userId)

    const unauthenticatedUser = (await User.findOne({ username }))?.toJSON() as UserDomainModel

    expect(unauthenticatedUser.token).toBeNull()

    done()
  })

  it('must throw an INTERNAL_SERVER_ERROR (500) when the updating logout user data process fails', async (done) => {
    jest.spyOn(userDataSource, 'updateUserById').mockImplementation(() => {
      throw new Error('Testing Error')
    })

    const { username } = mockedUserData
    const { _id: userId } = (await User.findOne({ username }))?.toJSON() as UserDto

    try {
      await logout(userId)
    } catch (error) {
      expect(error).toStrictEqual(new UpdatingUserError(`Error updating user '${userId}' logout data. ${error.message}`))
    }

    jest.spyOn(userDataSource, 'updateUserById').mockRestore()

    done()
  })
})
