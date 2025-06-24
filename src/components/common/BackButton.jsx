import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-primary hover:text-blue-600 font-medium mb-4"
    >
      <FaArrowLeft className="text-sm" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
