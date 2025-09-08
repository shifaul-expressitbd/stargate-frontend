import { Button } from "@/components/shared/buttons/button";
import { useNavigate } from "react-router";

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    const handleGoHome = () => {
        navigate("/dashboard");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
            <div className="relative flex flex-col items-center justify-center gap-5">
                <h1 className="text-9xl font-extrabold tracking-widest">403</h1>
                <div className="px-2 py-1 rounded bg-orange-600 text-white">
                    Access Denied
                </div>
            </div>
            <p className="mt-5 text-2xl font-bold text-gray-800">
                Oops! You don't have permission to access this page.
            </p>
            <p className="mt-2">
                Contact your administrator if you believe this is an error.
            </p>
            <div className="mt-6 flex gap-4">
                <Button
                    title="Go Home"
                    onClick={handleGoHome}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                >
                    Go Home
                </Button>
                <Button
                    title="Go Back"
                    variant="outline"
                    onClick={handleGoBack}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                    Go Back
                </Button>
            </div>
        </div>
    );
};

export default UnauthorizedPage;