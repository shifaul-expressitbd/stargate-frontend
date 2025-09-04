import { FaPlus } from 'react-icons/fa'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'

interface AddBtnProps {
  to?: string
  onClick?: () => void
  icon: React.ReactNode
  text: string
  showTextOnMobile?: boolean
  className?: string
  variant?: 'default' | 'gradient'
}

const AddBtn = ({
  to,
  onClick,
  icon = <FaPlus />,
  text,
  showTextOnMobile = false,
  className = '',
  variant = 'default',
}: AddBtnProps) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" })
  const shouldShowText = isDesktop || showTextOnMobile

  const baseClasses = "flex items-center rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 whitespace-nowrap h-10 gap-2"
  const variantClasses = {
    default: "bg-primary text-gray-900 hover:bg-orange-600 hover:text-white",
    gradient: "bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-orbitron shadow-lg hover:opacity-90 transition-opacity"
  }

  // If onClick is provided, render a button instead of a Link
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        aria-label={shouldShowText ? undefined : text}
        title={shouldShowText ? undefined : text}
      >
        {icon}
        {shouldShowText && <span className="m-0 md:ml-0">{text}</span>}
      </button>
    )
  }

  // Otherwise render a Link
  return (
    <Link
      to={to!}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={shouldShowText ? undefined : text}
      title={shouldShowText ? undefined : text}
    >
      {icon}
      {shouldShowText && <span className="m-0 md:ml-0">{text}</span>}
    </Link>
  )
}

export default AddBtn
