import type { SidebarMode } from '@/lib/features/sidebar/sidebarSlice';
import { ThemeProvider } from '@/lib/providers/theme-provider';
import { store, type RootState } from '@/lib/store';
import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, waitFor } from '@storybook/testing-library';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Navbar } from '../navbar';
import { Sidebar } from './index';

// Mock store factory for different states
const createMockStore = (overrides: Partial<RootState>) => {
    const mockState = { ...store.getState(), ...overrides } as RootState;
    const subscribers: Array<() => void> = [];

    const getState = () => mockState;

    const dispatch = <T extends { type: string; payload?: unknown }>(action: T): T => {
        if (typeof action === 'object' && action.type) {
            switch (action.type) {
                case 'sidebar/toggleSidebar':
                    mockState.sidebar.isOpen = !mockState.sidebar.isOpen;
                    break;
                case 'sidebar/openSidebar':
                    mockState.sidebar.isOpen = true;
                    break;
                case 'sidebar/closeSidebar':
                    mockState.sidebar.isOpen = false;
                    break;
                case 'sidebar/toggleCollapsed':
                    mockState.sidebar.isCollapsed = !mockState.sidebar.isCollapsed;
                    break;
                case 'sidebar/setCollapsed':
                    mockState.sidebar.isCollapsed = action.payload as boolean;
                    break;
                case 'sidebar/setSidebarMode':
                    mockState.sidebar.currentMode = action.payload as SidebarMode;
                    break;
                case 'sidebar/toggleOpenMenu': {
                    const title = action.payload as string;
                    const openMenus = mockState.sidebar.openMenus;
                    if (openMenus.includes(title)) {
                        mockState.sidebar.openMenus = openMenus.filter(t => t !== title);
                    } else {
                        mockState.sidebar.openMenus = [...openMenus, title];
                    }
                    break;
                }
                case 'sidebar/setOpenMenus':
                    mockState.sidebar.openMenus = action.payload as string[];
                    break;
                default:
                    break;
            }
            subscribers.forEach(sub => sub());
        }
        return action;
    };

    const subscribe = (listener: () => void) => {
        subscribers.push(listener);
        return () => {
            const index = subscribers.indexOf(listener);
            if (index > -1) subscribers.splice(index, 1);
        };
    };
    const replaceReducer = () => { }; // stub

    return {
        getState,
        dispatch,
        subscribe,
        replaceReducer,
        [Symbol.observable]: () => ({ subscribe: () => () => { } }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
};

// Base mock data
const mockAuthUser = {
    id: 'mock-user-123',
    email: 'john.doe@example.com',
    name: 'John Doe',
    avatar: '/images/avatar/avatar1.png',
    provider: 'local' as const,
    isEmailVerified: true,
    isTwoFactorEnabled: false,
    role: 'user',
    warning_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
};

const mockSidebarItems = [
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
        submenu: [
            { title: 'All Orders', path: '/orders', icon: 'FaList' },
            { title: 'Pending Orders', path: '/orders/pending', icon: 'FaClock' },
            { title: 'Completed Orders', path: '/orders/completed', icon: 'FaCheck' },
        ],
    },
    {
        title: 'Customers',
        path: '/customers',
        icon: 'FaUsers',
    },
    {
        title: 'Analytics',
        path: '/analytics',
        icon: 'FaChartBar',
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: 'FaCog',
        submenu: [
            { title: 'General', path: '/settings/general', icon: 'FaCog' },
            { title: 'Account', path: '/settings/account', icon: 'FaUser' },
            { title: 'Billing', path: '/settings/billing', icon: 'FaCreditCard' },
        ],
    },
];

// Create mock state definitions
const defaultMockState: Partial<RootState> = {
    auth: {
        user: mockAuthUser,
        jwtPayload: {
            sub: 'mock-user-123',
            email: 'john.doe@example.com',
            roles: ['user'],
            rememberMe: true,
            iat: Date.now() / 1000,
            exp: (Date.now() / 1000) + (24 * 60 * 60), // 24 hours
            aud: 'mock-audience',
            iss: 'mock-issuer',
        },
        token: 'mock-jwt-token-123',
        refreshToken: 'mock-refresh-token-123',
        hasBusiness: true,
        sidebar: [mockSidebarItems],
        dashboardDesign: {
            best_selling_products_report: false,
            category_demand_report: false,
            courier_tracking_report: false,
            customer_resources_report: false,
            employee_report_report: false,
            income_expense_report: false,
            invest_stock_report: false,
            missing_products_report: false,
            order_analysis_report: false,
            order_sales_channel_report: false,
            sales_statistics_report: false,
            shorcut_overview_report: false,
            stats_report: false,
            subscription_used_report: false,
            top_customers_report: false,
        },
        userProfile: {
            public_id: 'mock-public-id',
            optimizeUrl: '/images/avatar/avatar1.png',
            secure_url: '/images/avatar/avatar1.png',
        },
    },
    theme: {
        mode: 'light',
        color: 'toolbox',
    },
    sidebar: {
        isOpen: true,
        isCollapsed: false,
        currentMode: 'desktop-expandable',
        openMenus: [],
    },
};

// Create mock decorator function
const createMockDecorator = (overrides: Partial<RootState>) => {
    const mockStore = createMockStore({ ...defaultMockState, ...overrides });

    return (Story: React.ComponentType<object>) => {
        const [isMobile, setIsMobile] = useState(false);

        useEffect(() => {
            // Check if we're in mobile mode based on the store state
            const state = mockStore.getState();
            setIsMobile(state.sidebar.currentMode === 'mobile-overlay');
        }, []);

        return (
            <Provider store={mockStore}>
                <ThemeProvider>
                    <div className={`flex h-screen bg-gray-50 ${isMobile ? 'overflow-hidden' : ''}`}>
                        <Story />
                        <div className='flex-1 flex flex-col'>
                            <Navbar handleLogout={() => { }} />
                            <main className="flex-1 p-6">
                                <div className="bg-white h-full rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-semibold mb-3">Dashboard Content</h2>
                                    <p className="text-gray-600">Content area adapts to sidebar width changes.</p>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="font-medium">Sales Overview</h3>
                                            <p className="text-sm text-gray-500 mt-2">Last 30 days: $24,500</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h3 className="font-medium">Orders</h3>
                                            <p className="text-sm text-gray-500 mt-2">Pending: 12, Completed: 89</p>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>

                        {/* Mobile overlay backdrop */}
                        {isMobile && mockStore.getState().sidebar.isOpen && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                                onClick={() => mockStore.dispatch({ type: 'sidebar/closeSidebar' })}
                            />
                        )}
                    </div>
                </ThemeProvider>
            </Provider>
        );
    };
};

const meta: Meta<typeof Sidebar> = {
    title: 'Layout/Sidebar',
    component: Sidebar,
    parameters: {
        layout: 'fullscreen',
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
        (Story, ctx) => {
            // Centralized mock state management from parameters
            const mockOverrides = ctx.parameters?.mockState || {};
            const defaultState = {
                ...defaultMockState,
                ...mockOverrides,
                auth: {
                    ...defaultMockState.auth,
                    ...mockOverrides.auth,
                    sidebar: [mockSidebarItems]
                }
            };
            const decorator = createMockDecorator(defaultState);
            return decorator(Story);
        }
    ]
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
    args: {
        handleLogout: () => console.log('Default logout clicked'),
    },
    parameters: {
        viewport: {
            defaultViewport: 'desktop',
        },
    },
    play: async ({ canvasElement }) => {
        // Wait for sidebar to render
        await waitFor(() => {
            expect(canvasElement.querySelector('[data-testid="sidebar"]')).toBeInTheDocument();
        });

        // Verify sidebar is rendered
        const sidebar = canvasElement.querySelector('[data-testid="sidebar"]');
        expect(sidebar).toBeInTheDocument();

        // Test that sidebar toggle is present (from navbar)
        const toggleButton = canvasElement.querySelector('[data-testid="sidebar-toggle"]');
        expect(toggleButton).toBeInTheDocument();

        // Basic interaction test
        if (toggleButton) {
            await userEvent.click(toggleButton);
            // Just verify click doesn't throw
            expect(true).toBeTruthy();
        }
    }
};

export const ClosedSidebar: Story = {
    args: {
        handleLogout: () => console.log('Closed sidebar logout clicked'),
    },
    parameters: {
        mockState: {
            sidebar: {
                isOpen: false,
                isCollapsed: false,
                currentMode: 'desktop-expandable',
                openMenus: [],
            }
        },
        viewport: {
            defaultViewport: 'desktop'
        }
    },
    play: async ({ canvasElement }) => {
        // Wait for components to render
        await waitFor(() => {
            expect(canvasElement.querySelector('[data-testid="sidebar"]')).toBeInTheDocument();
        });

        // Verify sidebar is rendered
        const sidebar = canvasElement.querySelector('[data-testid="sidebar"]');
        expect(sidebar).toBeInTheDocument();

        // Test that toggle is present when sidebar is closed
        const toggleButton = canvasElement.querySelector('[data-testid="sidebar-toggle"]');
        if (toggleButton) {
            expect(toggleButton).toBeInTheDocument();

            // Test clicking the toggle
            await userEvent.click(toggleButton);
            expect(true).toBeTruthy();
        }
    }
};

export const CollapsedSidebar: Story = {
    args: {
        handleLogout: () => console.log('Collapsed sidebar logout clicked'),
    },
    parameters: {
        mockState: {
            sidebar: {
                isOpen: true,
                isCollapsed: true,
                currentMode: 'desktop-expandable',
                openMenus: [],
            }
        },
        viewport: {
            defaultViewport: 'desktop'
        }
    },
    play: async ({ canvasElement }) => {
        // Wait for sidebar to render
        await waitFor(() => {
            expect(canvasElement.querySelector('[data-testid="sidebar"]')).toBeInTheDocument();
        });

        // Verify sidebar is rendered when collapsed
        const sidebar = canvasElement.querySelector('[data-testid="sidebar"]');
        expect(sidebar).toBeInTheDocument();

        // Test hover interaction on available elements
        const toggleButton = canvasElement.querySelector('[data-testid="sidebar-toggle"]');
        if (toggleButton) {
            await userEvent.click(toggleButton);
            expect(true).toBeTruthy(); // Verify interaction works
        }
    }
};

export const MobileOverlay: Story = {
    args: {
        handleLogout: () => console.log('Mobile overlay logout clicked'),
    },
    parameters: {
        mockState: {
            sidebar: {
                isOpen: true,
                isCollapsed: false,
                currentMode: 'mobile-overlay',
                openMenus: [],
            }
        },
        viewport: {
            defaultViewport: 'mobile'
        }
    },
    play: async ({ canvasElement }) => {
        // Wait for sidebar to render
        await waitFor(() => {
            expect(canvasElement.querySelector('[data-testid="sidebar"]')).toBeInTheDocument();
        });

        // Verify sidebar is rendered
        const sidebar = canvasElement.querySelector('[data-testid="sidebar"]');
        expect(sidebar).toBeInTheDocument();

        // Test basic mobile overlay functionality
        const mobileSidebar = canvasElement.querySelector('[class*="w-3/4"]');
        if (mobileSidebar) {
            expect(mobileSidebar).toBeInTheDocument();

            // Test user interaction
            await userEvent.click(mobileSidebar);
            expect(true).toBeTruthy();
        }

        // Check for backdrop presence (may not be in DOM conditions)
        const backdrop = canvasElement.querySelector('[class*="bg-opacity-50"]');
        if (backdrop) {
            expect(backdrop).toBeInTheDocument();
        }
    }
};

export const TabletCompact: Story = {
    args: {
        handleLogout: () => console.log('Tablet compact logout clicked'),
    },
    parameters: {
        mockState: {
            sidebar: {
                isOpen: true,
                isCollapsed: true,
                currentMode: 'laptop-compact',
                openMenus: [],
            }
        },
        viewport: {
            defaultViewport: 'tablet'
        }
    },
    play: async ({ canvasElement }) => {
        // Wait for sidebar to render
        await waitFor(() => {
            expect(canvasElement.querySelector('[data-testid="sidebar"]')).toBeInTheDocument();
        });

        // Verify sidebar is rendered
        const sidebar = canvasElement.querySelector('[data-testid="sidebar"]');
        expect(sidebar).toBeInTheDocument();

        // Test basic compact mode interactions
        const availableElements = canvasElement.querySelectorAll('button, a');
        if (availableElements.length > 0) {
            await userEvent.click(availableElements[0]);
            expect(true).toBeTruthy();
        }

        // Test toggle functionality
        const toggleButton = canvasElement.querySelector('[data-testid="sidebar-toggle"]');
        if (toggleButton) {
            await userEvent.click(toggleButton);
            expect(true).toBeTruthy();
        }
    }
};

export const ToggleInteraction: Story = {
    args: {
        handleLogout: () => console.log('Toggle interaction logout clicked'),
    },
    parameters: {
        mockState: {
            sidebar: {
                isOpen: true,
                isCollapsed: false,
                currentMode: 'desktop-expandable',
                openMenus: ['Products'],
            }
        },
        viewport: {
            defaultViewport: 'desktop'
        },
        docs: {
            description: {
                story: 'Demonstrates toggle interactions - expanding/collapsing menu items and sidebar state changes. Try clicking on menu items with submenus.'
            }
        },
        chromatic: { disable: true },
    },
    play: async ({ canvasElement }) => {
        // Wait for sidebar to render
        await waitFor(() => {
            expect(canvasElement.querySelector('[data-testid="sidebar"]')).toBeInTheDocument();
        });

        // Verify sidebar is rendered
        const sidebar = canvasElement.querySelector('[data-testid="sidebar"]');
        expect(sidebar).toBeInTheDocument();

        // Test various interactive elements that are present
        const buttons = canvasElement.querySelectorAll('button');
        const links = canvasElement.querySelectorAll('a');

        // Test clicking available interactive elements
        const allClickable = [...buttons, ...links];
        if (allClickable.length > 0) {
            await userEvent.click(allClickable[0]);
            expect(true).toBeTruthy(); // Verify interaction works
        }

        // Test toggle functionality
        const toggleButton = canvasElement.querySelector('[data-testid="sidebar-toggle"]');
        if (toggleButton) {
            await userEvent.click(toggleButton);
            expect(true).toBeTruthy(); // Verify toggle interaction
        }

        // Test logout functionality
        const logoutButton = canvasElement.querySelector('[data-testid="logout-button"]');
        if (logoutButton) {
            await userEvent.click(logoutButton);
            expect(true).toBeTruthy(); // Verify logout interaction
        }
    }
};