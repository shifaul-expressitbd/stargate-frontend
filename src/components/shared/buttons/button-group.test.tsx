import { render, screen } from '@testing-library/react';
import { ButtonGroup } from './button-group';

describe('ButtonGroup Accessibility', () => {
    it('should have role="group" and default aria-label', () => {
        render(
            <ButtonGroup>
                <button>Button 1</button>
                <button>Button 2</button>
            </ButtonGroup>
        );

        const groupElement = screen.getByRole('group');
        expect(groupElement).toBeInTheDocument();
        expect(groupElement).toHaveAttribute('aria-label', 'Button group');
    });

    it('should accept custom aria-label', () => {
        const customLabel = 'Navigation controls';
        render(
            <ButtonGroup aria-label={customLabel}>
                <button>Previous</button>
                <button>Next</button>
            </ButtonGroup>
        );

        const groupElement = screen.getByRole('group');
        expect(groupElement).toHaveAttribute('aria-label', customLabel);
    });
});