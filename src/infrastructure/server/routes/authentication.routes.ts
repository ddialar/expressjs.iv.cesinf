import express, { Router } from 'express'
import { login } from '../../../domain'

import { LoginInputParamsDto } from '../../dtos'

const authenticationRoutes: Router = express.Router()

authenticationRoutes.post('/login', async (req, res, next) => {
  // TODO Retrieve the username and password from the request
  const { username, password } = req.body as LoginInputParamsDto
  try {
    // TODO Run the login
    res.json(await login(username, password))
  } catch (error) {
    next(error)
  }
})

export { authenticationRoutes }
