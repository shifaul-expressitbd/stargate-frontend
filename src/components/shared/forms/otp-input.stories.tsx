import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import OTPInput from './otp-input';

const meta: Meta<typeof OTPInput> = {
    title: 'Shared/Forms/OTPInput',
    component: OTPInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        onChange: (otp) => console.log('OTP:', otp),
    },
};

export default meta;
type Story = StoryObj<typeof OTPInput>;

export const Default: Story = {
    args: {},
};

export const WithError: Story = {
    args: {
        error: 'Invalid OTP',
    },
};

export const WithSuccess: Story = {
    args: {
        success: true,
    },
};

export const CustomLength: Story = {
    args: {
        length: 4,
    },
};

export const InteractiveExample: React.ComponentType = () => {
    const [otp, setOtp] = React.useState('');

    return (
        <div className="space-y-4">
            <OTPInput length={6} onChange={setOtp} />
            <p className="text-sm text-gray-600">Entered OTP: {otp}</p>
        </div>
    );
};