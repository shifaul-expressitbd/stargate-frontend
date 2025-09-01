import type { Meta, StoryObj } from '@storybook/react-vite';
import Comment from './comment';

const meta: Meta<typeof Comment> = {
    title: 'Features/Comment',
    component: Comment,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};