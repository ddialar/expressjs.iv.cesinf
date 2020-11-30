import { ApiError } from '../../ApiError'
import { UNAUTHORIZED } from '../../httpCodes'

const message = 'Password not valid'

export class WrongPasswordError extends ApiError {
  constructor (description?: string) {
    super(UNAUTHORIZED, message, description)
  }
}
