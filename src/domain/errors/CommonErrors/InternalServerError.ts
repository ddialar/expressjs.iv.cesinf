import { ApiError } from '../ApiError'
import { INTERNAL_SERVER_ERROR } from '../httpCodes'

const message = 'Internal Server Error'

export class InternalServerError extends ApiError {
  constructor (description?: string) {
    super(INTERNAL_SERVER_ERROR, message, description)
  }
}
