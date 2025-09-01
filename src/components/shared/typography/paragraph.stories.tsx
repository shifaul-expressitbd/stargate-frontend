import type { Meta, StoryObj } from '@storybook/react-vite';
import { Paragraph } from './paragraph';

const meta: Meta<typeof Paragraph> = {
    title: 'shared/typography/Paragraph',
    component: Paragraph,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Paragraph>;

export const Default: Story = {
    args: {
        children: 'This is a sample paragraph. It contains some text to demonstrate how the paragraph component works in various scenarios. You can use it for longer text content.',
    },
};

export const Muted: Story = {
    args: {
        children: 'This is a muted paragraph text.',
        variant: 'muted',
    },
};