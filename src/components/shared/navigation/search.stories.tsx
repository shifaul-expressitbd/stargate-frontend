import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search } from './search';

const meta: Meta<typeof Search> = {
    title: 'shared/navigation/Search',
    component: Search,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {
    args: {
        onSearch: () => { },
        placeholder: 'Enter search term',
    },
};

export const WithValue: Story = {
    args: {
        onSearch: () => { },
        value: 'Initial value',
        placeholder: 'Search here',
    },
};

export const Disabled: Story = {
    args: {
        onSearch: () => { },
        placeholder: 'Disabled search',
        disabled: true,
    },
};