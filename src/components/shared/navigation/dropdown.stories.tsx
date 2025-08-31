import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown, DropdownContent, DropdownTrigger } from './dropdown';

const meta: Meta<typeof Dropdown> = {
    title: 'Shared/Navigation/Dropdown',
    component: Dropdown,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
    args: {
        align: 'left',
    },
    render: (args) => (
        <Dropdown {...args}>
            <DropdownTrigger>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">Click Me</button>
            </DropdownTrigger>
            <DropdownContent>
                <div className="p-4">
                    <p className="text-sm text-gray-700">Item 1</p>
                    <p className="text-sm text-gray-700">Item 2</p>
                    <p className="text-sm text-gray-700">Item 3</p>
                </div>
            </DropdownContent>
        </Dropdown>
    ),
};

export const Open: Story = {
    args: {
        align: 'left',
        isDropdownOpen: true,
    },
    render: (args) => (
        <Dropdown {...args}>
            <DropdownTrigger>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">Click Me</button>
            </DropdownTrigger>
            <DropdownContent>
                <div className="p-4">
                    <p className="text-sm text-gray-700">Option A</p>
                    <p className="text-sm text-gray-700">Option B</p>
                </div>
            </DropdownContent>
        </Dropdown>
    ),
};

export const CenterAlign: Story = {
    args: {
        align: 'center',
    },
    render: (args) => (
        <Dropdown {...args}>
            <DropdownTrigger>
                <button className="px-4 py-2 bg-green-500 text-white rounded">Center Dropdown</button>
            </DropdownTrigger>
            <DropdownContent>
                <div className="p-4">
                    <p className="text-sm text-gray-700">Centered Content</p>
                </div>
            </DropdownContent>
        </Dropdown>
    ),
};

export const RightAlign: Story = {
    args: {
        align: 'right',
    },
    render: (args) => (
        <Dropdown {...args}>
            <DropdownTrigger>
                <button className="px-4 py-2 bg-red-500 text-white rounded">Right Dropdown</button>
            </DropdownTrigger>
            <DropdownContent>
                <div className="p-4">
                    <p className="text-sm text-gray-700">Right Aligned</p>
                </div>
            </DropdownContent>
        </Dropdown>
    ),
};