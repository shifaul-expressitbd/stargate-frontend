import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import StarRating from './star-rating';

const meta: Meta<typeof StarRating> = {
    title: 'Shared/Feedback/StarRating',
    component: StarRating,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        onRate: {
            action: 'rated',
        },
    },
};

export default meta;
type Story = StoryObj<typeof StarRating>;

export const Default: Story = {
    args: {
        initialRating: 3,
        onRate: (rating: number) => console.log(`Rated: ${rating} stars`),
    },
};

export const Empty: Story = {
    args: {
        initialRating: 0,
        onRate: (rating: number) => console.log(`Rated: ${rating} stars`),
    },
};

export const Full: Story = {
    args: {
        initialRating: 5,
        onRate: (rating: number) => console.log(`Rated: ${rating} stars`),
    },
};

export const SmallSize: Story = {
    args: {
        size: 'sm',
        initialRating: 4,
        onRate: (rating: number) => console.log(`Rated: ${rating} stars`),
    },
};

export const LargeSize: Story = {
    args: {
        size: 'lg',
        initialRating: 2,
        onRate: (rating: number) => console.log(`Rated: ${rating} stars`),
    },
};

export const Disabled: Story = {
    args: {
        initialRating: 3,
        disabled: true,
        onRate: (rating: number) => console.log(`Rated: ${rating} stars`),
    },
};

export const InteractiveExample: React.ComponentType = () => {
    const [rating, setRating] = React.useState(0);

    return (
        <div className="text-center">
            <StarRating
                initialRating={rating}
                onRate={setRating}
                size="md"
            />
            <p className="mt-2 text-sm text-gray-600">
                Current rating: {rating} star{rating !== 1 ? 's' : ''}
            </p>
        </div>
    );
};