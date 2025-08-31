import type { Meta, StoryObj } from '@storybook/react-vite';
import { SidebarToggler } from './sidebarToggler';

const meta: Meta<typeof SidebarToggler> = {
    title: 'Layout/Sidebar/SidebarToggler',
    component: SidebarToggler,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};