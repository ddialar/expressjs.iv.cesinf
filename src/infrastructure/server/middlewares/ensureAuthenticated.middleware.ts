import { Response, NextFunction } from 'express'
import { RequiredTokenNotProvidedError, UserDoesNotExistError } from '../../../domain/errors'
import { checkToken, getUserByUsername } from '../../../domain'
import { RequestDto } from '../serverDtos'

export const ensureAuthenticated = async (req: RequestDto, res: Response, next: NextFunction) => {
  try {
    const token = (req.get('authorization') ?? '').split(' ')[1]
    if (!token) {
      throw new RequiredTokenNotProvidedError()
    }
    const { sub: username } = checkToken(token)
    const persistedUser = await getUserByUsername(username)
    if (!persistedUser) {
      throw new UserDoesNotExistError(`Username '${username}' doesn't exists in logout process.`)
    }
    req.user = persistedUser
    return next()
  } catch (error) {
    return next(error)
  }
}
