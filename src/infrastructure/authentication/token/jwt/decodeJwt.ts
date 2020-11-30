import { verify, Secret } from 'jsonwebtoken'
import { DecodedJwtTokenDto } from '../../../dtos'

export const decodeJwt = (encodedToken: string) => {
  const secret: Secret = process.env.JWT_KEY!
  return verify(encodedToken, secret) as DecodedJwtTokenDto
}
