import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './tooltip';

const meta: Meta<typeof Tooltip> = {
    title: 'shared/DataDisplay/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Tooltip content="This is a tooltip">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>
        </Tooltip>
    ),
};

export const Top: Story = {
    args: {
        content: 'Tooltip content',
        position: 'top',
        delay: 0,
    },
    render: (args) => (
        <Tooltip {...args}>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>
        </Tooltip>
    ),
};