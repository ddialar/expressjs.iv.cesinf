import { postComponent } from './Post'
import { postArrayComponent } from './PostArray'
import { ownerComponent } from './Owner'
import { commentComponent } from './Comment'
import { commentArrayComponent } from './CommentArray'
import { likeArrayComponent } from './LikeArray'

export const posts = {
  ...postComponent,
  ...postArrayComponent,
  ...ownerComponent,
  ...commentComponent,
  ...commentArrayComponent,
  ...likeArrayComponent
}
