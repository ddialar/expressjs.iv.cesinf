import { UserDomainModel } from '../../domain/models'

export type LoginInputParamsDto = Pick<UserDomainModel, 'username' | 'password'>
export interface DecodedJwtTokenDto {
  exp: number
  iat: number
  sub: string
}
