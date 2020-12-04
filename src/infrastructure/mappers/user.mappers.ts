import { NewUserInputDto, UserDto } from '../dtos'
import { NewUserDomainModel, UserDomainModel, UserProfileDomainModel } from '../../domain/models'

export const mapUserFromDtoToDomainModel = (user: UserDto | null): UserDomainModel | null => {
  if (!user) { return user }
  const { _id, ...otherUserfields } = user

  return {
    id: _id,
    ...otherUserfields
  }
}

export const mapNewUserFromDtoToDomainModel = (newUserDto: NewUserInputDto): NewUserDomainModel => {
  const { email, password } = newUserDto

  return {
    username: email,
    password,
    email
  }
}

export const mapUserFromDtoToProfileDomainModel = (user: UserDto | null): UserProfileDomainModel | null => {
  if (!user) { return user }
  const { username, email, name, surname, avatar } = user

  return {
    username,
    email,
    name,
    surname,
    avatar
  }
}
