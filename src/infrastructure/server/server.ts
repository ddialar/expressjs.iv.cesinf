import { createServer } from 'http'
import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'

import { ApiError } from '../../domain/errors'
// import { authenticationRoutes } from './routes'

import { handleHttpError } from './middlewares'

import { createLogger } from '../../common'
const logger = createLogger('server')

const app = express()
const port: number = parseInt(process.env.SERVER_PORT ?? '3000', 10)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// TODO Implement a really basic endpoint
// app.get('/hello', (req, res, next) => {
//   res.send('Hello ExpressJS Workshop')
// })

// app.use(authenticationRoutes)

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => handleHttpError(err, res))

const server = createServer(app)

const runServer = () => server.listen(port, () => logger.info(`Server running in http://localhost:${port}`))

const stopServer = () => {
  logger.info('Clossing server...')
  server.close()
}

// NOTE Check the 'app.ts' file as application entrypoint

export { server, runServer, stopServer }
