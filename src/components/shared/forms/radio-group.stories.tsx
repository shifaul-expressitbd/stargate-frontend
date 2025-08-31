import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { RadioGroup } from './radio-group';

const meta: Meta<typeof RadioGroup> = {
    title: 'Shared/Forms/RadioGroup',
    component: RadioGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
    args: {
        id: 'radio-group-example',
        label: 'Choose an option',
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
        ],
        value: 'option1',
        onChange: (value) => console.log('Selected:', value),
    },
};

export const WithError: Story = {
    args: {
        ...Default.args,
        error: 'Please select an option',
    },
};

export const WithDisabledOption: Story = {
    args: {
        ...Default.args,
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2', disabled: true },
            { value: 'option3', label: 'Option 3' },
        ],
    },
};

export const InteractiveExample: React.ComponentType = () => {
    const [selected, setSelected] = React.useState('option1');

    return (
        <div className="space-y-4">
            <RadioGroup
                id="interactive-group"
                label="Select your preference"
                options={[
                    { value: 'option1', label: 'Preference 1' },
                    { value: 'option2', label: 'Preference 2' },
                    { value: 'option3', label: 'Preference 3' },
                ]}
                value={selected}
                onChange={setSelected}
            />
            <p className="text-sm text-gray-600">Selected: {selected}</p>
        </div>
    );
};