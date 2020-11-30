import { ApiError } from '../../ApiError'
import { UNAUTHORIZED } from '../../httpCodes'

const message = 'Username not valid'

export class WrongUsernameError extends ApiError {
  constructor (description?: string) {
    super(UNAUTHORIZED, message, description)
  }
}
