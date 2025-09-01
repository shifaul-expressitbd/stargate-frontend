import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from './heading';

const meta: Meta<typeof Heading> = {
    title: 'shared/typography/Heading',
    component: Heading,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {
    args: {
        children: 'This is a heading',
        variant: 'h1',
    },
};

export const H2: Story = {
    args: {
        children: 'H2 Heading',
        variant: 'h2',
    },
};

export const H3: Story = {
    args: {
        children: 'H3 Heading',
        variant: 'h3',
    },
};