import supertest, { SuperTest, Test } from 'supertest'

import { server } from '../../../server'
import { mongodb } from '../../../../orm'

import { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR, GettingUserError, CheckingPasswordError } from '../../../../../domain/errors'
import { NewUserDatabaseDto, LoginInputParamsDto } from '../../../../dtos'
import { userDataSource } from '../../../../dataSources'

import * as hashServices from '../../../../../domain/services/hash.services'
import * as token from '../../../../authentication/token'
import { testingUsers, testingValidPlainPassword } from '../../../../../test/fixtures'

const { username, password, email } = testingUsers[0]

// TODO Start working on this testing suite
describe('[API] - Authentication endpoints', () => {
  describe('[POST] /login', () => {
    // TODO Prepare data to be persisted on the database
    const { connect, disconnect, models: { User } } = mongodb

    const mockedUserData: NewUserDatabaseDto = {
      username,
      password,
      email
    }

    // TODO Initialize the testing suite
    let request: SuperTest<Test>

    beforeAll(async () => {
      request = supertest(server)
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

    it('must return a 200 (OK) and the user authentication data', async (done) => {
      const loginData: LoginInputParamsDto = {
        username,
        password: testingValidPlainPassword
      }
      await request
        .post('/login')
        .send(loginData)
        .expect(OK)
        .then(async ({ body }) => {
          const expectedFields = ['username', 'avatar', 'token']
          const retrievedAuthenticationDataFields = Object.keys(body).sort()
          expect(retrievedAuthenticationDataFields.sort()).toEqual(expectedFields.sort())

          expect(body.username).toBe(loginData.username)
          expect(body.avatar).toBeNull()
          expect(body.token).not.toBeNull()
        })

      done()
    })

    it('must throw an UNAUTHORIZED (401) error when we use a non persisted username', async (done) => {
      const loginData: LoginInputParamsDto = {
        username: 'user@test.com',
        password: testingValidPlainPassword
      }
      const errorMessage = 'Username not valid'

      await request
        .post('/login')
        .send(loginData)
        .expect(UNAUTHORIZED)
        .then(async ({ text }) => {
          expect(text).toBe(errorMessage)
        })

      done()
    })

    xit('must throw an UNAUTHORIZED (401) error when we use a wrong password', async (done) => {
      // const loginData: LoginInputParamsDto = {
      //   username,
      //   password: 'wr0np4$$w0rd'
      // }
      // const errorMessage = 'Password not valid'

      // await request
      //   .post('/login')
      //   .send(loginData)
      //   .expect(UNAUTHORIZED)
      //   .then(async ({ text }) => {
      //     expect(text).toBe(errorMessage)
      //   })

      done()
    })

    xit('must throw an INTERNAL_SERVER_ERROR (500) when the retrieving user process fails', async (done) => {
      // jest.spyOn(userDataSource, 'getUserByUsername').mockImplementation(() => {
      //   throw new GettingUserError('Testing error')
      // })

      // const loginData: LoginInputParamsDto = {
      //   username,
      //   password: testingValidPlainPassword
      // }
      // const errorMessage = 'Internal Server Error'

      // await request
      //   .post('/login')
      //   .send(loginData)
      //   .expect(INTERNAL_SERVER_ERROR)
      //   .then(async ({ text }) => {
      //     expect(text).toBe(errorMessage)
      //   })

      // jest.spyOn(userDataSource, 'getUserByUsername').mockRestore()

      done()
    })

    xit('must throw an INTERNAL_SERVER_ERROR (500) when the checking password process fails', async (done) => {
      // jest.spyOn(hashServices, 'checkPassword').mockImplementation(() => {
      //   throw new CheckingPasswordError('Error checking password')
      // })

      // const loginData: LoginInputParamsDto = {
      //   username,
      //   password: testingValidPlainPassword
      // }
      // const errorMessage = 'Internal Server Error'

      // await request
      //   .post('/login')
      //   .send(loginData)
      //   .expect(INTERNAL_SERVER_ERROR)
      //   .then(async ({ text }) => {
      //     expect(text).toBe(errorMessage)
      //   })

      // jest.spyOn(hashServices, 'checkPassword').mockRestore()

      done()
    })

    xit('must throw an INTERNAL_SERVER_ERROR (500) when the getting token process fails', async (done) => {
      // jest.spyOn(token, 'generateToken').mockImplementation(() => {
      //   throw new Error('Testing Error')
      // })

      // const loginData: LoginInputParamsDto = {
      //   username,
      //   password: testingValidPlainPassword
      // }
      // const errorMessage = 'Internal Server Error'

      // await request
      //   .post('/login')
      //   .send(loginData)
      //   .expect(INTERNAL_SERVER_ERROR)
      //   .then(async ({ text }) => {
      //     expect(text).toBe(errorMessage)
      //   })

      // jest.spyOn(token, 'generateToken').mockRestore()

      done()
    })

    xit('must throw an INTERNAL_SERVER_ERROR (500) when the updating login user data process fails', async (done) => {
      // jest.spyOn(userDataSource, 'updateUserById').mockImplementation(() => {
      //   throw new Error('Testing Error')
      // })

      // const loginData: LoginInputParamsDto = {
      //   username,
      //   password: testingValidPlainPassword
      // }
      // const errorMessage = 'Internal Server Error'

      // await request
      //   .post('/login')
      //   .send(loginData)
      //   .expect(INTERNAL_SERVER_ERROR)
      //   .then(async ({ text }) => {
      //     expect(text).toBe(errorMessage)
      //   })

      // jest.spyOn(userDataSource, 'updateUserById').mockRestore()

      done()
    })
  })
})
