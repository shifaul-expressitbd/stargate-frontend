import { FaPlus } from 'react-icons/fa'
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'

interface AddBtnProps {
  to: string
  icon: React.ReactNode
  text: string
  showTextOnMobile?: boolean
  className?: string
}

const AddBtn = ({
  to,
  icon = <FaPlus />,
  text,
  showTextOnMobile = false,
  className = '',
}: AddBtnProps) => {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" })
  const shouldShowText = isDesktop || showTextOnMobile

  return (
    <Link
      to={to}
      className={`flex items-center rounded bg-primary px-3 py-2 text-sm text-gray-900 hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 whitespace-nowrap h-10 ${className}`}
      aria-label={shouldShowText ? undefined : text}
      title={shouldShowText ? undefined : text}
    >
      {icon}
      {shouldShowText && <span className="m-0 md:ml-2">{text}</span>}
    </Link>
  )
}

export default AddBtn
