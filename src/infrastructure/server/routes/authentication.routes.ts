import express, { Router } from 'express'
import { login } from '../../../domain'

import { LoginInputParamsDto } from '../../dtos'

const authenticationRoutes: Router = express.Router()

authenticationRoutes.post('/login', async (req, res, next) => {
  const { username, password } = req.body as LoginInputParamsDto
  try {
    res.json(await login(username, password))
  } catch (error) {
    next(error)
  }
})
