import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    LoadingSpinner,
    LoadingSpinnerBounce,
    LoadingSpinnerDualColor,
    LoadingSpinnerPulse,
    LoadingSpinnerTyping
} from './loading-spinner';

const meta: Meta<typeof LoadingSpinner> = {
    title: 'Shared/Feedback/LoadingSpinner',
    component: LoadingSpinner,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        'aria-label': 'Loading content...',
    },
};

export default meta;


export const Basic: StoryObj<typeof LoadingSpinner> = {
    args: {
        size: 'md',
        color: 'primary',
    },
};

export const Sizes: React.ComponentType = () => (
    <div className="flex items-center gap-8">
        <div className="text-center">
            <p className="mb-2 text-sm text-gray-600">XS</p>
            <LoadingSpinner size="xs" />
        </div>
        <div className="text-center">
            <p className="mb-2 text-sm text-gray-600">SM</p>
            <LoadingSpinner size="sm" />
        </div>
        <div className="text-center">
            <p className="mb-2 text-sm text-gray-600">MD</p>
            <LoadingSpinner size="md" />
        </div>
        <div className="text-center">
            <p className="mb-2 text-sm text-gray-600">LG</p>
            <LoadingSpinner size="lg" />
        </div>
    </div>
);

export const Colors: React.ComponentType = () => (
    <div className="flex items-center gap-8">
        <div className="text-center">
            <p className="mb-2 text-sm text-gray-600">Primary</p>
            <LoadingSpinner color="primary" />
        </div>
        <div className="text-center">
            <p className="mb-2 text-sm text-gray-600">Secondary</p>
            <LoadingSpinner color="secondary" />
        </div>
        <div className="text-center">
            <p className="mb-2 text-sm text-gray-600">Accent</p>
            <LoadingSpinner color="accent" />
        </div>
        <div className="text-center">
            <p className="mb-2 text-sm text-gray-600">Blue</p>
            <LoadingSpinner color="blue" />
        </div>
    </div>
);

export const DualRing: React.ComponentType = () => (
    <LoadingSpinnerDualColor size="md" aria-label="Dual ring loading..." />
);

export const Bounce: React.ComponentType = () => (
    <LoadingSpinnerBounce dotColor="bg-primary" aria-label="Bouncing dots loading..." />
);

export const Pulse: React.ComponentType = () => (
    <LoadingSpinnerPulse size="md" aria-label="Pulse loading..." />
);

export const Typing: React.ComponentType = () => (
    <LoadingSpinnerTyping dotColor="gray-900" aria-label="Typing indicator loading..." />
);