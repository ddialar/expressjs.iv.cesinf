import { connect, disconnect } from '../../../core'
import { Post } from '../../../models'
import { PostDto } from '../../../../../dtos'
import { testingLikedAndCommentedPersistedDtoPosts } from '../../../../../../test/fixtures'

import { deleteComment } from '../../post.mongodb.requests'

describe('[ORM] MongoDB - Posts - deleteComment', () => {
  const mockedPosts = testingLikedAndCommentedPersistedDtoPosts as PostDto[]
  const selectedPost = mockedPosts[0]
  const selectedComment = selectedPost.comments[0]

  beforeAll(async () => {
    await connect()
    await Post.insertMany(mockedPosts)
  })

  afterAll(async () => {
    await Post.deleteMany({})
    await disconnect()
  })

  it('must delete the selected post comment', async (done) => {
    const postId = selectedPost._id as string
    const commentId = selectedComment._id as string

    await deleteComment(postId, commentId)

    const { comments: updatedComments } = (await Post.findById(postId))?.toJSON() as PostDto

    expect(updatedComments).toHaveLength(selectedPost.comments.length - 1)
    expect(updatedComments.map(({ _id }) => _id).includes(commentId)).toBeFalsy()

    done()
  })
})
