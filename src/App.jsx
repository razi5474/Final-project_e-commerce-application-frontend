import React,{useEffect} from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './Routes/Router'
import { Toaster } from 'react-hot-toast';
import { useDispatch,useSelector } from 'react-redux';
import { setInitialTheme } from './Redux/Features/shared/themeSlice';

const App = () => {
  const dispatch = useDispatch();
  const mode = useSelector(state => state.theme.mode);

  useEffect(() => {
    dispatch(setInitialTheme(mode));
  }, [dispatch, mode]);
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} /> 
      
    </div>
  )
}

export default App
