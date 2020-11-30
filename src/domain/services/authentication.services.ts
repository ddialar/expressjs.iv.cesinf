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
  // TODO: To check whether username exists.
  const persistedUser = await getUserByUsername(username)
  // TODO: If the username doesn't exist, return an UNAUTHORIZED (401).
  if (!persistedUser) {
    throw new WrongUsernameError(`User with username '${username}' doesn't exist in login process.`)
  }
  // TODO: To check whether password is valid.
  const validPassword = await checkPassword(password, persistedUser.password)
  // TODO: If the username doesn't exist, return an UNAUTHORIZED (401).
  if (!validPassword) {
    throw new WrongPasswordError(`Password missmatches for username '${username}' in login process.`)
  }
  // TODO: To generate the JWT token
  const token = await getToken(username)
  // TODO: To update the user record with the new JWT token
  await updateUserLoginData(persistedUser.id, token)

  // TODO: To return the final result
  return {
    token,
    username: persistedUser.username,
    avatar: persistedUser.avatar
  }
}

export const logout = async (userId: string): Promise<void> => {
  // TODO: To update the user to remove the token
  await updateUserLogoutData(userId)
}
