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
  const { id } = req.user as UserDomainModel
  const newProfileData = req.body as NewUserProfileDto

  try {
    res.json(await updateUserProfile(id, newProfileData))
  } catch (error) {
    next(error)
  }
})

export { userRoutes }
