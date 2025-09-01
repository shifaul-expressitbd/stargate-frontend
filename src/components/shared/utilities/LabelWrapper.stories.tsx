import type { Meta, StoryObj } from '@storybook/react-vite';
import LabelWrapper from './LabelWrapper';

const meta: Meta<typeof LabelWrapper> = {
    title: 'shared/utilities/LabelWrapper',
    component: LabelWrapper,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LabelWrapper>;

export const Default: Story = {
    args: {},
    render: () => (
        <LabelWrapper>
            <div style={{ padding: '10mm', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <h2>Sample Label</h2>
                <p>This is a sample label content.</p>
            </div>
        </LabelWrapper>
    ),
};