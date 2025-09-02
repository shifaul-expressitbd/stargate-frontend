import { logout, selectCurrentUser, selectIsLoggedIn, selectUserHasBusiness } from '@/lib/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const user = useAppSelector(selectCurrentUser);
  const hasBusiness = useAppSelector(selectUserHasBusiness);

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    isLoggedIn,
    user,
    hasBusiness,
    logout: handleLogout,
  };
};
