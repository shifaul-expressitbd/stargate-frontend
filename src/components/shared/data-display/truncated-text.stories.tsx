import type { Meta, StoryObj } from '@storybook/react-vite';
import TruncatedText from './truncated-text';

const meta: Meta<typeof TruncatedText> = {
    title: 'shared/DataDisplay/TruncatedText',
    component: TruncatedText,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        text: 'This is a very long text that should be truncated when it exceeds the maximum length.',
        maxLength: 30,
    },
};

export const ShortText: Story = {
    args: {
        text: 'Short text',
        maxLength: 20,
    },
};