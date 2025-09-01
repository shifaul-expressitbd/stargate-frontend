import type { Meta, StoryObj } from '@storybook/react-vite';
import { FaUser } from 'react-icons/fa';
import { WidgetCard } from './widget-card';

const meta: Meta<typeof WidgetCard> = {
    title: 'shared/cards/WidgetCard',
    component: WidgetCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        icon: FaUser,
        value: '1,234',
        label: 'Total Users',
        trend: {
            value: 12.5,
            isPositive: true,
        },
        progressPercentage: 75,
    },
};

export const WithoutTrend: Story = {
    args: {
        icon: FaUser,
        value: '567',
        label: 'Active Sessions',
    },
};