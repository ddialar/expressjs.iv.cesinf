import { getPosts } from './getPosts.path'
import { createPost } from './createPost.path'
import { createPostComment } from './createPostComment.path'
import { createPostLike } from './createPostLike.path'
import { deletePostComment } from './deletePostComment.path'
import { deletePostLike } from './deletePostLike.path'

export const posts = {
  '/posts': {
    get: getPosts,
    post: createPost
  },
  '/posts/comment': {
    post: createPostComment,
    delete: deletePostComment
  },
  '/posts/like': {
    post: createPostLike,
    delete: deletePostLike
  }
}
