import { sign, Secret, SignOptions, Algorithm } from 'jsonwebtoken'

export interface JwtPayload {
  sub: string
}

export const encodeJwt = (username: string): string => {
  const payload: JwtPayload = {
    sub: username
  }
  const secret: Secret = process.env.JWT_KEY!
  const options: SignOptions = {
    algorithm: process.env.JWT_ALGORITHM as Algorithm ?? 'HS512',
    expiresIn: parseInt(process.env.JWT_EXPIRING_TIME_IN_SECONDS ?? '60', 10)
  }

  return sign(payload, secret, options)
}
