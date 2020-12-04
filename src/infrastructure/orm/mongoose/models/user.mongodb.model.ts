import mongoose, { Schema } from 'mongoose'
import { MONGO_SCHEMA_OPTIONS } from '../core'

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, immutable: true },
  password: { type: String, required: true },
  email: { type: String, required: true, immutable: true },
  name: { type: String, default: null },
  surname: { type: String, default: null },
  avatar: { type: String, default: null },
  token: { type: String, default: null },
  enabled: { type: Boolean, required: true, default: true },
  deleted: { type: Boolean, required: true, default: false },
  lastLoginAt: { type: String, default: null }
}, MONGO_SCHEMA_OPTIONS)

export const User = mongoose.model('User', UserSchema)
