import type { Meta, StoryObj } from '@storybook/react-vite';
import { FaArrowLeft, FaCog, FaFileExport, FaPlus, FaUser } from 'react-icons/fa';
import PageTitle from './PageTitle';

const meta: Meta<typeof PageTitle> = {
    title: 'Layout/PageTitle',
    component: PageTitle,
    tags: ['autodocs'],
    args: {
        title: 'Page Title',
    },
    decorators: [
        (Story) => (
            <div className="p-6 bg-gray-50 min-h-screen">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof PageTitle>;

export const Default: Story = {
    args: {
        title: 'Dashboard Overview',
    },
};

export const WithBackButton: Story = {
    args: {
        title: 'Project Details',
        leftElement: (
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <FaArrowLeft className="text-sm" />
                Back to Projects
            </button>
        ),
    },
};

export const WithSettingsGear: Story = {
    args: {
        title: 'User Settings',
        rightElement: (
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                aria-label="Settings">
                <FaCog className="text-lg" />
            </button>
        ),
    },
};

export const WithExportButton: Story = {
    args: {
        title: 'Sales Report',
        rightElement: (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <FaFileExport />
                Export PDF
            </button>
        ),
    },
};

export const WithBreadcrumbAndAction: Story = {
    args: {
        title: 'Order #12345',
        leftElement: (
            <nav className="flex text-sm text-gray-500">
                <a href="#" className="hover:text-gray-700">Dashboard</a>
                <span className="mx-2">{'>'}</span>
                <a href="#" className="hover:text-gray-700">Orders</a>
                <span className="mx-2">{'>'}</span>
                <span className="text-gray-700">#12345</span>
            </nav>
        ),
        rightElement: (
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                aria-label="Add new item">
                <FaPlus className="text-lg" />
            </button>
        ),
    },
};

export const IconAndTitle: Story = {
    args: {
        title: 'My Profile',
        leftElement: <FaUser className="text-2xl text-blue-600" />,
        rightElement: (
            <button className="text-blue-600 hover:text-blue-800 font-medium">
                Edit Profile
            </button>
        ),
    },
};

export const ComplexLayout: Story = {
    args: {
        title: 'Team Management',
        leftElement: (
            <div className="flex items-center gap-3">
                <button className="text-gray-600 hover:text-gray-800 p-1"
                    aria-label="Go back">
                    <FaArrowLeft />
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    TM
                </div>
                <span className="text-sm text-gray-600">Marketing Team</span>
            </div>
        ),
        rightElement: (
            <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md">
                    Filter
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                    Add Member
                </button>
            </div>
        ),
        className: 'border-b border-gray-200 pb-4',
    },
};