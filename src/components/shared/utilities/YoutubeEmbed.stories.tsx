import type { Meta, StoryObj } from '@storybook/react-vite';
import YouTubeEmbed from './YoutubeEmbed';

const meta: Meta<typeof YouTubeEmbed> = {
    title: 'shared/utilities/YouTubeEmbed',
    component: YouTubeEmbed,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof YouTubeEmbed>;

export const Default: Story = {
    args: {
        src: 'jNQXAC9IVRw',
        title: 'Sample YouTube Video',
        width: 560,
        height: 315,
    },
};

export const VideoIdOnly: Story = {
    args: {
        src: 'dQw4w9WgXcQ',
        title: 'Another Video',
    },
};