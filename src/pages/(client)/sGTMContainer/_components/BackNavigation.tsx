import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const BackNavigation = () => {
    return (
        <div className="flex items-center gap-4 bg-transparent">
            <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-cyan-300 hover:text-white bg-transparent"
            >
                <FaArrowLeft />
                <span className="font-poppins">Back to Dashboard</span>
            </Link>
        </div>
    );
};