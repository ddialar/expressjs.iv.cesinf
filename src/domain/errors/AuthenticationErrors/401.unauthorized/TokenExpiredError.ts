import { ApiError } from '../../ApiError'
import { UNAUTHORIZED } from '../../httpCodes'

const message = 'Token expired'

export class TokenExpiredError extends ApiError {
  constructor (description?: string) {
    super(UNAUTHORIZED, message, description)
  }
}
