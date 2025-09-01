import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './pagination';

const meta: Meta<typeof Pagination> = {
    title: 'shared/navigation/Pagination',
    component: Pagination,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        currentPage: 2,
        totalPages: 10,
        itemsPerPage: 20,
        totalItems: 200,
        onPageChange: () => { },
    },
};

export const FirstPage: Story = {
    args: {
        currentPage: 1,
        totalPages: 5,
        itemsPerPage: 10,
        totalItems: 50,
        onPageChange: () => { },
    },
};

export const LastPage: Story = {
    args: {
        currentPage: 5,
        totalPages: 5,
        itemsPerPage: 10,
        totalItems: 50,
        onPageChange: () => { },
    },
};