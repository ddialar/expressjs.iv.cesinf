import { ApiError } from '../../ApiError'
import { NOT_FOUND } from '../../httpCodes'

const message = 'Post not found'

export class PostNotFoundError extends ApiError {
  constructor (description?: string) {
    super(NOT_FOUND, message, description)
  }
}
