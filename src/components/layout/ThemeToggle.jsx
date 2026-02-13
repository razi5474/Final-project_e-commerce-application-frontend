import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../Redux/Features/shared/themeSlice';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  const handleThemeToggle = () => {
    dispatch(setTheme());
  };

  return (
    <label className="swap swap-rotate btn btn-ghost btn-circle btn-sm">
      <input type="checkbox" onChange={handleThemeToggle} checked={mode === 'dark'} />

      {/* Sun Icon */}
      <Sun className="swap-off w-5 h-5 text-yellow-500 fill-current" />

      {/* Moon Icon */}
      <Moon className="swap-on w-5 h-5 text-blue-500 fill-current" />
    </label>
  );
};

export default ThemeToggle;
