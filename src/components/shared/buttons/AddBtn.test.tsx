import { render, screen } from '@testing-library/react';
import { FaPlus } from 'react-icons/fa';
import { BrowserRouter } from 'react-router-dom';
import AddBtn from './AddBtn';

const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('AddBtn', () => {
    it('renders correctly', () => {
        renderWithRouter(
            <AddBtn to="/test" text="Add Item" icon={<FaPlus />} />
        );

        const linkElement = screen.getByRole('link');
        expect(linkElement).toBeInTheDocument();
    });
});