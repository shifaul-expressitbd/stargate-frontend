import type { Meta, StoryObj } from '@storybook/react-vite';
import Modal from './modal';

const meta: Meta<typeof Modal> = {
    title: 'Shared/Modals/Modal',
    component: Modal,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Basic: Story = {
    args: {
        isModalOpen: true,
        onClose: () => console.log('Modal closed'),
        title: 'Basic Modal',
        children: (
            <div className="p-4">
                <p className="text-gray-700 dark:text-gray-300">
                    This is the content inside the modal. You can put any content here, including forms, images, or other components.
                </p>
            </div>
        ),
    },
};

export const WithConfirmation: Story = {
    args: {
        isModalOpen: true,
        onClose: () => console.log('Modal closed'),
        title: 'Confirm Action',
        children: (
            <div className="p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Are you sure you want to perform this action? This cannot be undone.
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        ⚠️ This will permanently delete the selected items.
                    </p>
                </div>
            </div>
        ),
        onConfirm: () => console.log('Action confirmed'),
        confirmText: 'Delete Items',
    },
};

export const NoHeader: Story = {
    args: {
        isModalOpen: true,
        onClose: () => console.log('Modal closed'),
        showHeader: false,
        showFooter: false,
        children: (
            <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    No Header/Footer Modal
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                    This modal has no header or footer, perfect for custom content.
                </p>
                <button
                    onClick={() => console.log('Custom close')}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-orange-600"
                >
                    Close Custom
                </button>
            </div>
        ),
    },
};

export const Small: Story = {
    args: {
        isModalOpen: true,
        onClose: () => console.log('Modal closed'),
        title: 'Small Modal',
        size: 'sm',
        children: (
            <div className="p-4">
                <p className="text-gray-700 dark:text-gray-300">
                    This is a small, compact modal perfect for quick confirmations or alerts.
                </p>
            </div>
        ),
    },
};

export const Large: Story = {
    args: {
        isModalOpen: true,
        onClose: () => console.log('Modal closed'),
        title: 'Large Modal',
        size: 'lg',
        children: (
            <div className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Form Content Example
                </h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Enter description"
                        />
                    </div>
                </div>
            </div>
        ),
    },
};

export const WithFormContent: Story = {
    args: {
        isModalOpen: true,
        onClose: () => console.log('Modal closed'),
        title: 'User Form',
        size: 'xl',
        children: (
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="John"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="john.doe@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Role
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                            <option>User</option>
                            <option>Admin</option>
                            <option>Manager</option>
                        </select>
                    </div>
                </div>
            </div>
        ),
        onConfirm: () => console.log('Form submitted'),
        confirmText: 'Save User',
    },
};

export const Processing: Story = {
    args: {
        isModalOpen: true,
        onClose: () => console.log('Modal closed'),
        title: 'Processing',
        children: (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-700 dark:text-gray-300">
                    Processing your request... Please wait.
                </p>
            </div>
        ),
        disableClickOutside: true,
        isConfirming: true,
    },
};