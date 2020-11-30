import { ApiError } from '../../ApiError'
import { FORBIDDEN } from '../../httpCodes'

const message = 'Required token was not provided'

export class RequiredTokenNotProvidedError extends ApiError {
  constructor (description?: string) {
    super(FORBIDDEN, message, description)
  }
}
