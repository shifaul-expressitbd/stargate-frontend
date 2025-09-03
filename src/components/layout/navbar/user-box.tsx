import { Button } from "@/components/shared/buttons/button";
import { Icon } from "@/components/shared/icons/icon";
import { Dropdown, DropdownContent, DropdownTrigger } from "@/components/shared/navigation/dropdown";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks";
import { FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
// import { Dropdown, DropdownContent, DropdownTrigger } from "@/components/ui/dropdown";
// import { Icon } from "@/components/ui/icon";
// import { Button } from "@/components/ui/button";

export const UserBox = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex items-center space-x-4">
      <Dropdown align="right">
        <DropdownTrigger>
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="relative p-2 rounded-full bg-gray-200 hover:bg-gray-100 dark:bg-primary-dark    dark:hover:bg-gray-500 cursor-pointer transition-colors text-blue-800">
              <Icon icon={FaUser} size={20} />
            </div>
            <div className="hidden md:block text-blue-600">
              <h1 className="font-semibold text-nowrap">
                {(user && 'id' in user && user.id) ? user.id : (user && 'userId' in user && user.userId) ? user.userId : "Welcome Guest"}{" "}
                {/* Display user ID or "Welcome Guest" */}
              </h1>
              <div className="flex items-center">
                <span className="text-sm">
                  {user ? user.role : "Unknown"}{" "}
                  {/* Display user role or "Unknown" */}
                </span>
                <Icon icon={FiChevronDown} size={20} />
              </div>
            </div>
          </div>
        </DropdownTrigger>

        <DropdownContent className="w-36 bg-white dark:bg-primary-dark   ">
          <div className="flex flex-col space-y-2 p-2">
            <Button
              title="Settings"
              variant="ghost"
              className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-secondary/10 dark:bg-gray-500 text-black dark:text-white"
            >
              <Icon icon={FaCog} size={16} className="text-gray-700" />
              <span>Settings</span>
            </Button>
            <hr className="border-t border-gray-200" />
            <Button
              title="Logout"
              variant="ghost"
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-secondary/10 dark:bg-gray-500 text-black dark:text-white"
            >
              <Icon icon={FaSignOutAlt} size={16} className="text-gray-700" />
              <span>Logout</span>
            </Button>
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  );
};
