import type { Meta, StoryObj } from '@storybook/react-vite';
import AppLogo from './AppLogo';

const meta: Meta<typeof AppLogo> = {
    title: 'App/AppLogo',
    component: AppLogo,
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

export const WithDeveloper: Story = {
    args: {},
    parameters: {
        mockData: {
            user: { role: 'developer' },
            hasBusiness: true,
        },
    },
};

export const WithUserNoBusiness: Story = {
    args: {},
    parameters: {
        mockData: {
            user: { role: 'user' },
            hasBusiness: false,
        },
    },
};

export const WithUserWithBusiness: Story = {
    args: {},
    parameters: {
        mockData: {
            user: { role: 'user' },
            hasBusiness: true,
        },
    },
};

export const NoUser: Story = {
    args: {},
    parameters: {
        mockData: {
            user: null,
            hasBusiness: false,
        },
    },
};