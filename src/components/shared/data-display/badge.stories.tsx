import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, PriceBadge, StatusBadge } from './badge';

const meta: Meta<typeof Badge> = {
    title: 'Shared/DataDisplay/Badge',
    component: Badge,
    tags: ['autodocs'],
    args: {
        children: 'Badge Text',
    },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
    args: {},
};

export const Blue: Story = {
    args: {
        variant: 'blue',
        children: 'Blue Badge',
    },
};

export const Green: Story = {
    args: {
        variant: 'green',
        children: 'Green Badge',
    },
};

export const Red: Story = {
    args: {
        variant: 'red',
        children: 'Red Badge',
    },
};

export const Purple: Story = {
    args: {
        variant: 'purple',
        children: 'Purple Badge',
    },
};

export const StatusActive: React.ComponentType = () => (
    <StatusBadge isActive={true} />
);

export const StatusInactive: React.ComponentType = () => (
    <StatusBadge isActive={false} />
);

export const PriceBadgeExample: React.ComponentType = () => (
    <PriceBadge value={1500} label="Price" />
);