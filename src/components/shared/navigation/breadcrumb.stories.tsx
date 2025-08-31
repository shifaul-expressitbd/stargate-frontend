import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
    title: 'Shared/Navigation/Breadcrumb',
    component: Breadcrumb,
    parameters: {
        layout: 'centered',
        initialEntries: ['/'],
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Basic: Story = {
    parameters: {
        initialEntries: ['/dashboard/users/123'],
    },
};

export const WithCustomLabels: Story = {
    args: {
        labelMap: {
            dashboard: 'Dashboard',
            users: 'User Management',
            '123': 'User Profile',
        },
    },
    parameters: {
        initialEntries: ['/dashboard/users/123'],
    },
};

export const CustomSeparator: Story = {
    args: {
        separator: '>',
    },
    parameters: {
        initialEntries: ['/products/electronics/laptops'],
    },
};

export const DifferentRoutes: React.ComponentType = () => (
    <div className="space-y-8 p-6">
        <div>
            <h4 className="font-medium mb-4">Dashboard → Users → Profile</h4>
            <Breadcrumb />
        </div>

        <div>
            <h4 className="font-medium mb-4">Products → Electronics → Smartphones</h4>
            <Breadcrumb />
        </div>

        <div>
            <h4 className="font-medium mb-4">Settings → Account → Security</h4>
            <Breadcrumb />
        </div>
    </div>
);

export const WithStyling: Story = {
    args: {
        className: 'bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md',
    },
    parameters: {
        initialEntries: ['/admin/settings/appearance'],
    },
};