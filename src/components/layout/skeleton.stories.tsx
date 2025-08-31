import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './skeleton';

const meta: Meta<typeof Skeleton> = {
    title: 'Layout/Skeleton',
    component: Skeleton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
    args: {
        className: 'h-4 w-4',
    },
};

export const Rectangle: Story = {
    args: {
        className: 'h-12 w-32',
    },
};

export const Circle: Story = {
    args: {
        className: 'h-16 w-16 rounded-full',
    },
};