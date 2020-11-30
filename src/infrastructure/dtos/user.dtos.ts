import { UserDomainModel, NewUserDomainModel, UserProfileDomainModel, NewUserProfileDomainModel } from '../../domain/models'

export type UserDto = Omit<UserDomainModel, 'id'> & { _id: string }
export type UserProfileDto = UserProfileDomainModel
export type NewUserProfileDto = NewUserProfileDomainModel
export type NewUserInputDto = Pick<NewUserDomainModel, 'email' | 'password'>
export type NewUserDatabaseDto = NewUserDomainModel
export type UpdateUserPayloadDto = Omit<Partial<UserDomainModel>, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>
