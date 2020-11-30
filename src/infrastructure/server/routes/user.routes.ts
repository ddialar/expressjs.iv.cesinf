import express, { Router } from 'express'

import { getUserProfile } from '../../../domain'
import { UserDomainModel } from '../../../domain/models'

import { ensureAuthenticated } from '../middlewares'
import { RequestDto } from '../serverDtos'

const userRoutes: Router = express.Router()

userRoutes.get('/profile', ensureAuthenticated, async (req: RequestDto, res, next) => {
  // TODO Retrieve the user ID from the request.
  const { id } = req.user as UserDomainModel

  try {
    // TODO Request the profile
    res.json(await getUserProfile(id))
  } catch (error) {
    next(error)
  }
})

export { userRoutes }
