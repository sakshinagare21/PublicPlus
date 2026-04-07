import { Link } from "react-router-dom";

const NotFound = () => {
 return (
 <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
 <h1 className="text-7xl font-extrabold text-blue-600">404</h1>

 <h2 className="mt-4 text-2xl font-bold text-gray-800">
 Page Not Found
 </h2>

 <p className="mt-2 max-w-md text-gray-500">
 Sorry, the page you are looking for doesn’t exist or has been moved.
 </p>

 <Link to="/">
 <button className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg active:scale-95">
 Go Back Home
 </button>
 </Link>
 </div>
 );
};

export default NotFound;


