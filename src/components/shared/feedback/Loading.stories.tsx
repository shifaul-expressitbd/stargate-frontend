import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading } from './Loading';

const meta: Meta<typeof Loading> = {
    title: 'Shared/Feedback/Loading',
    component: Loading,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const SingleSection: Story = {
    args: {
        sections: [
            {
                gridCols: 'grid-cols-1',
                count: 3,
            },
        ],
    },
};

export const MultipleSections: Story = {
    args: {
        sections: [
            {
                gridCols: 'grid-cols-2',
                count: 2,
            },
            {
                gridCols: 'grid-cols-3',
                count: 6,
            },
            {
                gridCols: 'grid-cols-1',
                count: 1,
                skeletonClass: 'h-32 w-full',
            },
        ],
    },
};

export const CustomHeader: Story = {
    args: {
        headerHeight: 'h-16 w-full',
        sections: [
            {
                gridCols: 'grid-cols-2',
                count: 4,
                skeletonClass: 'h-24 w-full',
            },
        ],
    },
};

export const ModalLoading: Story = {
    args: {
        sections: [
            {
                wrapperClass: 'p-6 bg-white rounded-lg shadow-lg',
                gridCols: 'grid-cols-1',
                count: 2,
                skeletonClass: 'h-6 w-full',
            },
        ],
        className: 'bg-black/50',
    },
};