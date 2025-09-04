import authReducer from '@/lib/features/auth/authSlice'
import sidebarReducer from '@/lib/features/sidebar/sidebarSlice'
import themeReducer from '@/lib/features/theme/themeSlice'
import { ThemeProvider } from '@/lib/providers/theme-provider'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { DashboardLayout } from './dashboard-layout'

// Create a mock store
const createMockStore = (initialState: Record<string, unknown>) => {
    const rootReducer = combineReducers({
        auth: authReducer,
        theme: themeReducer,
        sidebar: sidebarReducer,
    })

    return configureStore({
        reducer: rootReducer,
        preloadedState: initialState,
    })
}

// Mock initial state
const mockInitialState = {
    auth: {
        user: {
            userId: 'mock-user-123',
            role: 'user',
            iat: Date.now() / 1000,
            exp: (Date.now() / 1000) + (24 * 60 * 60), // 24 hours from now
            expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            balance: '1000.00',
            name: 'John Doe',
            owner_id: 'mock-owner-id-123',
            renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            warning_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            user_id: 'mock-user-id-123',
        },
        token: 'mock-jwt-token-123',
        hasBusiness: true,
        userProfile: {
            public_id: 'mock-public-id',
            optimizeUrl: '/images/avatar/avatar1.png',
            secure_url: '/images/avatar/avatar1.png',
        },
        sidebar: [
            {
                title: 'Dashboard',
                path: '/dashboard',
                icon: 'FaTachometerAlt',
            },
            {
                title: 'Products',
                path: '/products',
                icon: 'FaBox',
                submenu: [
                    { title: 'All Products', path: '/products', icon: 'FaList' },
                    { title: 'Add Product', path: '/products/add', icon: 'FaPlus' },
                ],
            },
            {
                title: 'Orders',
                path: '/orders',
                icon: 'FaShoppingCart',
            },
        ],
    },
    theme: {
        mode: 'light',
        color: 'default',
    },
    sidebar: {
        isOpen: true,
        isCollapsed: false,
        currentMode: 'desktop-expandable',
        openMenus: [],
    },
}

const meta: Meta<typeof DashboardLayout> = {
    title: 'Layout/DashboardLayout',
    component: DashboardLayout,
    parameters: {
        layout: 'fullscreen',
        viewport: {
            defaultViewport: 'responsive',
        },
        docs: {
            description: {
                component: 'Responsive dashboard layout with sidebar, navbar, and subscription modal.',
            },
        },
    },
    args: {
        // No props
    },
    decorators: [
        (Story) => {
            const store = createMockStore(mockInitialState)
            return (
                <Provider store={store}>
                    <ThemeProvider>
                        <Story />
                    </ThemeProvider>
                </Provider>
            )
        }
    ]
}

export default meta

type Story = StoryObj<typeof DashboardLayout>

// Base Template
const Template: Story = {
    render: () => <DashboardLayout />,
    parameters: {
        viewport: {
            defaultViewport: 'responsive',
        },
    },
}

/**
 * Default desktop view with sidebar open
 */
export const DesktopDefault: Story = {
    ...Template,
    parameters: {
        viewport: { defaultViewport: 'desktop' },
    },
}

/**
 * Desktop with collapsed sidebar
 */
export const DesktopCollapsed: Story = {
    ...Template,
    parameters: {
        viewport: { defaultViewport: 'desktop' },
    },
}

/**
 * Mobile view with sidebar closed (hamburger menu)
 */
export const MobileSidebarClosed: Story = {
    ...Template,
    parameters: {
        viewport: { defaultViewport: 'mobile1' },
    },
}

/**
 * Mobile with sidebar open
 */
export const MobileSidebarOpen: Story = {
    ...Template,
    parameters: {
        viewport: { defaultViewport: 'mobile1' },
    },
}

/**
 * Tablet view
 */
export const Tablet: Story = {
    ...Template,
    parameters: {
        viewport: { defaultViewport: 'tablet' },
    },
}

/**
 * Subscription expired + on /profile route → modal should appear
 */
export const WithSubscriptionExpiredModal: Story = {
    ...Template,
    parameters: {
        viewport: { defaultViewport: 'desktop' },
        nextjs: {
            navigation: {
                pathname: '/profile',
            },
        },
    },
    decorators: [
        (Story) => {
            const mockStateExpired = {
                ...mockInitialState,
                auth: {
                    ...mockInitialState.auth,
                    user: {
                        ...mockInitialState.auth.user,
                        expiry_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // past
                    }
                }
            }
            const store = createMockStore(mockStateExpired)
            return (
                <Provider store={store}>
                    <ThemeProvider>
                        <Story />
                    </ThemeProvider>
                </Provider>
            )
        }
    ]
}

/**
 * Simulate different navbar height (e.g. with dropdown open)
 */
export const WithTallNavbar: Story = {
    ...Template,
    parameters: {
        viewport: { defaultViewport: 'desktop' },
    },
    play: () => {
        // Mock navbar with 100px height
        document.body.innerHTML = '<div id="navbar" style="height: 100px;"></div>'
    },
}