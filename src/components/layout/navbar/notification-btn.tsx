import { Icon } from '@/components/shared/icons/icon';
import { Dropdown, DropdownContent, DropdownTrigger } from '@/components/shared/navigation/dropdown';
import { FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface Notification {
  id: number;
  date: string;
  time: string;
  name: string;
  message: string;
}

const dotColors = ["bg-primary", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-pink-500"];

interface NotificationsDropdownProps {
  notifications?: Notification[];
}

const NotificationsDropdown = ({
  notifications = [],
}: NotificationsDropdownProps) => {
  const getDotColor = (index: number): string => {
    return dotColors[index % dotColors.length];
  };

  return (
    <Dropdown align="right" className="relative">
      <DropdownTrigger>
        <div className="relative p-2 rounded-full bg-gray-200 hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-500 cursor-pointer transition-colors text-primary dark:text-white ">
          <Icon icon={FaBell} size={20} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-h-5 min-w-5 flex items-center justify-center">
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          )}
        </div>
      </DropdownTrigger>
      <DropdownContent className="w-fit sm:w-72 rounded-lg shadow-lg bg-white dark:bg-[#1C1C1D] fixed sm:absolute left-2 sm:left-auto right-2 sm:right-0 mt-2">
        <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            Notifications
          </h3>
          <Link
            to={'/notifications'}
            className='text-primary hover:text-orange-600 dark:text-secondary dark:hover:text-orange-300 hover:underline text-nowrap'
          >
            View All
          </Link>
        </div>
        {notifications.length > 0 ? (
          <ul className=''>
            {notifications.map((notification, index) => (
              <li
                key={notification.id}
                className='relative p-4 pt-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
              >
                {index !== notifications.length - 1 && (
                  <div
                    className='absolute left-5 top-5 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300 dark:border-gray-600'
                    aria-hidden='true'
                  ></div>
                )}
                <div className='flex space-x-3'>
                  <div className='flex-shrink-0'>
                    <div
                      className={`h-3 w-3 ${getDotColor(index)} rounded-full mt-2 shadow-glow`}
                    ></div>
                  </div>
                  <div className='flex-1'>
                    <div className='flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1'>
                      <span>{notification.date}</span>
                      <span>{notification.time}</span>
                    </div>
                    <p className='font-semibold text-gray-900 dark:text-gray-100'>
                      {notification.name}
                    </p>
                    <p className='text-sm text-gray-600 dark:text-gray-300'>
                      {notification.message}
                    </p>
                  </div>
                  <div className='flex-shrink-0'>
                    <div
                      className={`h-3 w-3 ${getDotColor(index)} rounded-full mt-2 shadow-glow`}
                    ></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-sm text-gray-500 dark:text-gray-400 p-4'>
            No new notifications.
          </p>
        )}
      </DropdownContent>
    </Dropdown>
  );
};

export default NotificationsDropdown;
