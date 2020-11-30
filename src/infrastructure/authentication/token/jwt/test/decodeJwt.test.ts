import { sign, Secret, SignOptions, Algorithm } from 'jsonwebtoken'
import { decodeJwt } from '../decodeJwt'
import { JwtPayload } from '../encodeJwt'

import { testingUsers, testingExpiredJwtToken } from '../../../../../test/fixtures'

const { username } = testingUsers[0]

describe('[AUTHENTICATION] Token - JWT', () => {
  describe('decodeJwt', () => {
    it('must decode a valid token', () => {
      const payload: JwtPayload = {
        sub: username
      }
      const secret: Secret = process.env.JWT_KEY!
      const options: SignOptions = {
        algorithm: process.env.JWT_ALGORITHM as Algorithm ?? 'HS512',
        expiresIn: parseInt(process.env.JWT_EXPIRING_TIME_IN_SECONDS ?? '60', 10)
      }

      const token = sign(payload, secret, options)

      const decodedToken = decodeJwt(token)

      const expectedFields = ['exp', 'iat', 'sub']
      const retrievedTokenFields = Object.keys(decodedToken).sort()
      expect(retrievedTokenFields.sort()).toEqual(expectedFields.sort())

      expect(decodedToken.exp).toBeGreaterThan(0)
      expect(decodedToken.iat).toBeGreaterThan(0)
      expect(decodedToken.sub).toBe(username)
    })

    it('must throw an error when we provide a NON valid token', () => {
      const expiredToken = testingExpiredJwtToken

      try {
        decodeJwt(expiredToken)
      } catch ({ message }) {
        expect(message).toBe('jwt expired')
      }
    })
  })
})
