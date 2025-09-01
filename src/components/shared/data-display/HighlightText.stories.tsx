import type { Meta, StoryObj } from '@storybook/react-vite';
import { HighlightText } from './HighlightText';

const meta: Meta<typeof HighlightText> = {
    title: 'Shared/DataDisplay/HighlightText',
    component: HighlightText,
    tags: ['autodocs'],
    args: {
        text: 'Sample text for highlighting example',
        query: 'text',
    },
};

export default meta;
type Story = StoryObj<typeof HighlightText>;

export const Default: Story = {
    args: {},
};

export const MultipleMatches: Story = {
    args: {
        text: 'The quick brown fox jumps over the lazy dog',
        query: 'o',
    },
};

export const CaseInsensitive: Story = {
    args: {
        text: 'React is a JavaScript library for building user interfaces',
        query: 'javascript',
    },
};

export const NoMatch: Story = {
    args: {
        text: 'TypeScript is great for type safety',
        query: 'python',
    },
};