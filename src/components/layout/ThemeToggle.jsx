import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../Redux/Features/shared/themeSlice';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  const handleThemeToggle = () => {
    dispatch(setTheme());
  };

  return (
    <label className="swap swap-rotate cursor-pointer">
      <input type="checkbox" onChange={handleThemeToggle} checked={mode === 'dark'} />

      {/* Sun Icon */}
      <svg
        className="swap-off w-6 h-6 fill-current text-yellow-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 4.5V2m0 20v-2.5M4.5 12H2m20 0h-2.5M5.64 5.64l-1.77-1.77m15.49 15.49l-1.77-1.77M5.64 18.36l-1.77 1.77m15.49-15.49l-1.77 1.77M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Moon Icon */}
      <svg
        className="swap-on w-6 h-6 fill-current text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </label>
  );
};

export default ThemeToggle;
