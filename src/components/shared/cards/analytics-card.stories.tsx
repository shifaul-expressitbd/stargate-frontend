import type { Meta, StoryObj } from '@storybook/react-vite';
import { BsCart, BsPeople } from 'react-icons/bs';
import { AnalyticsCard } from './analytics-card';

const meta: Meta<typeof AnalyticsCard> = {
    title: 'Shared/Cards/AnalyticsCard',
    component: AnalyticsCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        value: 1250,
        label: 'Total Sales',
        icon: BsCart,
    },
};

export default meta;
type Story = StoryObj<typeof AnalyticsCard>;

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
        label: 'Visitors',
        icon: BsPeople,
        trend: {
            value: '5.2',
            isPositive: false,
        },
    },
};

export const LargeValue: Story = {
    args: {
        value: '1,234,567',
        label: 'Total Orders',
        icon: BsCart,
        trend: {
            value: '23.1',
            isPositive: true,
        },
    },
};

export const NoTrend: Story = {
    args: {
        value: '89.5%',
        label: 'Uptime',
        icon: BsCart,
    },
};