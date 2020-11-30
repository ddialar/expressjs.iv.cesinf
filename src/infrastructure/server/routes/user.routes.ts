import express, { Router } from 'express'

import { getUserProfile, updateUserProfile } from '../../../domain'
import { UserDomainModel } from '../../../domain/models'

import { NewUserProfileDto } from '../../dtos'
import { ensureAuthenticated } from '../middlewares'
import { RequestDto } from '../serverDtos'

const userRoutes: Router = express.Router()

userRoutes.get('/profile', ensureAuthenticated, async (req: RequestDto, res, next) => {
  const { id } = req.user as UserDomainModel

  try {
    res.json(await getUserProfile(id))
  } catch (error) {
    next(error)
  }
})

userRoutes.put('/profile', ensureAuthenticated, async (req: RequestDto, res, next) => {
  // TODO Retrieve the user ID from the request.
  // const { id } = req.user as UserDomainModel
  // TODO Retrieve the new profile data.
  // const newProfileData = req.body as NewUserProfileDto

  try {
    // TODO Update the profile
    // res.json(await updateUserProfile(id, newProfileData))
  } catch (error) {
    next(error)
  }
})

export { userRoutes }
