import Comment from '@/components/features/comment/comment'
import { AnimatePresence } from 'motion/react'
import { Outlet } from 'react-router'

export const MainLayout = () => {
  return (
    <AnimatePresence>
      <div>
        <Comment />
        <Outlet />
      </div>
    </AnimatePresence>
  )
}
