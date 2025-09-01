import type { Meta, StoryObj } from '@storybook/react-vite';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { ProfileCard } from './profile-card';

const meta: Meta<typeof ProfileCard> = {
    title: 'shared/cards/ProfileCard',
    component: ProfileCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        name: 'John Doe',
        role: 'Software Engineer',
        avatar: 'https://avatar.iran.liara.run/public/boy',
        bio: 'Passionate about creating innovative solutions.',
        stats: [
            { label: 'Projects', value: 25 },
            { label: 'Contributions', value: 500 },
        ],
        socialLinks: [
            { icon: FaGithub, href: 'https://github.com' },
            { icon: FaLinkedin, href: 'https://linkedin.com' },
        ],
    },
};

export const Minimal: Story = {
    args: {
        name: 'Jane Smith',
        role: 'Designer',
        avatar: 'https://avatar.iran.liara.run/public/girl',
    },
};