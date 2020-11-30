import { userProfileComponent } from './UserProfile'
import { newUserProfileDataInputComponent } from './NewUserProfileDataInput'

export const user = {
  ...userProfileComponent,
  ...newUserProfileDataInputComponent
}
