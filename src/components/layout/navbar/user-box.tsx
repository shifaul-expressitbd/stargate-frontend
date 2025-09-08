import { Button } from "@/components/shared/buttons/button";
import { Icon } from "@/components/shared/icons/icon";
import { Dropdown, DropdownContent, DropdownTrigger } from "@/components/shared/navigation/dropdown";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useWindowSize } from "@/hooks/useWindowSize";
import { logout } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useState } from "react";
import { FaCog, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface UserBoxProps {
  showLabels?: boolean;
  color?: string;
  avatar?: string;
  isExpired?: boolean;
  remainingTime?: {
    text: string;
    unit: string;
    value: number;
  };
}

const getStatusColor = (remainingTime: { unit: string; value: number }, color?: string) => {
  const { unit, value } = remainingTime;

  if ((unit === 'days' && value <= 1) || unit === 'hours' || unit === 'minutes') {
    return color === 'cosmic' ? 'text-red-400' : 'text-red-700 dark:text-red-400';
  }
  if (unit === 'days' && value <= 3) {
    return color === 'cosmic' ? 'text-yellow-400' : 'text-yellow-700 dark:text-yellow-400';
  }
  return color === 'cosmic' ? 'text-green-400' : 'text-green-700 dark:text-green-400';
};

export const UserBox = ({
  showLabels = false,
  color = 'default',
  avatar = '/images/avatar/avatar1.png',
  isExpired,
  remainingTime
}: UserBoxProps) => {
  const { user } = useAuth();
  const { isMobile, isTablet } = useWindowSize();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Use subscription hook if props not provided
  const subscription = useSubscription(user?.warning_date);
  const subscriptionIsExpired = isExpired ?? subscription.isExpired;
  const subscriptionRemainingTime = remainingTime ?? subscription.remainingTime;

  const effectiveShowLabels = showLabels || isMobile || isTablet;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      <Dropdown isDropdownOpen={isOpen} onOpenChange={setIsOpen} align={isMobile || isTablet ? 'center' : 'right'} direction={isMobile || isTablet ? 'up' : 'auto'} variant={color as any} isInsideContainer={isMobile || isTablet} gap={isMobile || isTablet ? 24 : 8}>
        <DropdownTrigger>
          {effectiveShowLabels ? (
            <div className={twMerge(
              'dark:text-white flex gap-3 items-center cursor-pointer',
              color === 'cosmic' ? 'text-cyan-200' : 'text-gray-500'
            )}>
              <img
                src={avatar}
                alt={`${user?.name || 'User'} profile picture`}
                className='w-10 h-10 rounded-full aspect-square object-cover'
              />
              <div className='max-w-[75%] min-w-0'>
                <p className='text-lg leading-6 font-semibold capitalize truncate'>
                  {user?.name}
                </p>
                {!subscriptionIsExpired && subscriptionRemainingTime.text && (
                  <p className={twMerge(getStatusColor(subscriptionRemainingTime, color), 'text-sm')}>
                    {subscriptionRemainingTime.text}
                  </p>
                )}
                {subscriptionIsExpired && (
                  <p className={color === 'cosmic' ? 'text-red-400 text-sm' : 'text-red-500 text-sm'}>
                    Expired
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className='w-full flex justify-center'>
              <img
                src={avatar}
                alt={`${user?.name || 'User'} profile picture`}
                className='w-8 h-8 rounded-full aspect-square object-cover transition-transform duration-200 hover:scale-110 cursor-pointer'
              />
            </div>
          )}
        </DropdownTrigger>
        <DropdownContent>
          <div className="w-full flex flex-col space-y-1">
            <div onClick={() => setIsOpen(false)} className='block'>
              <Link to='/profile' className='block'>
                <Button
                  title="Settings"
                  variant="ghost"
                  className="w-full flex items-center gap-2 p-2 rounded-md text-white"
                >
                  <Icon icon={FaCog} size={16} />
                  <span>Settings</span>
                </Button>
              </Link>
            </div>
            <hr className="border-t border-gray-200 dark:border-gray-700" />
            <Button
              title="Logout"
              variant="ghost"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 p-2 rounded-md text-red-500"
            >
              <Icon icon={FaSignOutAlt} size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  );
};