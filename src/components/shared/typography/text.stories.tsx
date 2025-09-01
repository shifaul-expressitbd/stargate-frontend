import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './text';

const meta: Meta<typeof Text> = {
    title: 'shared/typography/Text',
    component: Text,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
    args: {
        children: 'This is a sample text element.',
    },
};

export const AsParagraph: Story = {
    args: {
        children: 'This text is rendered as a paragraph element.',
        as: 'p',
    },
};

export const Muted: Story = {
    args: {
        children: 'This is muted text.',
        variant: 'muted',
    },
};