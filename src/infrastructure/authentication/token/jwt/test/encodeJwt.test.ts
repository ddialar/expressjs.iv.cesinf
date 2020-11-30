import { verify, Secret } from 'jsonwebtoken'
import { encodeJwt } from '../encodeJwt'
import { DecodedJwtTokenDto } from '../../../../dtos'

import { testingUsers } from '../../../../../test/fixtures'

const { username } = testingUsers[0]

describe('[AUTHENTICATION] Token - JWT', () => {
  describe('encodeJwt', () => {
    it('must generate a valid token', () => {
      const secret: Secret = process.env.JWT_KEY!

      let obtainedError = null

      try {
        const token = encodeJwt(username)
        const verifiedToken = verify(token, secret) as DecodedJwtTokenDto

        const expectedFields = ['exp', 'iat', 'sub']
        const retrievedTokenFields = Object.keys(verifiedToken).sort()
        expect(retrievedTokenFields.sort()).toEqual(expectedFields.sort())

        expect(verifiedToken.exp).toBeGreaterThan(0)
        expect(verifiedToken.iat).toBeGreaterThan(0)
        expect(verifiedToken.sub).toBe(username)
      } catch (error) {
        obtainedError = error
      } finally {
        expect(obtainedError).toBeNull()
      }
    })
  })
})
