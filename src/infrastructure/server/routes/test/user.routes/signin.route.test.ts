import supertest, { SuperTest, Test } from 'supertest'
import { compare } from 'bcrypt'

import { server } from '../../../server'
import { mongodb } from '../../../../orm'

import { CREATED, BAD_REQUEST } from '../../../../../domain/errors'
import { NewUserInputDto, UserDto } from '../../../../dtos'

import { testingUsers } from '../../../../../test/fixtures'

const { email, password } = testingUsers[0]

describe('[POST] /signin', () => {
  const { connect, disconnect, models: { User } } = mongodb
  let request: SuperTest<Test>

  beforeAll(async () => {
    request = supertest(server)
    await connect()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  afterAll(async () => {
    await User.deleteMany({})
    await disconnect()
  })

  const mockedUserData: NewUserInputDto = {
    email,
    password
  }

  it('must return a 201 (CREATED) and a record the new user', async (done) => {
    const newUserData = { ...mockedUserData }
    await request
      .post('/signin')
      .send(newUserData)
      .expect(CREATED)
      .then(async ({ text }) => {
        expect(text).toBe('User created')

        const retrievedUser = (await User.findOne({ username: newUserData.email }))?.toJSON() as UserDto

        const expectedFields = ['_id', 'username', 'password', 'email', 'name', 'surname', 'avatar', 'token', 'enabled', 'deleted', 'lastLoginAt', 'createdAt', 'updatedAt']
        const retrievedUserFields = Object.keys(retrievedUser).sort()
        expect(retrievedUserFields.sort()).toEqual(expectedFields.sort())

        expect(retrievedUser._id).not.toBeNull()
        expect(retrievedUser.username).toBe(newUserData.email)
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
      })

    done()
  })

  it('must return a 400 (BAD_REQUEST) when we try to persist an already user', async (done) => {
    const newUserData = { ...mockedUserData }
    const errorMessage = 'User already exists'

    await (new User({ ...newUserData, username: newUserData.email })).save()

    await request
      .post('/signin')
      .send(newUserData)
      .expect(BAD_REQUEST)
      .then(({ text }) => {
        expect(text).toBe(errorMessage)
      })

    done()
  })
})
