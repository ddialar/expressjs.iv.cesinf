import { postDataSource } from '../../infrastructure/dataSources'
import { CreatingPostCommentError, CreatingPostError, DeletingPostCommentError, DeletingPostLikeError, GettingPostCommentError, GettingPostError, GettingPostLikeError, LikingPostError, PostCommentNotFoundError, PostNotFoundError, UnauthorizedPostCommentDeletingError } from '../errors/PostErrors'
import { PostCommentDomainModel, PostDomainModel, PostLikeOwnerDomainModel, PostOwnerDomainModel } from '../models'

export const createPost = async (owner: PostOwnerDomainModel, postBody: string): Promise<PostDomainModel> => {
  try {
    const createdPost = await postDataSource.createPost(owner, postBody)
    if (!createdPost) { throw new Error('Post creation process initiated but completed with NULL result') }
    return createdPost
  } catch ({ message }) {
    throw new CreatingPostError(`Error creating post for user '${owner.id}'. ${message}`)
  }
}

export const createPostComment = async (postId: string, commentBody: string, owner: PostOwnerDomainModel): Promise<PostDomainModel> => {
  try {
    const createdPostComment = await postDataSource.createPostComment(postId, commentBody, owner)
    if (!createdPostComment) { throw new Error('Post comment insertion process initiated but completed with NULL result') }
    return createdPostComment
  } catch ({ message }) {
    throw new CreatingPostCommentError(`Error creating post '${postId}' commment by user '${owner.id}'. ${message}`)
  }
}

export const getPosts = async (): Promise<PostDomainModel[] | null> => {
  try {
    return await postDataSource.getPosts()
  } catch ({ message }) {
    throw new GettingPostError(`Error retereaving posts. ${message}`)
  }
}

export const getPostById = async (postId: string): Promise<PostDomainModel | null> => {
  try {
    return await postDataSource.getPostById(postId)
  } catch ({ message }) {
    throw new GettingPostError(`Error retereaving post '${postId}'. ${message}`)
  }
}

export const getPostComment = async (postId: string, commentId: string): Promise<PostCommentDomainModel | null> => {
  try {
    return await postDataSource.getPostComment(postId, commentId)
  } catch ({ message }) {
    throw new GettingPostCommentError(`Error retereaving post comment. ${message}`)
  }
}

export const getPostLikeByOwnerId = async (postId: string, likeOwnerId: string): Promise<PostLikeOwnerDomainModel | null> => {
  try {
    return await postDataSource.getPostLikeByOwnerId(postId, likeOwnerId)
  } catch ({ message }) {
    throw new GettingPostLikeError(`Error retereaving post comment. ${message}`)
  }
}

export const deletePostComment = async (postId: string, commentId: string, commentOwnerId: string): Promise<void> => {
  const selectedComment = await getPostComment(postId, commentId)
  if (!selectedComment) { throw new PostCommentNotFoundError(`Comment '${commentId}' from post '${postId}' not found`) }

  if (selectedComment.owner.id !== commentOwnerId) {
    throw new UnauthorizedPostCommentDeletingError(`User '${commentOwnerId}' is not the owner of the comment '${commentId}', from post '${postId}', which is trying to delete.`)
  }

  try {
    await postDataSource.deletePostComment(postId, commentId)
  } catch ({ message }) {
    throw new DeletingPostCommentError(`Error deleting comment '${commentId}', from post '${postId}', by user '${commentOwnerId}'. ${message}`)
  }
}

export const likePost = async (postId: string, owner: PostOwnerDomainModel): Promise<void> => {
  const selectedPost = await getPostById(postId)
  if (!selectedPost) { throw new PostNotFoundError(`Post '${postId}' not found`) }

  try {
    await postDataSource.likePost(postId, owner)
  } catch ({ message }) {
    throw new LikingPostError(`Error setting like to post '${postId}' by user '${owner.id}'. ${message}`)
  }
}

export const dislikePost = async (postId: string, likeOwnerId: string): Promise<void> => {
  const selectedPost = await getPostById(postId)
  if (!selectedPost) { throw new PostNotFoundError(`Post '${postId}' not found`) }

  const selectedLike = await getPostLikeByOwnerId(postId, likeOwnerId)
  if (selectedLike) {
    try {
      await postDataSource.dislikePost(postId, selectedLike.id)
    } catch ({ message }) {
      throw new DeletingPostLikeError(`Error deleting like '${selectedLike.id}', from post '${postId}', by user '${likeOwnerId}'. ${message}`)
    }
  }
}
