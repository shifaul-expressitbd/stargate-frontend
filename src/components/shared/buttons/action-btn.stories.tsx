import type { Meta, StoryObj } from '@storybook/react-vite';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ActionBtn } from './action-btn';

const meta: Meta<typeof ActionBtn> = {
    title: 'Shared/Buttons/ActionBtn',
    component: ActionBtn,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        items: [
            {
                label: 'Edit',
                icon: FaEdit,
                onClick: () => console.log('Edit clicked'),
            },
            {
                label: 'Delete',
                icon: FaTrash,
                onClick: () => console.log('Delete clicked'),
            },
        ],
    },
};

export default meta;
type Story = StoryObj<typeof ActionBtn>;

export const Default: Story = {
    args: {},
};

export const Vertical: Story = {
    args: {
        direction: 'vertical',
    },
};

export const SolidVariant: Story = {
    args: {
        variant: 'solid',
    },
};

export const OutlineVariant: Story = {
    args: {
        variant: 'outline',
    },
};

export const SmallSize: Story = {
    args: {
        size: 'sm',
    },
};

export const ExtraSmallSize: Story = {
    args: {
        size: 'xs',
    },
};