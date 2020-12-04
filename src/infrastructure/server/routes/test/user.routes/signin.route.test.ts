import supertest, { SuperTest, Test } from 'supertest'
import { compare } from 'bcrypt'

import { server } from '../../../server'
import { mongodb } from '../../../../orm'

import { CREATED, BAD_REQUEST } from '../../../../../domain/errors'
import { NewUserInputDto } from '../../../../dtos'

import { testingUsers, cleanUsersCollection, getUserByUsername, saveUser } from '../../../../../test/fixtures'

const { email, password } = testingUsers[0]

describe('[POST] /signin', () => {
  const { connect, disconnect } = mongodb
  let request: SuperTest<Test>

  beforeAll(async () => {
    request = supertest(server)
    await connect()
  })

  beforeEach(async () => {
    await cleanUsersCollection()
  })

  afterAll(async () => {
    await cleanUsersCollection()
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

        const retrievedUser = await getUserByUsername(newUserData.email)

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

        expect(retrievedUser.name).toBe('')
        expect(retrievedUser.surname).toBe('')
        expect(retrievedUser.avatar).toBe('')
        expect(retrievedUser.token).toBe('')
        expect(retrievedUser.lastLoginAt).toBe('')
      })

    done()
  })

  it('must return a 400 (BAD_REQUEST) when we try to persist an already user', async (done) => {
    const newUserData = { ...mockedUserData }
    const errorMessage = 'User already exists'

    await saveUser({ ...newUserData, username: newUserData.email })

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
