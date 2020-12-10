import { AuthenticatedUserDomainModel } from '../models'
import { getUserByUsername, updateUserLoginData, updateUserLogoutData } from './user.services'
import { checkPassword } from './hash.services'
import { decodeToken, generateToken } from '../../infrastructure/authentication'
import { GettingTokenError, WrongUsernameError, WrongPasswordError, TokenExpiredError, CheckingTokenError } from '../errors'
import { DecodedJwtTokenDto } from '../../infrastructure/dtos'

const getToken = (username: string): string => {
  try {
    return generateToken(username)
  } catch ({ message }) {
    throw new GettingTokenError(`Error getting token for username '${username}'. ${message}`)
  }
}

export const checkToken = (token: string): DecodedJwtTokenDto => {
  try {
    return decodeToken(token)
  } catch ({ message }) {
    throw (message.match(/expired/))
      ? new TokenExpiredError(`Token '${token}' expired`)
      : new CheckingTokenError(`Error ckecking token '${token}'. ${message}`)
  }
}

export const login = async (username: string, password: string): Promise<AuthenticatedUserDomainModel> => {
  const persistedUser = await getUserByUsername(username)
  if (!persistedUser) {
    throw new WrongUsernameError(`User with username '${username}' doesn't exist in login process.`)
  }
  const validPassword = await checkPassword(password, persistedUser.password)
  if (!validPassword) {
    throw new WrongPasswordError(`Password missmatches for username '${username}' in login process.`)
  }
  const token = await getToken(username)
  await updateUserLoginData(persistedUser.id, token)

  return {
    token,
    username: persistedUser.username,
    avatar: persistedUser.avatar
  }
}

export const logout = async (userId: string): Promise<void> => {
  await updateUserLogoutData(userId)
}
