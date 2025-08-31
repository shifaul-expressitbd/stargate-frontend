import type { Meta, StoryObj } from '@storybook/react-vite';
import { FaPlus } from 'react-icons/fa';
import AddBtn from './AddBtn';

const meta: Meta<typeof AddBtn> = {
    title: 'Shared/Buttons/AddBtn',
    component: AddBtn,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        to: '/add',
        text: 'Add Item',
    },
};

export default meta;
type Story = StoryObj<typeof AddBtn>;

export const Default: Story = {
    args: {},
};

export const WithCustomIcon: Story = {
    args: {
        icon: <FaPlus size={20} />,
        text: 'Add User',
        to: '/users/add',
    },
};

export const ShowTextOnMobile: Story = {
    args: {
        text: 'Add Product',
        showTextOnMobile: true,
    },
};