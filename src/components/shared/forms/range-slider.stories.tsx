import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { RangeSlider } from './range-slider';

const meta: Meta<typeof RangeSlider> = {
    title: 'Shared/Forms/RangeSlider',
    component: RangeSlider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        id: 'range-example',
        label: 'Volume',
        min: 0,
        max: 100,
        value: 50,
        onChange: (value) => console.log('Value:', value),
    },
};

export default meta;
type Story = StoryObj<typeof RangeSlider>;

export const Default: Story = {
    args: {},
};

export const WithError: Story = {
    args: {
        ...Default.args,
        error: 'Value out of range',
    },
};

export const Disabled: Story = {
    args: {
        ...Default.args,
        disabled: true,
    },
};

export const InteractiveExample: React.ComponentType = () => {
    const [value, setValue] = React.useState(25);

    return (
        <div className="space-y-4">
            <RangeSlider
                id="interactive-range"
                label="Adjust Value"
                min={0}
                max={100}
                step={5}
                value={value}
                onChange={setValue}
            />
            <p className="text-sm text-gray-600">Current Value: {value}</p>
        </div>
    );
};