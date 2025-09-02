import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface SocialLoginButtonsProps {
  divider?: "top" | "bottom";
}

export const SocialLogin = ({ divider = "top" }: SocialLoginButtonsProps) => {
  return (
    <div className="space-y-2">
      {/* Divider at the Top */}
      {divider === "top" && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-black text-gray-500 dark:text-gray-400">
              or
            </span>
          </div>
        </div>
      )}

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-2 px-4">
        <button
          onClick={() => alert("Sign in with Google")}
          className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-2 rounded-lg transition-all cursor-pointer"
        >
          <FcGoogle /> Google
        </button>
        <button
          onClick={() => alert("Sign in with GitHub")}
          className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-2 rounded-lg transition-all cursor-pointer"
        >
          <FaGithub /> GitHub
        </button>
      </div>

      {/* Divider at the Bottom */}
      {divider === "bottom" && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-black text-gray-500 dark:text-gray-400">
              or
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
