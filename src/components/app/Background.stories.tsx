import type { Meta, StoryObj } from '@storybook/react-vite';
import Background from './Background';

const meta: Meta<typeof Background> = {
    title: 'App/Background',
    component: Background,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};