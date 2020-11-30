import supertest, { SuperTest, Test } from 'supertest'

import { server } from '../../../server'
import { mongodb } from '../../../../orm'

import { BAD_REQUEST, OK, FORBIDDEN, UNAUTHORIZED, INTERNAL_SERVER_ERROR } from '../../../../../domain/errors'
import { UserProfileDomainModel } from '../../../../../domain/models'
import { userDataSource } from '../../../../dataSources'
import { UserProfileDto } from '../../../../dtos'

import { testingUsers, testingValidJwtTokenForNonPersistedUser, testingExpiredJwtToken } from '../../../../../test/fixtures'

const { username, password, email, avatar, name, surname, token: validToken } = testingUsers[0]

interface TestingProfileDto extends UserProfileDto {
  password: string
}

// TODO Start working on this testing suite
describe('[API] - User endpoints', () => {
  // TODO Initialize the global testing suite
  // const { connect, disconnect, models: { User } } = mongodb

  // let request: SuperTest<Test>

  // beforeAll(async () => {
  //   request = supertest(server)
  //   await connect()
  // })

  // afterAll(async () => {
  //   await disconnect()
  // })

  describe('[GET] /profile', () => {
    // TODO Initialize the testing suite
    // const mockedUserData: TestingProfileDto = {
    //   username,
    //   password,
    //   email,
    //   avatar,
    //   name,
    //   surname
    // }

    // beforeEach(async () => {
    //   await User.deleteMany({})
    //   await (new User(mockedUserData)).save()
    // })

    // afterEach(async () => {
    //   await User.deleteMany({})
    // })

    xit('must return a 200 (OK) and the user\'s profile data', async (done) => {
      // const token = `bearer ${validToken}`
      // await request
      //   .get('/profile')
      //   .set('Authorization', token)
      //   .expect(OK)
      //   .then(async ({ body }) => {
      //     const userProfile = body as UserProfileDomainModel
      //     const expectedFields = ['username', 'email', 'name', 'surname', 'avatar']

      //     const userProfileFields = Object.keys(userProfile).sort()
      //     expect(userProfileFields.sort()).toEqual(expectedFields.sort())

      //     expect(userProfile.username).toBe(mockedUserData.username)
      //     expect(userProfile.email).toBe(mockedUserData.email)
      //     expect(userProfile.name).toBe(mockedUserData.name)
      //     expect(userProfile.surname).toBe(mockedUserData.surname)
      //     expect(userProfile.avatar).toBe(mockedUserData.avatar)
      //   })

      done()
    })

    xit('must return a FORBIDDEN (403) error when we send an empty token', async (done) => {
      // const token = ''
      // const errorMessage = 'Required token was not provided'

      // await request
      //   .get('/profile')
      //   .set('Authorization', token)
      //   .expect(FORBIDDEN)
      //   .then(async ({ text }) => {
      //     expect(text).toBe(errorMessage)
      //   })

      done()
    })

    xit('must return an UNAUTHORIZED (401) error when we send an expired token', async (done) => {
      // const token = `bearer ${testingExpiredJwtToken}`
      // const errorMessage = 'Token expired'

      // await request
      //   .get('/profile')
      //   .set('Authorization', token)
      //   .expect(UNAUTHORIZED)
      //   .then(async ({ text }) => {
      //     expect(text).toBe(errorMessage)
      //   })

      done()
    })

    xit('must return an BAD_REQUEST (400) error when we send an expired token', async (done) => {
      // const token = `bearer ${testingValidJwtTokenForNonPersistedUser}`
      // const errorMessage = 'User does not exist'

      // await request
      //   .get('/profile')
      //   .set('Authorization', token)
      //   .expect(BAD_REQUEST)
      //   .then(async ({ text }) => {
      //     expect(text).toBe(errorMessage)
      //   })

      done()
    })

    xit('must return an INTERNAL_SERVER_ERROR (500) when the updating logout user data process fails', async (done) => {
      // jest.spyOn(userDataSource, 'getUserProfileById').mockImplementation(() => {
      //   throw new Error('Testing Error')
      // })

      // const token = `bearer ${validToken}`
      // const errorMessage = 'Internal Server Error'

      // await request
      //   .get('/profile')
      //   .set('Authorization', token)
      //   .expect(INTERNAL_SERVER_ERROR)
      //   .then(async ({ text }) => {
      //     expect(text).toBe(errorMessage)
      //   })

      // jest.spyOn(userDataSource, 'getUserProfileById').mockRestore()

      done()
    })
  })
})
