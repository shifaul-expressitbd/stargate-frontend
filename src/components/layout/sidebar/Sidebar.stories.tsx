import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar } from './index';

const meta: Meta<typeof Sidebar> = {
    title: 'Layout/Sidebar',
    component: Sidebar,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    args: {
        handleLogout: () => console.log('logout clicked'),
    },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
    args: {},
};

export const Desktop: Story = {
    args: {},
    parameters: {
        viewport: {
            defaultViewport: 'responsive',
        },
    },
};