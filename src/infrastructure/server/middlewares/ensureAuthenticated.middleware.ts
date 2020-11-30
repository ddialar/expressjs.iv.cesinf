import { Response, NextFunction } from 'express'
import { RequiredTokenNotProvidedError, UserDoesNotExistError } from '../../../domain/errors'
import { checkToken, getUserByUsername } from '../../../domain'
import { RequestDto } from '../serverDtos'

export const ensureAuthenticated = async (req: RequestDto, res: Response, next: NextFunction) => {
  try {
    const token = (req.get('authorization') ?? '').split(' ')[1]
    // TODO: If token was not provided, return a FORBIDE (403) error
    if (!token) {
      throw new RequiredTokenNotProvidedError()
    }
    // TODO: To check the token is still valid
    const { sub: username } = checkToken(token)
    // TODO: To retrieve the user by the token
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
