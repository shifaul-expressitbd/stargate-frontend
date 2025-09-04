import type { Meta, StoryObj } from '@storybook/react-vite';
import { AiOutlineEye } from 'react-icons/ai';
import { FiMail, FiUser } from 'react-icons/fi';
import { InputField } from './input-field';

const meta: Meta<typeof InputField> = {
    title: 'Shared/Forms/InputField',
    component: InputField,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        id: 'input-demo',
        placeholder: 'Enter text here',
    },
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {
    args: {
        label: 'First Name',
        onChange: () => { },
    },
};

export const WithIcon: Story = {
    args: {
        label: 'Username',
        id: 'username',
        icon: FiUser,
        placeholder: 'Enter your username',
        onChange: () => { },
    },
};

export const WithLeftElement: Story = {
    args: {
        label: 'Phone',
        id: 'phone',
        leftElement: <span className="text-gray-500">+1</span>,
        onChange: () => { },
    },
};

export const WithRightElement: Story = {
    args: {
        label: 'Password',
        id: 'password',
        type: 'password',
        rightElement: (
            <button className="text-gray-400 hover:text-gray-600" aria-label="Toggle password visibility">
                <AiOutlineEye size={16} />
            </button>
        ),
        onChange: () => { },
    },
};

export const WithError: Story = {
    args: {
        label: 'Email',
        id: 'email',
        type: 'email',
        icon: FiMail,
        error: 'Please enter a valid email address',
        value: 'invalid-email',
        onChange: () => { },
    },
};

export const WithWarning: Story = {
    args: {
        label: 'Password',
        id: 'password',
        type: 'password',
        warning: 'Password should be at least 8 characters',
        onChange: () => { },
    },
};

export const Disabled: Story = {
    args: {
        label: 'Read Only Field',
        id: 'readonly',
        disabled: true,
        value: 'Disabled content',
        onChange: () => { },
    },
};

export const EmailExample: Story = {
    args: {
        label: 'Email Address',
        id: 'email',
        type: 'email',
        icon: FiMail,
        placeholder: 'your@email.com',
        required: true,
        onChange: () => { },
    },
};

export const CosmicVariant: Story = {
    args: {
        label: 'Username',
        id: 'cosmic-username',
        variant: 'cosmic',
        icon: FiUser,
        placeholder: 'Enter galactic username',
        onChange: () => { },
    },
};