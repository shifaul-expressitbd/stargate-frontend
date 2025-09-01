import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from './table';

const meta: Meta<typeof Table> = {
    title: 'shared/DataDisplay/Table',
    component: Table,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: 'User Data',
        striped: true,
        hoverable: true,
    },
};

Default.decorators = [
    (Story) => (
        <div className="w-full">
            <Story />
        </div>
    ),
];

Default.render = function Render(args) {
    return (
        <Table {...args}>
            <TableHeader>
                <TableRow>
                    <TableHead sortKey="name">Name</TableHead>
                    <TableHead sortKey="age">Age</TableHead>
                    <TableHead sortKey="email">Email</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell>john@example.com</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>25</TableCell>
                    <TableCell>jane@example.com</TableCell>
                </TableRow>
            </TableBody>
            <TableCaption>This is a sample data table.</TableCaption>
        </Table>
    );
};