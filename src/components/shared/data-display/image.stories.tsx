import type { Meta, StoryObj } from '@storybook/react-vite';
import Image from './image';

const meta: Meta<typeof Image> = {
    title: 'Shared/DataDisplay/Image',
    component: Image,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        src: 'https://via.placeholder.com/300x200?text=Sample+Image',
        alt: 'Sample Image',
    },
};

export default meta;
type Story = StoryObj<typeof Image>;

export const Default: Story = {
    args: {},
};

export const Rounded: Story = {
    args: {
        rounded: 'full',
        width: 100,
        height: 100,
    },
};

export const ObjectFitCover: Story = {
    args: {
        objectFit: 'cover',
        width: 200,
        height: 150,
    },
};

export const ObjectFitContain: Story = {
    args: {
        objectFit: 'contain',
        width: 200,
        height: 150,
    },
};

export const Clickable: Story = {
    args: {
        onClick: () => console.log('Image clicked'),
        role: 'button',
        tabIndex: 0,
    },
};