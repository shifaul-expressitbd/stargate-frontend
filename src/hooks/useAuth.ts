import { useSelector } from 'react-redux'
import {
  selectCurrentToken,
  selectCurrentUser,
  selectIsLoggedIn,
  selectSidebar,
  selectSubscriptionExpired,
  selectUserHasBusiness,
  selectUserProfile,
} from '../lib/features/auth/authSlice'

export const useAuth = () => {
  const user = {
    ...useSelector(selectCurrentUser),
    picture: useSelector(selectUserProfile),
  }
  const token = useSelector(selectCurrentToken)
  const hasBusiness = useSelector(selectUserHasBusiness)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const sidebar = useSelector(selectSidebar)
  const subscriptionExpired = useSelector(selectSubscriptionExpired)

  return {
    user,
    token,
    hasBusiness,
    isLoggedIn,
    sidebar,
    subscriptionExpired,
  }
}
