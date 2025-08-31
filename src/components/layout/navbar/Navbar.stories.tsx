import type { Meta, StoryObj } from '@storybook/react-vite';
import { Navbar } from './index';

const meta: Meta<typeof Navbar> = {
    title: 'Layout/Navbar',
    component: Navbar,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    args: {
        handleLogout: () => console.log('logout clicked'),
    },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
    args: {},
};

export const WithClassName: Story = {
    args: {
        className: 'bg-gray-100',
    },
};