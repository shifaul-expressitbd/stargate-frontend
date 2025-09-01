import authReducer from '@/lib/features/auth/authSlice';
import sidebarReducer from '@/lib/features/sidebar/sidebarSlice';
import themeReducer from '@/lib/features/theme/themeSlice';
import { ThemeProvider } from '@/lib/providers/theme-provider';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { Sidebar } from './index';

// Create a mock store
const createMockStore = (initialState: Record<string, unknown>) => {
    const rootReducer = combineReducers({
        auth: authReducer,
        theme: themeReducer,
        sidebar: sidebarReducer,
    });

    return configureStore({
        reducer: rootReducer,
        preloadedState: initialState,
    });
};

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
        openMenus: [],
    },
};

const meta: Meta<typeof Sidebar> = {
    title: 'Layout/Sidebar',
    component: Sidebar,
    parameters: {
        layout: 'fullscreen',
        viewport: {
            defaultViewport: 'desktop'
        },
        docs: {
            description: {
                component: 'A responsive sidebar component that adapts to different device modes with overlay, compact, and full views.'
            }
        }
    },
    tags: ['autodocs'],
    argTypes: {
        handleLogout: {
            description: 'Function called when user logs out',
            control: false
        }
    },
    args: {
        handleLogout: () => console.log('user logout'),
    },
    decorators: [
        (Story) => {
            const [isSidebarOpen, setIsSidebarOpen] = useState(true);
            const [isCollapsed, setIsCollapsed] = useState(false);
            const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'laptop' | 'desktop'>('desktop');

            // Create mock state based on controls
            const mockState = {
                ...mockInitialState,
                sidebar: {
                    isOpen: isSidebarOpen,
                    isCollapsed,
                    openMenus: [],
                },
                // Mock window size for different device types
                ...(deviceType === 'mobile' && { windowSize: { width: 375, height: 667 } }),
                ...(deviceType === 'tablet' && { windowSize: { width: 768, height: 1024 } }),
                ...(deviceType === 'laptop' && { windowSize: { width: 1024, height: 768 } }),
                ...(deviceType === 'desktop' && { windowSize: { width: 1920, height: 1080 } }),
            };

            const store = createMockStore(mockState);

            return (
                <Provider store={store}>
                    <ThemeProvider>
                        <div className="flex h-screen bg-gray-50">
                            <Story />
                            <main className="flex-1 p-6">
                                <div className="bg-white h-full rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-semibold mb-3">Dashboard Content</h2>
                                    <p className="text-gray-600">Content area adapts to sidebar width changes.</p>

                                    <div className="mt-6 space-y-4">
                                        <div className="flex flex-wrap gap-4">
                                            <select
                                                value={deviceType}
                                                onChange={(e) => setDeviceType(e.target.value as 'mobile' | 'tablet' | 'laptop' | 'desktop')}
                                                className="p-2 border rounded"
                                            >
                                                <option value="mobile">Mobile</option>
                                                <option value="tablet">Tablet</option>
                                                <option value="laptop">Laptop</option>
                                                <option value="desktop">Desktop</option>
                                            </select>

                                            {deviceType !== 'mobile' && (
                                                <button
                                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    {isCollapsed ? 'Expand' : 'Collapse'} Sidebar
                                                </button>
                                            )}

                                            <button
                                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                {isSidebarOpen ? 'Close' : 'Open'} Sidebar
                                            </button>
                                        </div>

                                        <div className="mt-4 p-4 bg-gray-100 rounded">
                                            <h3 className="font-medium mb-2">Current State:</h3>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>Device Type: {deviceType}</li>
                                                <li>Sidebar Open: {isSidebarOpen ? 'Yes' : 'No'}</li>
                                                {deviceType !== 'mobile' && <li>Collapsed: {isCollapsed ? 'Yes' : 'No'}</li>}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </ThemeProvider>
                </Provider>
            );
        }
    ]
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
    args: {
        handleLogout: () => console.log('Default logout clicked'),
    }
};

export const WithSubscriptionWarning: Story = {
    args: {
        handleLogout: () => console.log('Subscription warning logout clicked'),
    },
    parameters: {
        mockData: {
            user: {
                name: 'John Doe',
                role: 'user',
                warning_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days from now
            }
        }
    }
};

export const WithExpiredSubscription: Story = {
    args: {
        handleLogout: () => console.log('Expired subscription logout clicked'),
    },
    parameters: {
        mockData: {
            user: {
                name: 'Jane Smith',
                role: 'user',
                warning_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
            }
        }
    }
};

export const AdminView: Story = {
    args: {
        handleLogout: () => console.log('Admin logout clicked'),
    },
    parameters: {
        mockData: {
            user: {
                name: 'Admin User',
                role: 'developer',
                warning_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
            }
        }
    }
};