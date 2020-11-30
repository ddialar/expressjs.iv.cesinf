import express from 'express'
import { createPost, createPostComment, deletePostComment, dislikePost, getPosts, likePost } from '../../../domain'
import { UserDomainModel } from '../../../domain/models'
import { ensureAuthenticated } from '../middlewares'
import { RequestDto } from '../serverDtos'

const postRoutes = express.Router()

postRoutes.get('/posts', async (req, res, next) => {
  try {
    res.json(await getPosts())
  } catch (error) {
    next(error)
  }
})

postRoutes.post('/posts/create', ensureAuthenticated, async (req: RequestDto, res, next) => {
  const { id, name, surname, avatar } = req.user as UserDomainModel
  const { postBody } = req.body
  try {
    res.json(await createPost({ id, name, surname, avatar }, postBody as string))
  } catch (error) {
    next(error)
  }
})

postRoutes.post('/posts/comment', ensureAuthenticated, async (req: RequestDto, res, next) => {
  const { id, name, surname, avatar } = req.user as UserDomainModel
  const { postId, commentBody } = req.body
  try {
    res.json(await createPostComment(postId as string, commentBody as string, { id, name, surname, avatar }))
  } catch (error) {
    next(error)
  }
})

postRoutes.delete('/posts/comment', ensureAuthenticated, async (req: RequestDto, res, next) => {
  const { id: commentOwnerId } = req.user as UserDomainModel
  const { postId, commentId } = req.body
  try {
    res.json(await deletePostComment(postId as string, commentId as string, commentOwnerId as string))
  } catch (error) {
    next(error)
  }
})

postRoutes.post('/posts/like', ensureAuthenticated, async (req: RequestDto, res, next) => {
  const { id, name, surname, avatar } = req.user as UserDomainModel
  const { postId } = req.body
  try {
    res.json(await likePost(postId as string, { id, name, surname, avatar }))
  } catch (error) {
    next(error)
  }
})

postRoutes.delete('/posts/like', ensureAuthenticated, async (req: RequestDto, res, next) => {
  const { id: likeOwnerId } = req.user as UserDomainModel
  const { postId } = req.body
  try {
    // res.json(await dislikePost(postId as string, likeOwnerId as string))
    await dislikePost(postId as string, likeOwnerId as string)
    res.send()
  } catch (error) {
    next(error)
  }
})

export { postRoutes }
