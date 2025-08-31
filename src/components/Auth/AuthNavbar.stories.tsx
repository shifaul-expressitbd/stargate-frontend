import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthNavbar from './AuthNavbar';

const meta: Meta<typeof AuthNavbar> = {
    title: 'Auth/AuthNavbar',
    component: AuthNavbar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};