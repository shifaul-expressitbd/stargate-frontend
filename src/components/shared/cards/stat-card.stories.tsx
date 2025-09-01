import type { Meta, StoryObj } from '@storybook/react-vite';
import { BsCart, BsPeople } from 'react-icons/bs';
import { StatCard } from './stat-card';

const meta: Meta<typeof StatCard> = {
    title: 'Shared/Cards/StatCard',
    component: StatCard,
    tags: ['autodocs'],
    args: {
        value: 1250,
        label: 'Total Items',
        icon: BsCart,
    },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
    args: {},
};

export const WithPositiveTrend: Story = {
    args: {
        value: '$12,456',
        label: 'Revenue',
        icon: BsCart,
        trend: {
            value: '12.5',
            isPositive: true,
        },
    },
};

export const WithNegativeTrend: Story = {
    args: {
        value: 342,
        label: 'Users',
        icon: BsPeople,
        trend: {
            value: '5.2',
            isPositive: false,
        },
    },
};

export const HighValue: Story = {
    args: {
        value: '99.9%',
        label: 'Uptime',
        icon: BsPeople,
        trend: {
            value: '0.1',
            isPositive: true,
        },
    },
};