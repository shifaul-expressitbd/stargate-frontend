import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import Select, { type Option } from './select';

const meta: Meta<typeof Select> = {
    title: 'Shared/Forms/Select',
    component: Select,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

const sampleOptions: Option[] = [
    { label: 'Apple', value: 1 },
    { label: 'Banana', value: 2 },
    { label: 'Cherry', value: 3 },
    { label: 'Date', value: 4 },
    { label: 'Elderberry', value: 5 },
];

export const SingleSelect: Story = {
    args: {
        options: sampleOptions,
        value: [{ label: 'Banana', value: 2 }],
        onChange: (options: Option[]) => console.log('Selected:', options),
        label: 'Fruit',
        placeholder: 'Choose a fruit...',
    },
};

export const MultiSelect: Story = {
    args: {
        options: sampleOptions,
        value: [
            { label: 'Apple', value: 1 },
            { label: 'Cherry', value: 3 },
        ],
        mode: 'multi',
        onChange: (options: Option[]) => console.log('Selected:', options),
        label: 'Fruits',
        placeholder: 'Choose fruits...',
    },
};

export const WithSearch: Story = {
    args: {
        options: sampleOptions,
        value: [],
        onChange: (options: Option[]) => console.log('Selected:', options),
        searchable: true,
        label: 'Searchable Select',
        placeholder: 'Search and choose...',
    },
};

export const WithError: Story = {
    args: {
        options: sampleOptions,
        value: [],
        onChange: (options: Option[]) => console.log('Selected:', options),
        label: 'Required Field',
        error: 'Please select an option',
        placeholder: 'Choose an option...',
        required: true,
    },
};

export const Disabled: Story = {
    args: {
        options: sampleOptions,
        value: [{ label: 'Apple', value: 1 }],
        onChange: (options: Option[]) => console.log('Selected:', options),
        disabled: true,
        label: 'Disabled Field',
        placeholder: 'Can\'t select...',
    },
};

export const WithDisabledOptions: Story = {
    args: {
        options: [
            { label: 'Available Item', value: 1 },
            { label: 'Unavailable Item', value: 2, disabled: true },
            { label: 'Another Item', value: 3 },
        ],
        value: [],
        onChange: (options: Option[]) => console.log('Selected:', options),
        label: 'Items with Restrictions',
        placeholder: 'Choose available item...',
    },
};

export const CustomSize: Story = {
    args: {
        options: sampleOptions,
        value: [],
        onChange: (options: Option[]) => console.log('Selected:', options),
        label: 'Compact Select',
        dropdownSize: 'sm',
        placeholder: 'Compact dropdown...',
    },
};

export const InteractiveExample: React.ComponentType = () => {
    const [value, setValue] = React.useState<Option[]>([]);

    const languages = [
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
        { label: 'French', value: 'fr' },
        { label: 'German', value: 'de' },
        { label: 'Italian', value: 'it' },
        { label: 'Japanese', value: 'ja' },
    ];

    return (
        <div className="space-y-4">
            <Select
                options={languages}
                value={value}
                onChange={setValue}
                label="Preferred Language"
                placeholder="Select a language..."
                mode="single"
            />
            <p className="text-sm text-gray-600">
                Selected: {value.length > 0 ? value[0].label : 'None'}
            </p>
        </div>
    );
};