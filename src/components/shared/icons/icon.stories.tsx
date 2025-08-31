import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { FaBeer } from 'react-icons/fa';
import { FiHeart, FiSettings, FiStar, FiUser } from 'react-icons/fi';
import { Icon } from './icon';

const meta: Meta<typeof Icon> = {
    title: 'Shared/Icons/Icon',
    component: Icon,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        icon: FiHeart,
        size: 24,
    },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
    args: {},
};

export const Sizes: React.ComponentType = () => (
    <div className="flex items-center gap-6">
        <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Small</p>
            <Icon icon={FiHeart} size={16} />
        </div>
        <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Medium</p>
            <Icon icon={FiHeart} size={24} />
        </div>
        <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Large</p>
            <Icon icon={FiHeart} size={32} />
        </div>
        <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Extra Large</p>
            <Icon icon={FiHeart} size={48} />
        </div>
    </div>
);

export const Colors: React.ComponentType = () => (
    <div className="flex items-center gap-6">
        <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Primary</p>
            <Icon icon={FiHeart} size={32} color="#ea580c" />
        </div>
        <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Blue</p>
            <Icon icon={FiHeart} size={32} color="#3b82f6" />
        </div>
        <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Green</p>
            <Icon icon={FiHeart} size={32} color="#10b981" />
        </div>
        <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Red</p>
            <Icon icon={FiHeart} size={32} color="#ef4444" />
        </div>
    </div>
);

export const DifferentIconSets: React.ComponentType = () => (
    <div className="flex items-center gap-8">
        <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Feather Icons</p>
            <Icon icon={FiStar} size={32} color="#fbbf24" className="drop-shadow-sm" />
        </div>
        <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Font Awesome</p>
            <Icon icon={FaBeer} size={32} color="#8b5cf6" className="drop-shadow-sm" />
        </div>
        <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">User</p>
            <Icon icon={FiUser} size={32} color="#06b6d4" className="drop-shadow-sm" />
        </div>
        <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Settings</p>
            <Icon icon={FiSettings} size={32} color="#6366f1" className="drop-shadow-sm" />
        </div>
    </div>
);

export const WithCustomClass: Story = {
    args: {
        icon: FiStar,
        size: 32,
        color: "#fbbf24",
        className: "hover:scale-110 transition-transform drop-shadow-lg"
    },
};

export const IconGrid: React.ComponentType = () => {
    const icons = [FiHeart, FiStar, FiUser, FiSettings, FaBeer];
    const colors = ["#ea580c", "#fbbf24", "#06b6d4", "#6366f1", "#8b5cf6"];

    return (
        <div className="grid grid-cols-5 gap-4 p-6 max-w-md">
            {icons.map((IconComponent, index) => (
                <div key={index} className="text-center">
                    <Icon
                        icon={IconComponent}
                        size={24}
                        color={colors[index]}
                        className="mb-2 hover:scale-110 transition-transform"
                    />
                    <p className="text-xs text-gray-500">{`Icon ${index + 1}`}</p>
                </div>
            ))}
        </div>
    );
};