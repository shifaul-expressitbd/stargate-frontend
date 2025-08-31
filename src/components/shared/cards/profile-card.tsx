import React from "react";
import type { IconType } from "react-icons";

type ProfileCardProps = {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  stats?: {
    label: string;
    value: string | number;
  }[];
  socialLinks?: {
    icon: IconType;
    href: string;
  }[];
  className?: string;
};

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  avatar,
  bio,
  stats,
  socialLinks,
  className = "",
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden max-w-xs ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col items-center p-6">
        <div className="w-24 h-24 mb-4 rounded-full overflow-hidden">
          <img
            src={avatar || "https://avatar.iran.liara.run/public/boy"}
            alt={`${name}'s avatar`}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold text-primary dark:text-white">
          {name}
        </h3>
        <p className="text-secondary dark:text-slate-300">{role}</p>
      </div>

      {/* Bio */}
      {bio && (
        <div className="px-6 pb-6">
          <p className="text-gray-700 dark:text-slate-300 text-center">{bio}</p>
        </div>
      )}

      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex justify-around">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl font-bold text-primary dark:text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-secondary dark:text-slate-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      {socialLinks && socialLinks.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex justify-center space-x-4">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary dark:hover:text-white"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
