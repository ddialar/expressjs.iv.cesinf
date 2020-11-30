import { mongodb } from '../../../../infrastructure/orm'
import { postDataSource } from '../../../../infrastructure/dataSources'
import { PostDomainModel } from '../../../models'
import { testingLikedAndCommentedPersistedDtoPosts, testingLikedAndCommentedPersistedDomainModelPosts } from '../../../../test/fixtures'

import { getPostById } from '../..'
import { GettingPostError } from '../../../errors/PostErrors'
import { PostDto } from '../../../../infrastructure/dtos'

describe('[SERVICES] Post - getPostById', () => {
  const { connect, disconnect, models: { Post } } = mongodb

  const mockedPosts = testingLikedAndCommentedPersistedDtoPosts as PostDto[]
  const resultPosts = testingLikedAndCommentedPersistedDomainModelPosts as PostDomainModel[]
  const selectedPost = resultPosts[0]
  const nonValidPostId = selectedPost.comments[0].id as string

  beforeAll(async () => {
    await connect()
    await Post.insertMany(mockedPosts)
  })

  afterAll(async () => {
    await Post.deleteMany({})
    await disconnect()
  })

  it('must retrieve the whole persisted posts', async (done) => {
    const postId = selectedPost.id as string

    const persistedPost = await getPostById(postId) as PostDomainModel

    expect(persistedPost).toStrictEqual(selectedPost)

    done()
  })

  it('must return NULL when the provided post ID doesn\'t exist', async (done) => {
    const postId = nonValidPostId

    await expect(getPostById(postId)).resolves.toBeNull()

    done()
  })

  it('must throw an INTERNAL_SERVER_ERROR (500) when the datasource throws an unexpected error', async (done) => {
    jest.spyOn(postDataSource, 'getPostById').mockImplementation(() => {
      throw new Error('Testing error')
    })

    const postId = selectedPost.id as string

    try {
      await getPostById(postId)
    } catch (error) {
      expect(error).toStrictEqual(new GettingPostError(`Error retereaving post '${postId}'. ${error.message}`))
    }

    jest.spyOn(postDataSource, 'getPostById').mockRestore()

    done()
  })
})
