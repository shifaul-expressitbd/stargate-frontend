import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import * as stories from './button.stories';

// Compose stories for proper testing
const { Default, Ghost, Small, Large, Disabled } = composeStories(stories);

const user = userEvent.setup();

describe('Button Component - Accessibility & Interaction Tests', () => {
    describe('Default Variant', () => {
        beforeEach(() => {
            render(<Default {...Default.args} />);
        });

        it('renders button with correct role', async () => {
            const button = screen.getByRole('button', { name: /click me/i });
            expect(button).toBeInTheDocument();
        });

        it('supports keyboard navigation', async () => {
            const button = screen.getByRole('button', { name: /click me/i });
            await user.tab();
            expect(button).toHaveFocus();
        });

        it('is accessible with screen readers', async () => {
            const button = screen.getByRole('button', { name: /click me/i });
            expect(button).toBeVisible();
            expect(button).toBeEnabled();
        });

        it('triggers click handler when clicked', async () => {
            const spy = vi.fn();
            const button = screen.getByRole('button', { name: /click me/i });
            button.onclick = spy;
            await user.click(button);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('Ghost Variant', () => {
        beforeEach(() => {
            render(<Ghost {...Ghost.args} />);
        });

        it('renders ghost variant correctly', () => {
            const button = screen.getByRole('button', { name: /ghost/i });
            expect(button).toBeInTheDocument();
            expect(button).toHaveAttribute('data-variant', 'ghost');
        });

        it('maintains accessibility in ghost variant', () => {
            const button = screen.getByRole('button', { name: /ghost/i });
            expect(button).toHaveFocus();
        });
    });

    describe('Disabled State', () => {
        beforeEach(() => {
            render(<Disabled {...Disabled.args} />);
        });

        it('renders disabled button correctly', () => {
            const button = screen.getByRole('button', { name: /disabled/i });
            expect(button).toBeDisabled();
            expect(button).toHaveAttribute('disabled');
        });

        it('prevents interaction when disabled', async () => {
            const spy = vi.fn();
            const button = screen.getByRole('button', { name: /disabled/i });
            button.onclick = spy;
            await user.click(button);
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('Size Variants', () => {
        it('renders small variant correctly', () => {
            const { getByRole } = render(<Small {...Small.args} />);
            const button = getByRole('button', { name: /small/i });
            expect(button).toHaveAttribute('data-size', 'sm');
        });

        it('renders large variant correctly', () => {
            const { getByRole } = render(<Large {...Large.args} />);
            const button = getByRole('button', { name: /large/i });
            expect(button).toHaveAttribute('data-size', 'lg');
        });
    });

    describe('Interactive Behavior', () => {
        it('handles rapid clicks without issues', async () => {
            const spy = vi.fn();
            const { getByRole } = render(<Default {...Default.args} />);

            const button = getByRole('button', { name: /click me/i });
            button.onclick = spy;

            for (let i = 0; i < 3; i++) {
                await user.click(button);
            }

            expect(spy).toHaveBeenCalledTimes(3);
        });

        it('maintains focus after interaction', async () => {
            const { getByRole } = render(<Default {...Default.args} />);
            const button = getByRole('button', { name: /click me/i });

            await user.click(button);
            expect(button).toHaveFocus();
        });
    });
});