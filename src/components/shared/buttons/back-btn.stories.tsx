import type { Meta, StoryObj } from '@storybook/react-vite';
import BackButton from './back-btn';

const meta: Meta<typeof BackButton> = {
    title: 'Shared/Buttons/BackButton',
    component: BackButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BackButton>;

export const Default: Story = {
    args: {},
};

export const GhostVariant: Story = {
    args: {
        variant: 'ghost',
    },
};

export const SmallSize: Story = {
    args: {
        size: 'sm',
    },
};

export const OutlineVariant: Story = {
    args: {
        variant: 'outline',
    },
};