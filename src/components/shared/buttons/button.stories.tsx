import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';

const meta: Meta<typeof Button> = {
    title: 'Shared/Buttons/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        title: 'Button',
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        title: 'Default Button',
        children: 'Click me',
    },
};

export const Ghost: Story = {
    args: {
        title: 'Ghost Button',
        variant: 'ghost',
        children: 'Ghost',
    },
};

export const Outline: Story = {
    args: {
        title: 'Outline Button',
        variant: 'outline',
        children: 'Outline',
    },
};

export const Small: Story = {
    args: {
        title: 'Small Button',
        size: 'sm',
        children: 'Small',
    },
};

export const Large: Story = {
    args: {
        title: 'Large Button',
        size: 'lg',
        children: 'Large',
    },
};

export const Disabled: Story = {
    args: {
        title: 'Disabled Button',
        disabled: true,
        children: 'Disabled',
    },
};