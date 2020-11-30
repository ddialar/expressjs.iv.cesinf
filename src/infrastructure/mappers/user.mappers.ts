import { NewUserInputDto, UserDto } from '../dtos'
import { NewUserDomainModel, UserDomainModel } from '../../domain/models'

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
