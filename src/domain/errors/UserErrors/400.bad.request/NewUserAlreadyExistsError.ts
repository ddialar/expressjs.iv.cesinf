import { ApiError } from '../../ApiError'
import { BAD_REQUEST } from '../../httpCodes'

const message = 'User already exists'

export class NewUserAlreadyExistsError extends ApiError {
  constructor (description?: string) {
    super(BAD_REQUEST, message, description)
  }
}
