import express, { Router } from 'express'
import { login, logout, OK } from '../../../domain'

import { LoginInputParamsDto } from '../../dtos'
import { RequestDto } from '../serverDtos'
import { ensureAuthenticated } from '../middlewares'
import { UserDomainModel } from '../../../domain/models'

const authenticationRoutes: Router = express.Router()

authenticationRoutes.post('/login', async (req, res, next) => {
  const { username, password } = req.body as LoginInputParamsDto

  try {
    res.json(await login(username, password))
  } catch (error) {
    next(error)
  }
})

authenticationRoutes.post('/logout', ensureAuthenticated, async (req: RequestDto, res, next) => {
  const { id: userId } = req.user as UserDomainModel

  try {
    await logout(userId)
    res.status(OK).end('User logged out successfully')
  } catch (error) {
    next(error)
  }
})

export { authenticationRoutes }
