import express, { Router } from 'express'

import { createUser, getUserProfile, CREATED, updateUserProfile } from '../../../domain'
import { UserDomainModel } from '../../../domain/models'

import { NewUserInputDto, NewUserProfileDto } from '../../dtos'
import { mapNewUserFromDtoToDomainModel } from '../../mappers'
import { ensureAuthenticated } from '../middlewares'
import { RequestDto } from '../serverDtos'

const userRoutes: Router = express.Router()

userRoutes.post('/signin', async (req, res, next) => {
  const newUserData = req.body as NewUserInputDto

  try {
    await createUser(mapNewUserFromDtoToDomainModel(newUserData))
    res.status(CREATED).end('User created')
  } catch (error) {
    next(error)
  }
})

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
