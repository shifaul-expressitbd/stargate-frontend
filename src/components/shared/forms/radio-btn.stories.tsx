import type { Meta, StoryObj } from '@storybook/react-vite';
import { FaUser } from 'react-icons/fa';
import { RadioButton } from './radio-btn';

const meta: Meta<typeof RadioButton> = {
    title: 'Shared/Forms/RadioButton',
    component: RadioButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        id: 'radio-example',
        name: 'radio-group',
        value: 'option1',
        label: 'Option 1',
        onChange: (e) => console.log('Selected:', e.target.value),
    },
};

export default meta;
type Story = StoryObj<typeof RadioButton>;

export const Default: Story = {
    args: {},
};

export const Checked: Story = {
    args: {
        checked: true,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const WithError: Story = {
    args: {
        error: true,
        checked: true,
    },
};

export const WithIconLabel: Story = {
    args: {
        label: (
            <div className="flex items-center gap-2">
                <FaUser />
                <span>User Profile</span>
            </div>
        ),
    },
};