import { ApiError } from '../../ApiError'
import { NOT_FOUND } from '../../httpCodes'

const message = 'Post comment not found'

export class PostCommentNotFoundError extends ApiError {
  constructor (description?: string) {
    super(NOT_FOUND, message, description)
  }
}
