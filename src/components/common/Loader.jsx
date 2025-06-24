const Loader = ({ message = "Loading..." }) => (
  <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
    <span className="loading loading-spinner text-primary w-12 h-12"></span>
    <p className="text-center text-gray-500 dark:text-gray-300 text-lg animate-pulse">
      {message}
    </p>
  </div>
);

export default Loader;
