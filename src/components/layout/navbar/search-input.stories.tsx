import type { Meta, StoryObj } from '@storybook/react-vite';
import SearchInput from './search-input';

const meta: Meta<typeof SearchInput> = {
    title: 'Layout/Navbar/SearchInput',
    component: SearchInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};