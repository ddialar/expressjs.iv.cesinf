import { User } from '../models/user.mongodb.model'
import { UserDto, NewUserDatabaseDto, UpdateUserPayloadDto, UserProfileDto, NewUserProfileDto } from '../../../dtos'

export const create = async (newUserData: NewUserDatabaseDto): Promise<void> => {
  await (new User(newUserData)).save()
}

export const getByUsername = async (username: string): Promise<UserDto | null> => {
  const user = await User.findOne({ username }).lean()
  return user ? JSON.parse(JSON.stringify(user)) : user
}

export const getProfileById = async (id: string): Promise<UserProfileDto | null> => {
  const profile = await User.findById(id).select('-_id username email name surname avatar').lean()
  return profile ? JSON.parse(JSON.stringify(profile)) : profile
}

// REFACTOR (MongoDB) Extract the updating user process to a single function.
export const updateById = async (id: string, payload: UpdateUserPayloadDto): Promise<void> => {
  // NOTE: Besides to define the fields as 'immutable' in the schema definition, it's required to use the 'strict' option 'cos in opposite, the field can be overwriten anyway :(
  await User.updateOne({ _id: id }, payload, { strict: 'throw' })
}

export const updateProfileById = async (id: string, payload: NewUserProfileDto): Promise<void> => {
  // NOTE: Besides to define the fields as 'immutable' in the schema definition, it's required to use the 'strict' option 'cos in opposite, the field can be overwriten anyway :(
  await User.updateOne({ _id: id }, payload, { strict: 'throw' })
}
