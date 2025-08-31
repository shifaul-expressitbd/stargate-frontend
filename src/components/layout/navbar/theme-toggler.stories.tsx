import type { Meta, StoryObj } from '@storybook/react-vite';
import ThemeToggler from './themeToggler';

const meta: Meta<typeof ThemeToggler> = {
    title: 'Layout/Navbar/ThemeToggler',
    component: ThemeToggler,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
    parameters: {
        mockData: {
            mode: 'light',
        },
    },
};

export const LightMode: Story = {
    args: {},
    parameters: {
        mockData: {
            mode: 'light',
        },
    },
};

export const DarkMode: Story = {
    args: {},
    parameters: {
        mockData: {
            mode: 'dark',
        },
    },
};