import type { Meta, StoryObj } from '@storybook/react-vite';
import ThemeColorPicker from './theme-picker';

const meta: Meta<typeof ThemeColorPicker> = {
    title: 'Layout/Navbar/ThemePicker',
    component: ThemeColorPicker,
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
            color: 'blue',
        },
    },
};

export const RedColor: Story = {
    args: {},
    parameters: {
        mockData: {
            color: 'red',
        },
    },
};

export const GreenColor: Story = {
    args: {},
    parameters: {
        mockData: {
            color: 'green',
        },
    },
};

export const BlueColor: Story = {
    args: {},
    parameters: {
        mockData: {
            color: 'blue',
        },
    },
};

export const SageColor: Story = {
    args: {},
    parameters: {
        mockData: {
            color: 'sage',
        },
    },
};