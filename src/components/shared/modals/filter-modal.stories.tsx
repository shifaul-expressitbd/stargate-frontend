import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterModal } from './filter-modal';

const meta: Meta<typeof FilterModal> = {
    title: 'Shared/Modals/FilterModal',
    component: FilterModal,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FilterModal>;

const sampleFilterFields = [
    {
        key: 'status',
        label: 'Status',
        type: 'checkbox' as const,
        options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'pending', label: 'Pending' },
        ],
    },
    {
        key: 'category',
        label: 'Category',
        type: 'radio' as const,
        options: [
            { value: 'electronics', label: 'Electronics' },
            { value: 'books', label: 'Books' },
            { value: 'clothing', label: 'Clothing' },
        ],
    },
    {
        key: 'priority',
        label: 'Priority',
        type: 'select' as const,
        options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
        ],
    },
];

export const Default: Story = {
    args: {
        isOpen: true,
        onClose: () => console.log('Modal closed'),
        filterFields: sampleFilterFields,
        onApply: (filters) => console.log('Applied filters:', filters),
    },
};

export const WithEmptyFilters: Story = {
    args: {
        isOpen: true,
        onClose: () => { },
        filterFields: [],
        onApply: () => { },
    },
};

export const WithOnlyCheckboxes: Story = {
    args: {
        isOpen: true,
        onClose: () => { },
        filterFields: [
            {
                key: 'location',
                label: 'Location',
                type: 'checkbox' as const,
                options: [
                    { value: 'usa', label: 'USA' },
                    { value: 'canada', label: 'Canada' },
                    { value: 'uk', label: 'United Kingdom' },
                ],
            },
        ],
        onApply: (filters) => console.log('Applied filters:', filters),
    },
};

export const WithSelectOnly: Story = {
    args: {
        isOpen: true,
        onClose: () => { },
        filterFields: [
            {
                key: 'size',
                label: 'Size',
                type: 'select' as const,
                options: [
                    { value: 's', label: 'Small' },
                    { value: 'm', label: 'Medium' },
                    { value: 'l', label: 'Large' },
                ],
            },
        ],
        onApply: (filters) => console.log('Applied filters:', filters),
    },
};