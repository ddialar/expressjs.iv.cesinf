import mongoose, { Schema } from 'mongoose'
import { MONGO_SCHEMA_OPTIONS } from '../core'

const PostOwnerSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, default: '' },
  avatar: { type: String, nullable: true, default: null }
}, MONGO_SCHEMA_OPTIONS)

const PostCommentOwnerSchema = PostOwnerSchema
const PostLikeOwnerSchema = PostOwnerSchema

const PostCommentSchema = new Schema({
  body: { type: String, required: true },
  owner: { type: PostCommentOwnerSchema, required: true }
}, MONGO_SCHEMA_OPTIONS)

const PostSchema = new Schema({
  body: { type: String, required: true },
  owner: { type: PostOwnerSchema, require: true },
  comments: { type: [PostCommentSchema], require: true, default: [] },
  likes: { type: [PostLikeOwnerSchema], require: true, default: [] }
}, MONGO_SCHEMA_OPTIONS)

export const Post = mongoose.model('Post', PostSchema)
