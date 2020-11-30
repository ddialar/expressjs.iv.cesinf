// import { createServer } from 'http'
// import express, { Request, Response, NextFunction } from 'express'
// import bodyParser from 'body-parser'

// import { mongodb } from '../orm'

// import { verifyIfUsernameAlreadyExists, hashPassword } from '../../domain/services'
// import { ApiError, NewUserAlreadyExistsError } from '../../domain/errors'
// import { userDataSource } from '../dataSources'

// import { Post } from '../../domain/models'
// import { NewUserDto } from '../dtos'

// import { handleHttpError } from './middlewares'

// const app = express()
// const port: number = parseInt(process.env.SERVER_PORT ?? '3000', 10)

// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

// // REFACTOR: Remove this testing endpoint
// app.get('/', (req, res) => {
//   res.send('Hello TypeScript!')
// })

// app.get('/posts', (req, res) => {
//   // TODO: Retrieve this data from the specific service.
//   const result: Post[] = [
//     {
//       id: '123456',
//       body: 'Sample post',
//       createdAt: 'today',
//       username: 'user'
//     }
//   ]

//   res.json(result)
// })

// app.post('/signin', async (req, res, next) => {
//   const newUserData = req.body as NewUserDto

//   // TODO: To check username is already persisted.
//   const usernameExists = await verifyIfUsernameAlreadyExists(newUserData.username)
//   // TODO: If the username already exists, return a BAD_REQUEST (400).
//   if (usernameExists) {
//     next(new NewUserAlreadyExistsError(`Username '${newUserData.username}' already exists.`))
//   } else {
//     // TODO: To Hash the password using bcrypt.
//     const hashedPassword = await hashPassword(newUserData.password)
//     // TODO: Persist the new user.
//     const newUserDataWithHashedPassword: NewUserDto = {
//       username: newUserData.username,
//       password: hashedPassword,
//       email: newUserData.email
//     }
//     await userDataSource.createUser(newUserDataWithHashedPassword)
//     // TODO: Return CREATED (201).

//     console.log(JSON.stringify(newUserData))

//     res.send('New user record success!')
//   }
// })

// app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => handleHttpError(err, res))

// const server = createServer(app)

// const runServer = async () => {
//   await mongodb.connect()
//   server.listen(port, () => console.log(`[INFO ] - Server running in http://localhost:${port}`))
// }

// const stopServer = async () => {
//   console.log('Clossing database connection...')
//   await mongodb.disconnect()
//   console.log('Clossing server...')
//   server.close()
// }

// export {
//   server,
//   runServer,
//   stopServer
// }

import { createServer } from 'http'
import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'

import { serve as swaggerServe, setup as swaggerSetup } from 'swagger-ui-express'
import { swaggerDocument, swaggerOptions } from './apidoc'

import { ApiError } from '../../domain/errors'
import { authenticationRoutes, userRoutes, postRoutes } from './routes'

import { handleHttpError } from './middlewares'

import { createLogger } from '../../common'
const logger = createLogger('server')

const app = express()
const port: number = parseInt(process.env.SERVER_PORT ?? '3000', 10)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/__/apidoc', swaggerServe, swaggerSetup(swaggerDocument, swaggerOptions))

app.use(authenticationRoutes)
app.use(userRoutes)
app.use(postRoutes)

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => handleHttpError(err, res))

const server = createServer(app)

const runServer = () => server.listen(port, () => logger.info(`Server running in http://localhost:${port}`))

const stopServer = () => {
  logger.info('Clossing server...')
  server.close()
}

export { server, runServer, stopServer }
