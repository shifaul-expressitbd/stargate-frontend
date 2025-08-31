import type { Meta, StoryObj } from '@storybook/react-vite';
import Calendar from './calendar';

const meta: Meta<typeof Calendar> = {
    title: 'Shared/Forms/Calendar',
    component: Calendar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        id: 'calendar-demo',
        onDateChange: () => { },
    },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
    args: {
        label: 'Select Date',
        mode: 'single',
    },
};

export const SingleMode: Story = {
    args: {
        label: 'Single Date Selection',
        mode: 'single',
        placeholder: 'Pick a date',
        showMonthYearSelection: true,
        dualMonth: false,
    },
};

export const MultiMode: Story = {
    args: {
        label: 'Multiple Date Selection',
        mode: 'multi',
        placeholder: 'Select multiple dates',
    },
};

export const RangeMode: Story = {
    args: {
        label: 'Date Range Selection',
        mode: 'range',
        placeholder: 'Select date range',
        dualMonth: true,
    },
};

export const WithPreselectedDates: Story = {
    args: {
        label: 'Preselected Dates',
        mode: 'multi',
        selectedDates: [new Date(), new Date(Date.now() + 86400000)],
        placeholder: 'Dates are preselected',
    },
};

export const WithCustomPosition: Story = {
    args: {
        label: 'Custom Position',
        mode: 'single',
        position: 'top',
        placeholder: 'Dropdown appears on top',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled Calendar',
        mode: 'single',
        disabled: true,
        placeholder: 'This calendar is disabled',
    },
};

export const WithError: Story = {
    args: {
        label: 'Calendar with Error',
        mode: 'single',
        error: 'Please select a valid date',
        placeholder: 'Select date',
    },
};

export const WithWarning: Story = {
    args: {
        label: 'Calendar with Warning',
        mode: 'single',
        warning: 'Selecting future dates is recommended',
        placeholder: 'Select date',
    },
};

export const NoMonthYearSelection: Story = {
    args: {
        label: 'Without Month/Year Selector',
        mode: 'single',
        showMonthYearSelection: false,
        placeholder: 'Navigation only by arrows',
    },
};