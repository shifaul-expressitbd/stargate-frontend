import { AppProviders } from '@/lib/providers/app-provider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SidebarToggler } from './sidebarToggler';

const meta: Meta<typeof SidebarToggler> = {
    title: 'Layout/Sidebar/SidebarToggler',
    component: SidebarToggler,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `A responsive sidebar toggle button that adapts to different device modes and states.

**Toggle Behavior by Device:**
- 🔵 **Mobile**: Simple open/close overlay toggle with X/close icon
- 🟡 **Tablet**: Simple open/close with hamburger/close icon
- 🟢 **Laptop**: Simple open/close with hamburger/close icon
- 🔴 **Desktop**: Collapse/expand toggle with special arrow icons

**Integration Features:**
- Automatically detects device type and adjusts behavior
- Smooth animations between states
- Tooltip support showing current action
- Persistent desktop collapsed state via localStorage
- Integrated with Redux for state management`
            }
        }
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Size of the toggler button'
        },
        variant: {
            control: 'select',
            options: ['default', 'ghost', 'outline'],
            description: 'Visual style variant'
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes'
        }
    },
    args: {
        size: 'md',
        variant: 'default'
    },
    decorators: [
        (Story) => (
            <AppProviders>
                <Story />
            </AppProviders>
        )
    ],
};

export default meta;
type Story = StoryObj<typeof SidebarToggler>;

export const Default: Story = {
    args: {
        size: 'md',
        variant: 'default'
    }
};

export const Small: Story = {
    args: {
        size: 'sm',
        variant: 'ghost'
    }
};

export const Large: Story = {
    args: {
        size: 'lg',
        variant: 'outline'
    }
};

export const Variants: Story = {
    render: (args) => (
        <div className="flex space-x-4 items-center">
            <div className="flex flex-col items-center space-y-2">
                <span className="text-xs text-gray-600">Default</span>
                <SidebarToggler {...args} size="md" variant="default" />
            </div>
            <div className="flex flex-col items-center space-y-2">
                <span className="text-xs text-gray-600">Ghost</span>
                <SidebarToggler {...args} size="md" variant="ghost" />
            </div>
            <div className="flex flex-col items-center space-y-2">
                <span className="text-xs text-gray-600">Outline</span>
                <SidebarToggler {...args} size="md" variant="outline" />
            </div>
        </div>
    )
};

export const Sizes: Story = {
    render: (args) => (
        <div className="flex space-x-4 items-center">
            <div className="flex flex-col items-center space-y-2">
                <span className="text-xs text-gray-600">Small</span>
                <SidebarToggler {...args} size="sm" variant="default" />
            </div>
            <div className="flex flex-col items-center space-y-2">
                <span className="text-xs text-gray-600">Medium</span>
                <SidebarToggler {...args} size="md" variant="default" />
            </div>
            <div className="flex flex-col items-center space-y-2">
                <span className="text-xs text-gray-600">Large</span>
                <SidebarToggler {...args} size="lg" variant="default" />
            </div>
        </div>
    )
};

export const InNavbarMockup: Story = {
    render: (args) => (
        <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <SidebarToggler {...args} size="md" variant="ghost" />
                    <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
                </div>
                <div className="text-sm text-gray-500">
                    Responsive Toggler in navbar context
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Example of how the SideBarToggler looks when placed in a typical navigation bar layout.'
            }
        }
    }
};

export const MobileBehavior: Story = {
    name: 'Mobile Overlay Toggle',
    render: (args) => (
        <div className="bg-gray-100 p-6 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Mobile Overlay Behavior</h3>
                <p className="text-sm text-gray-600 mb-4">
                    On mobile devices, the toggler shows an overlay close button when open and a hamburger menu when closed.
                </p>
                <div className="flex items-center space-x-4">
                    <SidebarToggler {...args} size="md" />
                    <span className="text-sm text-gray-500">Tap to toggle overlay</span>
                </div>
            </div>
        </div>
    ),
    parameters: {
        viewport: { defaultViewport: 'mobile1' },
        docs: {
            description: {
                story: 'Demonstrates how the sidebar toggler behaves on mobile devices with overlay functionality.'
            }
        }
    }
};

export const DesktopCollapseExpand: Story = {
    name: 'Desktop Collapse/Expand',
    render: (args) => (
        <div className="bg-white p-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Desktop Collapse/Expand Behavior</h3>
                <p className="text-sm text-gray-600 mb-4">
                    On desktop devices, the toggler handles collapse (collapse to icons only) and expand functionalities
                    with appropriate arrow icons indicating the action.
                </p>
                <div className="flex items-center space-x-4">
                    <SidebarToggler {...args} size="md" />
                    <span className="text-sm text-gray-500">Click to collapse/expand</span>
                </div>
            </div>
        </div>
    ),
    parameters: {
        viewport: { defaultViewport: 'desktop' },
        docs: {
            description: {
                story: 'Demonstrates the collapse and expand functionality on desktop devices.'
            }
        }
    }
};

export const TabletBehavior: Story = {
    name: 'Tablet/Laptop Mode',
    render: (args) => (
        <div className="bg-white p-6 space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Tablet/Laptop Behavior</h3>
                <p className="text-sm text-gray-600 mb-4">
                    On tablets and laptops, the toggler simply opens/closes the sidebar with hamburger/close icons.
                </p>
                <div className="flex items-center space-x-4">
                    <SidebarToggler {...args} size="md" />
                    <span className="text-sm text-gray-500">Hover or click to toggle</span>
                </div>
            </div>
        </div>
    ),
    parameters: {
        viewport: { defaultViewport: 'tablet' },
        docs: {
            description: {
                story: 'Shows how the toggler behaves on tablet and laptop devices with simple open/close functionality.'
            }
        }
    }
};

// All Devices Demonstration
export const AllDevicesDemo: Story = {
    name: 'All Devices Comparison',
    render: (args) => (
        <div className="bg-white p-6 space-y-6">
            <h3 className="text-xl font-semibold mb-4">Responsive Behavior Across All Devices</h3>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-700">📱 Mobile (under 768px)</h4>
                    <p className="text-sm text-gray-600 mb-2">Overlay toggle only</p>
                    <div className="flex items-center space-x-3">
                        <SidebarToggler {...args} size="md" />
                        <span className="text-xs text-gray-500">X/Hamburger icon</span>
                    </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-yellow-700">🟡 Tablet (768-1279px)</h4>
                    <p className="text-sm text-gray-600 mb-2">Simple open/close</p>
                    <div className="flex items-center space-x-3">
                        <SidebarToggler {...args} size="md" />
                        <span className="text-xs text-gray-500">Hamburger icon</span>
                    </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-green-700">🟢 Laptop (1280-1535px)</h4>
                    <p className="text-sm text-gray-600 mb-2">Simple open/close</p>
                    <div className="flex items-center space-x-3">
                        <SidebarToggler {...args} size="md" />
                        <span className="text-xs text-gray-500">Hamburger icon</span>
                    </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-purple-700">🔴 Desktop (1920px+)</h4>
                    <p className="text-sm text-gray-600 mb-2">Collapse/expand toggle</p>
                    <div className="flex items-center space-x-3">
                        <SidebarToggler {...args} size="md" />
                        <span className="text-xs text-gray-500">Arrow icons</span>
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: 'Comprehensive demonstration showing how the toggler behaves differently across all device breakpoints.'
        }
    }
};