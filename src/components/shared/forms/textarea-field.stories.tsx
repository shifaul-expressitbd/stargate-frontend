import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { FaComment } from 'react-icons/fa';
import { TextareaField } from './textarea-field';

const meta: Meta<typeof TextareaField> = {
    title: 'Shared/Forms/TextareaField',
    component: TextareaField,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        id: 'textarea-example',
        label: 'Description',
        placeholder: 'Enter your description...',
        rows: 3,
        onChange: (e) => console.log('Value:', e.target.value),
    },
};

export default meta;
type Story = StoryObj<typeof TextareaField>;

export const Default: Story = {
    args: {},
};

export const WithError: Story = {
    args: {
        ...Default.args,
        error: 'This field is required',
    },
};

export const WithIcon: Story = {
    args: {
        ...Default.args,
        icon: FaComment,
    },
};

export const WithCharacterCount: Story = {
    args: {
        ...Default.args,
        showCharacterCount: true,
        maxLength: 100,
    },
};

export const Disabled: Story = {
    args: {
        ...Default.args,
        disabled: true,
        value: 'Disabled textarea',
    },
};

export const NoResize: Story = {
    args: {
        ...Default.args,
        resize: false,
    },
};

export const InteractiveExample: React.ComponentType = () => {
    const [value, setValue] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    return (
        <div className="space-y-4">
            <TextareaField
                id="interactive-textarea"
                label="Your Message"
                placeholder="Type something..."
                rows={4}
                maxLength={200}
                showCharacterCount={true}
                value={value}
                onChange={handleChange}
            />
            <p className="text-sm text-gray-600">Length: {value.length}/200</p>
        </div>
    );
};