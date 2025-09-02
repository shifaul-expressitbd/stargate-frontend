import { RiHome6Line } from "react-icons/ri";
import { Link, useLocation } from "react-router";

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  separator?: React.ReactNode;
  className?: string;
  labelMap?: Record<string, string>;
}

export const Breadcrumb = ({
  separator = "/",
  className = "",
  labelMap = {},
}: BreadcrumbProps) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbItems: BreadcrumbItem[] = pathnames.map((path, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
    const label =
      labelMap[path] || path.charAt(0).toUpperCase() + path.slice(1);

    return {
      label,
      path: routeTo,
    };
  });

  breadcrumbItems.unshift({
    label: "Home",
    path: "/",
    icon: <RiHome6Line className="w-4 h-4" />,
  });

  return (
    <nav className={`flex items-center space-x-2 ${className}`}>
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.icon && <span className="mr-2">{item.icon}</span>}

          {index < breadcrumbItems.length - 1 ? (
            <Link
              to={item.path}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
              {item.label}
            </span>
          )}

          {index < breadcrumbItems.length - 1 && (
            <span className="mx-2 text-gray-400">{separator}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
