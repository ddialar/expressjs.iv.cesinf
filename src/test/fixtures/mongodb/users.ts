import { UserDto } from '../../../infrastructure/dtos'
import { mongodb } from '../../../infrastructure/orm'

const { models: { User } } = mongodb

export const cleanUsersCollection = async () => User.deleteMany({})

export const saveUser = async (userData: Partial<UserDto>) => (await (new User(userData)).save()).toJSON() as UserDto
export const saveUsers = async (usersData: Partial<UserDto>[]) => await User.insertMany(usersData)

export const getUserByUsername = async (username: string) => (await User.findOne({ username }))?.toJSON() as UserDto
