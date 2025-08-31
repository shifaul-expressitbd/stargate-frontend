import type { Meta, StoryObj } from '@storybook/react-vite';
import PageTitle from './PageTitle';

const meta: Meta<typeof PageTitle> = {
    title: 'Layout/PageTitle',
    component: PageTitle,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        title: 'Page Title',
    },
};

export default meta;
type Story = StoryObj<typeof PageTitle>;

export const Default: Story = {
    args: {
        title: 'Dashboard',
    },
};

export const WithLeftElement: Story = {
    args: {
        title: 'Settings',
        leftElement: <span>←</span>,
    },
};

export const WithRightElement: Story = {
    args: {
        title: 'Profile',
        rightElement: <button>Edit</button>,
    },
};

export const WithBothElements: Story = {
    args: {
        title: 'Orders',
        leftElement: <span>⚙️</span>,
        rightElement: <button>Export</button>,
    },
};

export const CustomClass: Story = {
    args: {
        title: 'My Page',
        className: 'bg-gray-100',
    },
};