import { useSidebar } from '@/hooks/useSidebar'
import { FaPlus } from 'react-icons/fa'
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
  const { isDesktop } = useSidebar()
  const shouldShowText = isDesktop || showTextOnMobile

  return (
    <Link
      to={to}
      className={`flex items-center rounded bg-primary px-3 py-2 text-sm text-white hover:bg-orange-600 focus:outline-none focus:ring-2 whitespace-nowrap h-10 ${className}`}
    >
      {icon}
      {shouldShowText && <span className="m-0 md:ml-2">{text}</span>}
    </Link>
  )
}

export default AddBtn
