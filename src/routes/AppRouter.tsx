import App from '@/App'
import { useUserMenuItems, type MenuItem, type SubMenuItem } from '@/config/routes.config'
import { AuthLayout } from '@/layouts/auth-layout'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { MainLayout } from '@/layouts/main-layout'
import AdminDashboard from '@/pages/(admin)/AdminDashboard'
import ForgotPassword from '@/pages/(auth)/ForgotPassword/ForgotPassword'
import Login from '@/pages/(auth)/Login/Login'
import OAuthCallback from '@/pages/(auth)/OAuthCallback/OAuthCallback'
import Register from '@/pages/(auth)/Register/Register'
import ResetPassword from '@/pages/(auth)/ResetPassword/ResetPassword'
import VerifyNewUser from '@/pages/(auth)/VerifyNewUser/VerifyNewUser'
import ClientDashboard from '@/pages/(client)/Dashboard/ClientDashboard'
import NotFoundPage from '@/pages/NotFoundPage'
import React, { createElement, Fragment } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthRoute from './AuthRoute'
import ProtectedRoute from './ProtectedRoute'




const AppRouter: React.FC = () => {
  const userMenuItems = useUserMenuItems()
  return (
    <BrowserRouter>
      <Routes>
        {/* MainLayout Routes */}
        <Route element={<MainLayout />}>
          <Route index element={<App />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route index element={<App />} />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <AuthRoute>
                <VerifyNewUser />
              </AuthRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/auth/callback"
            element={
              <AuthRoute>
                <OAuthCallback />
              </AuthRoute>
            }
          />
        </Route>

        {/* Client Routes */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute roles={['user']}>
              <ClientDashboard />
              // </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/admin/dashboard"
            element={
              // <ProtectedRoute roles={['developer']}>
              <AdminDashboard />
              // </ProtectedRoute>
            }
          />
        </Route>

        <Route element={<DashboardLayout />}>
          {userMenuItems.map((group: MenuItem, groupIndex: number) => (
            <Fragment key={groupIndex}>
              {Array.isArray(group.submenu) ? (
                group.submenu.map((link: SubMenuItem, subIndex: number) =>
                  link.element ? (
                    <Route
                      key={`${groupIndex}-${subIndex}`}
                      path={link.path}
                      element={
                        <ProtectedRoute roles={['user', 'developer']}>
                          {createElement(link.element)}
                        </ProtectedRoute>
                      }
                    />
                  ) : null
                )
              ) : group.element && group.path ? (
                <Route
                  key={`group-${groupIndex}`}
                  path={group.path}
                  element={
                    <ProtectedRoute roles={['user', 'developer']}>
                      {createElement(group.element)}
                    </ProtectedRoute>
                  }
                />
              ) : null}
            </Fragment>
          ))}
        </Route>

        {/* Fallback Route for Unknown Paths */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
