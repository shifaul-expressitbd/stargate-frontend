import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './accordion';

const meta: Meta<typeof Accordion> = {
    title: 'Shared/DataDisplay/Accordion',
    component: Accordion,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
    args: {
        trigger: <span>Click to Expand</span>,
        children: (
            <div>
                <p>Here's the content inside the accordion.</p>
                <p>You can put any content here.</p>
            </div>
        ),
    },
};

export const LongContent: Story = {
    args: {
        trigger: <span>Long Content Example</span>,
        children: (
            <div>
                <p>This is a longer piece of content to demonstrate how the accordion handles more text.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
        ),
    },
};