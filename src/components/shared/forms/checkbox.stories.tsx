import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
    title: 'Shared/Forms/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        id: 'checkbox-demo',
        label: 'Accept Terms & Conditions',
    },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    args: {},
};

export const Checked: Story = {
    args: {
        checked: true,
        onChange: () => { },
    },
};

export const Unchecked: Story = {
    args: {
        checked: false,
        onChange: () => { },
    },
};

export const WithError: Story = {
    args: {
        error: 'You must accept the terms',
        checked: false,
        onChange: () => { },
    },
};

export const DisabledChecked: Story = {
    args: {
        checked: true,
        disabled: true,
        onChange: () => { },
    },
};

export const DisabledUnchecked: Story = {
    args: {
        checked: false,
        disabled: true,
        onChange: () => { },
    },
};

export const NoLabel: Story = {
    args: {
        label: undefined,
        onChange: () => { },
    },
};

export const InteractiveExample: React.ComponentType = () => {
    const [isChecked, setIsChecked] = React.useState(false);

    return (
        <div className="space-y-4">
            <Checkbox
                id="interactive-checkbox"
                label="I agree to receive newsletters"
                checked={isChecked}
                onChange={setIsChecked}
            />
            <p className="text-sm text-gray-600">
                Status: {isChecked ? 'Subscribed' : 'Not subscribed'}
            </p>
        </div>
    );
};