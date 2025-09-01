import type { Meta, StoryObj } from '@storybook/react-vite';
import InvoiceWrapper from './InvoiceWrapper';

const meta: Meta<typeof InvoiceWrapper> = {
    title: 'shared/utilities/InvoiceWrapper',
    component: InvoiceWrapper,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InvoiceWrapper>;

export const Default: Story = {
    args: {},
    render: () => (
        <InvoiceWrapper>
            <div style={{ padding: '20mm' }}>
                <h1>Invoice</h1>
                <p>Invoice content here...</p>
                <div>
                    <p>Item 1: $100</p>
                    <p>Item 2: $200</p>
                    <p>Total: $300</p>
                </div>
            </div>
        </InvoiceWrapper>
    ),
};