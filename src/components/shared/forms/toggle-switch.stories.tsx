import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleSwitch } from './toggle-switch';

const meta: Meta<typeof ToggleSwitch> = {
    title: 'shared/forms/ToggleSwitch',
    component: ToggleSwitch,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        id: 'toggle-1',
        label: 'Enable notifications',
        checked: false,
        onChange: () => { },
    },
};

export const Checked: Story = {
    args: {
        id: 'toggle-2',
        label: 'Dark mode',
        checked: true,
        onChange: () => { },
        showStateText: true,
    },
};

export const WithError: Story = {
    args: {
        id: 'toggle-3',
        label: 'Accept terms',
        checked: false,
        error: 'You must accept the terms',
        onChange: () => { },
    },
};