import { connect, disconnect } from '../../../core'
import { Post } from '../../../models'
import { PostDto } from '../../../../../dtos'
import { testingLikedAndCommentedPersistedDtoPosts } from '../../../../../../test/fixtures'

import { dislike } from '../../post.mongodb.requests'

describe('[ORM] MongoDB - Posts - dislike', () => {
  const mockedPosts = testingLikedAndCommentedPersistedDtoPosts as PostDto[]
  const selectedPost = mockedPosts[0]
  const selectedLike = selectedPost.likes[0]

  beforeAll(async () => {
    await connect()
    await Post.insertMany(mockedPosts)
  })

  afterAll(async () => {
    await Post.deleteMany({})
    await disconnect()
  })

  it('must delete the selected post like', async (done) => {
    const postId = selectedPost._id as string
    const userId = selectedLike.userId

    await dislike(postId, userId)

    const { likes: updatedLikes } = (await Post.findById(postId))?.toJSON() as PostDto

    expect(updatedLikes).toHaveLength(selectedPost.likes.length - 1)
    expect(updatedLikes.map(({ userId: updatedUserId }) => updatedUserId).includes(userId)).toBeFalsy()

    done()
  })
})
