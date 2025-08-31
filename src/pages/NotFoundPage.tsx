import { Button } from "@/components/shared/buttons/button";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
      <div className="relative flex flex-col items-center justify-center gap-5">
        <h1 className="text-9xl font-extrabold tracking-widest">404</h1>
        <div className="px-2 py-1 rounded bg-red-600 text-white">
          Page Not Found
        </div>
      </div>
      <p className="mt-5 text-2xl font-bold text-gray-800">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <p className="mt-2">It might have been moved or deleted.</p>
      <Button
        title="Go Back"
        onClick={handleGoBack}
        className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
      >
        Go Back
      </Button>
    </div>
  );
};

export default NotFoundPage;
