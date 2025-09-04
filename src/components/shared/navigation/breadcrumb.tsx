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
  itemClassName?: string;
  iconClassName?: string;
  labelMap?: Record<string, string>;
  homeLabel?: string;
}

export const Breadcrumb = ({
  separator = "/",
  className = "",
  itemClassName = "",
  iconClassName = "",
  labelMap = {},
  homeLabel = "Home",
}: BreadcrumbProps) => {
  // Helper function to filter out hover-related classes for non-link elements
  const filterHoverClasses = (classes: string) => {
    return classes
      .split(' ')
      .filter(cls => !cls.includes('hover:') && !cls.includes('focus:') && !cls.includes('active:'))
      .join(' ');
  };
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
    label: homeLabel,
    path: "/",
    icon: <RiHome6Line className={`w-4 h-4 ${iconClassName || 'text-white'}`} />,
  });

  return (
    <nav className={`flex items-center space-x-2 ${className}`}>
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.icon && <span className={`mr-2 ${iconClassName || itemClassName}`}>{item.icon}</span>}

          {index < breadcrumbItems.length - 1 ? (
            <Link
              to={item.path}
              className={`${itemClassName} hover:opacity-80 transition-colors`}
              style={{ fontSize: itemClassName ? 'inherit' : '0.875rem', fontWeight: itemClassName ? 'inherit' : '500' }}
            >
              {item.label}
            </Link>
          ) : (
            <span className={`${filterHoverClasses(itemClassName)}`}>
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
