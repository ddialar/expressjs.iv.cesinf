import { ApiError } from '../../ApiError'
import { BAD_REQUEST } from '../../httpCodes'

const message = 'User does not exist'

export class UserDoesNotExistError extends ApiError {
  constructor (description?: string) {
    super(BAD_REQUEST, message, description)
  }
}
