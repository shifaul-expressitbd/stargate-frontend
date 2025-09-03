import type { Meta, StoryObj } from '@storybook/react-vite';
import AppLogo from './AppLogo';

interface AppLogoProps {
    variant?: 'default' | 'landing';
    size?: 'sm' | 'md' | 'lg';
}

const meta: Meta<AppLogoProps> = {
    title: 'App/AppLogo',
    component: AppLogo,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDeveloper: Story = {
    parameters: {
        mockData: {
            user: { role: 'developer' },
            hasBusiness: true,
        },
    },
};

export const WithUserNoBusiness: Story = {
    parameters: {
        mockData: {
            user: { role: 'user' },
            hasBusiness: false,
        },
    },
};

export const WithUserWithBusiness: Story = {
    parameters: {
        mockData: {
            user: { role: 'user' },
            hasBusiness: true,
        },
    },
};

export const NoUser: Story = {
    parameters: {
        mockData: {
            user: null,
            hasBusiness: false,
        },
    },
};