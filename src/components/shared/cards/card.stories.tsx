import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

const meta: Meta<typeof Card> = {
    title: 'Shared/Cards/Card',
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
    args: {},
    render: () => (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card content goes here. You can add any content you like.</p>
            </CardContent>
            <CardFooter>
                <button>Action Button</button>
            </CardFooter>
        </Card>
    ),
};

export const Elevated: Story = {
    args: {
        variant: 'elevated',
    },
    render: () => (
        <Card variant="elevated">
            <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>This card has more shadow</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Content for the elevated card variant.</p>
            </CardContent>
        </Card>
    ),
};

export const Outline: Story = {
    args: {
        variant: 'outline',
    },
    render: () => (
        <Card variant="outline">
            <CardHeader>
                <CardTitle>Outline Card</CardTitle>
                <CardDescription>This card has an outline border</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Content for the outline card variant.</p>
            </CardContent>
        </Card>
    ),
};

export const Filled: Story = {
    args: {
        variant: 'filled',
    },
    render: () => (
        <Card variant="filled">
            <CardHeader>
                <CardTitle>Filled Card</CardTitle>
                <CardDescription>This card has a filled background</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Content for the filled card variant.</p>
            </CardContent>
        </Card>
    ),
};

export const Small: Story = {
    args: {
        size: 'sm',
    },
    render: () => (
        <Card size="sm">
            <CardHeader>
                <CardTitle>Small Card</CardTitle>
                <CardDescription>Compact card with reduced padding</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Content for the small card size.</p>
            </CardContent>
        </Card>
    ),
};

export const Large: Story = {
    args: {
        size: 'lg',
    },
    render: () => (
        <Card size="lg">
            <CardHeader>
                <CardTitle>Large Card</CardTitle>
                <CardDescription>Spacious card with increased padding</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Content for the large card size.</p>
            </CardContent>
        </Card>
    ),
};