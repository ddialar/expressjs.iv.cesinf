import { UserDomainModel, NewUserDomainModel, UserProfileDomainModel } from '../../domain/models'
import { NewUserProfileDto, UpdateUserPayloadDto } from '../dtos'
import { mapUserFromDtoToDomainModel } from '../mappers'
import { mongodb } from '../orm'

export const createUser = async (newUserData: NewUserDomainModel): Promise<void> => {
  await mongodb.requests.user.create(newUserData)
}

export const getUserByUsername = async (username: string): Promise<UserDomainModel | null> =>
  mapUserFromDtoToDomainModel(await mongodb.requests.user.getByUsername(username))
export const getUserProfileById = async (userId: string): Promise<UserProfileDomainModel | null> =>
  mongodb.requests.user.getProfileById(userId)

export const updateUserById = async (userId: string, updatedUserData: UpdateUserPayloadDto): Promise<void> => mongodb.requests.user.updateById(userId, updatedUserData)
export const updateUserProfileById = async (userId: string, newUserProfileData: NewUserProfileDto): Promise<UserProfileDomainModel | null> => {
  await mongodb.requests.user.updateProfileById(userId, newUserProfileData)
  return await getUserProfileById(userId)
}
