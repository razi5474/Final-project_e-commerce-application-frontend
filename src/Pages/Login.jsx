import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { api } from '../config/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearUser, saveUser } from '../Redux/Features/user/userSlice'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

const Login = ({ role }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const user = {
    role: 'user',
    loginAPI: '/user/login',
    signupRoute: '/user/register',
    profileRoute: '/user/profile',
  }

  if (role === 'seller') {
    user.role = 'seller'
    user.loginAPI = '/seller/login'
    user.signupRoute = '/seller/register'
    user.profileRoute = '/seller/profile'
  }

  const submitData = async (values) => {
    try {
      const response = await api.post(user.loginAPI, values, {
        withCredentials: true,
      })
      dispatch(saveUser(response?.data?.userObject))
      navigate(user.profileRoute)
    } catch (error) {
      setServerError(error?.response?.data?.message || 'Invalid email or password')
      dispatch(clearUser())
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: (values) => {
      setServerError('')
      submitData(values)
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-base-100 rounded-xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Login to Your <span className="text-blue-600 capitalize">{user.role}</span> Account
        </h2>

        {serverError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps('email')}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none dark:bg-base-200 ${
                formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...formik.getFieldProps('password')}
              className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none dark:bg-base-200 ${
                formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-blue-600"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200 font-semibold"
          >
            Login
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
            Register
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
