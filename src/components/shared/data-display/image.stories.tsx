import type { Meta, StoryObj } from '@storybook/react-vite';
import Image from './image';

const meta: Meta<typeof Image> = {
    title: 'Shared/DataDisplay/Image',
    component: Image,
    tags: ['autodocs'],
    args: {
        src: 'https://picsum.photos/300/200?random=1',
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
        src: 'https://picsum.photos/150/150?random=2',
        alt: 'Rounded sample image',
        rounded: 'full',
        width: 100,
        height: 100,
    },
};

export const ObjectFitCover: Story = {
    args: {
        src: 'https://picsum.photos/250/180?random=3',
        alt: 'Cover sample image',
        objectFit: 'cover',
        width: 200,
        height: 150,
    },
};

export const ObjectFitContain: Story = {
    args: {
        src: 'https://picsum.photos/250/180?random=4',
        alt: 'Contain sample image',
        objectFit: 'contain',
        width: 200,
        height: 150,
    },
};

export const Grayscale: Story = {
    args: {
        src: 'https://picsum.photos/300/200?random=5&grayscale',
        alt: 'Grayscale sample image',
        width: 200,
        height: 150,
    },
};

export const Clickable: Story = {
    args: {
        src: 'https://picsum.photos/200/150?random=6',
        alt: 'Clickable sample image',
        onClick: () => console.log('Image clicked'),
        role: 'button',
        tabIndex: 0,
    },
};