import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { ButtonGroup } from './button-group';

const meta: Meta<typeof ButtonGroup> = {
    title: 'Shared/Buttons/ButtonGroup',
    component: ButtonGroup,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

// Helper component for sample buttons
const SampleButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        {children}
    </button>
);

export const Default: Story = {
    args: {
        children: (
            <>
                <SampleButton>Button 1</SampleButton>
                <SampleButton>Button 2</SampleButton>
                <SampleButton>Button 3</SampleButton>
            </>
        ),
    },
};

export const Centered: Story = {
    args: {
        align: 'center',
        children: (
            <>
                <SampleButton>A</SampleButton>
                <SampleButton>B</SampleButton>
            </>
        ),
    },
};

export const RightAligned: Story = {
    args: {
        align: 'right',
        children: (
            <>
                <SampleButton>X</SampleButton>
                <SampleButton>Y</SampleButton>
            </>
        ),
    },
};

export const WithSpacing: Story = {
    args: {
        spacing: 'md',
        children: (
            <>
                <SampleButton>Gap</SampleButton>
                <SampleButton>Here</SampleButton>
            </>
        ),
    },
};

export const Vertical: Story = {
    args: {
        orientation: 'vertical',
        children: (
            <>
                <SampleButton>Top</SampleButton>
                <SampleButton>Middle</SampleButton>
                <SampleButton>Bottom</SampleButton>
            </>
        ),
    },
};