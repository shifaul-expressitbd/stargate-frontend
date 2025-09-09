import { FaFacebook, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface SocialLoginButtonsProps {
  divider?: "top" | "bottom";
}

export const SocialLogin = ({ divider = "top" }: SocialLoginButtonsProps) => {
  const handleOAuthClick = (provider: string) => {
    // Redirect to OAuth endpoint - the backend will handle the OAuth flow
    const baseUrl = 'http://localhost:5555/api';
    window.location.href = `${baseUrl}/auth/${provider}`;
  };

  return (
    <div className="space-y-2">
      {/* Divider at the Top */}
      {divider === "top" && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-black text-gray-500 dark:text-gray-400 font-poppins">
              Quantum Portal
            </span>
          </div>
        </div>
      )}

      {/* Social Buttons */}
      <div className="grid grid-cols-3 gap-2 px-4">
        <button
          onClick={() => handleOAuthClick("google")}
          className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-2 rounded-lg transition-all cursor-pointer"
        >
          <FcGoogle size={18} />
          <span className="hidden sm:inline">Google</span>
        </button>
        <button
          onClick={() => handleOAuthClick("github")}
          className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 bg-gray-900 dark:bg-black text-white hover:bg-gray-800 font-semibold py-2 rounded-lg transition-all cursor-pointer"
        >
          <FaGithub size={18} />
          <span className="hidden sm:inline">GitHub</span>
        </button>
        <button
          onClick={() => handleOAuthClick("facebook")}
          className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2 rounded-lg transition-all cursor-pointer"
        >
          <FaFacebook size={18} />
          <span className="hidden sm:inline">Facebook</span>
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
              Quantum Portal
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
