import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserBox } from './user-box';

const meta: Meta<typeof UserBox> = {
    title: 'Layout/Navbar/UserBox',
    component: UserBox,
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
            user: { userId: 'john_doe', role: 'user' },
        },
    },
};

export const WithUser: Story = {
    args: {},
    parameters: {
        mockData: {
            user: { userId: 'john_doe', role: 'user' },
        },
    },
};

export const WithDeveloper: Story = {
    args: {},
    parameters: {
        mockData: {
            user: { userId: 'john_doe', role: 'developer' },
        },
    },
};

export const Guest: Story = {
    args: {},
    parameters: {
        mockData: {
            user: null,
        },
    },
};