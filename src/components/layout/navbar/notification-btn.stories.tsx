import type { Meta, StoryObj } from '@storybook/react-vite';
import NotificationsDropdown from './notification-btn';

const meta: Meta<typeof NotificationsDropdown> = {
    title: 'Layout/Navbar/NotificationBtn',
    component: NotificationsDropdown,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const WithNotifications: Story = {
    args: {
        notifications: [
            {
                id: 1,
                date: '2023-10-01',
                time: '10:00 AM',
                name: 'John Doe',
                message: 'New message from John Doe: "Hey, are you free?"',
            },
            {
                id: 2,
                date: '2023-10-01',
                time: '11:00 AM',
                name: 'Jane Smith',
                message: 'Update on your project: Task completed.',
            },
        ],
    },
};

export const WithManyNotifications: Story = {
    args: {
        notifications: Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            date: '2023-10-01',
            time: '12:00 PM',
            name: 'User ' + (i + 1),
            message: 'Notification message ' + (i + 1),
        })),
    },
};