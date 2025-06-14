const ErrorState = ({
  onRetry,
  error,
  title,
}: {
  onRetry: () => void;
  error: string;
  title: string;
}) => (
  <div className="text-red-500 py-2">
    <p>
      Error get data {title}: {error}
    </p>
    <button
      onClick={onRetry}
      className="bg-blue-500 text-white rounded-md p-2 mt-1"
    >
      Try again
    </button>
  </div>
);

export default ErrorState;
