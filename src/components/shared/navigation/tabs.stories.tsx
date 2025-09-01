import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const meta: Meta<typeof Tabs> = {
    title: 'shared/navigation/Tabs',
    component: Tabs,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
    args: {
        defaultValue: 'tab1',
        onTabChange: () => { },
    },
    render: (args) => (
        <Tabs {...args}>
            <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content for Tab 1</TabsContent>
            <TabsContent value="tab2">Content for Tab 2</TabsContent>
            <TabsContent value="tab3">Content for Tab 3</TabsContent>
        </Tabs>
    ),
};

export const WithAsyncTabChange: Story = {
    args: {
        defaultValue: 'tab1',
        onTabChange: () => new Promise((resolve) => setTimeout(resolve, 1000)),
    },
    render: (args) => (
        <Tabs {...args}>
            <TabsList>
                <TabsTrigger value="tab1">Home</TabsTrigger>
                <TabsTrigger value="tab2">About</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Home content</TabsContent>
            <TabsContent value="tab2">About content</TabsContent>
        </Tabs>
    ),
};