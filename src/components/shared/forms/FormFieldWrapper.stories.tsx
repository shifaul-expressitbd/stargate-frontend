import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormFieldWrapper } from './FormFieldWrapper';

const meta: Meta<typeof FormFieldWrapper> = {
    title: 'shared/forms/FormFieldWrapper',
    component: FormFieldWrapper,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: 'Email Address',
        required: true,
        id: 'email',
    },
    render: (args) => (
        <FormFieldWrapper {...args}>
            <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter your email"
            />
        </FormFieldWrapper>
    ),
};

export const WithHelperText: Story = {
    args: {
        label: 'Helper Field',
        helperText: 'This is a helper text message',
        id: 'helper',
    },
    render: (args) => (
        <FormFieldWrapper {...args}>
            <input
                type="text"
                id="helper"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter text"
            />
        </FormFieldWrapper>
    ),
};

export const Required: Story = {
    args: {
        label: 'Required Field',
        required: true,
        id: 'required',
    },
    render: (args) => (
        <FormFieldWrapper {...args}>
            <input
                type="text"
                id="required"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter text"
            />
        </FormFieldWrapper>
    ),
};

export const WithError: Story = {
    args: {
        label: 'Password',
        error: 'Password is required',
        id: 'password',
    },
    render: (args) => (
        <FormFieldWrapper {...args}>
            <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-red-500 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Enter your password"
            />
        </FormFieldWrapper>
    ),
};