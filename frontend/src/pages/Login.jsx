import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'; // Importing react-hook-form
import * as apiClient from '../apiClient';
import { useAppContext } from '../contexts/AppContext';
import { useQueryClient } from 'react-query'; // Importing queryClient
import Button  from '../components/Button'
function Login() {
    const navigate = useNavigate();
    const { showToast } = useAppContext();
    const queryClient = useQueryClient(); // Make sure to get the queryClient

    // Setting up form validation using useForm from react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await apiClient.signIn(data); // Use validated data from useForm
            showToast({ message: "Sign in successful!", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
            navigate(location.state?.from?.pathname || "/");
        } catch (error) {
            console.error("Login failed:", error.message);
            showToast({ message: error.message || "Login failed. Please try again.", type: "ERROR" });
        }
    };

    return (
        <div className='flex bg-custom-gradient gap-4'>
            <div className='relative flex h-screen w-4/6 bg-cover bg-center bg-no-repeat'>
                <img src="/login_bg.jpg" alt="Background" className='absolute inset-0 w-full h-full object-cover opacity-60' />
                <div className='absolute inset-0 bg-black bg-opacity-10'></div> {/* Dark overlay */}
            </div>

            {/* Right panel with form */}
            <div className='flex justify-center items-center w-2/6 min-w-fit'>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                    {/* Title */}
                    <h2 className="text-5xl font-bold text-amber-600 text-center">Sign In</h2>

                    {/* Username/Email Label & Input */}
                    <label className="text-amber-600 text-md font-extrabold" htmlFor="usernameOrEmail">
                        Username/Email
                    </label>
                    <input
                        type="text" // Keep as 'text' to accept both
                        id="usernameOrEmail" // Updated id for better accessibility
                        {...register('usernameOrEmail', {
                            required: 'Username or Email is required'
                        })}
                        placeholder='Enter your username or email to login'
                        className={`border rounded w-full py-2 px-4 font-bold focus:outline-none ${errors.usernameOrEmail ? 'border-red-500' : 'border-amber-600'} focus:ring-2 focus:ring-amber-400`}
                    />
                    {errors.usernameOrEmail && <span className="text-red-500">{errors.usernameOrEmail.message}</span>}

                    {/* Password Label & Input */}
                    <label className="text-amber-600 text-md font-extrabold" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password" // Added id for better accessibility
                        {...register('password', {
                            required: 'Password is required',
                        })}
                        placeholder='Enter your password to login'
                        className={`border rounded w-full py-2 px-4 font-bold focus:outline-none ${errors.password ? 'border-red-500' : 'border-amber-600'} focus:ring-2 focus:ring-amber-400`}
                    />
                    {errors.password && <span className="text-red-500">{errors.password.message}</span>}

                    {/* Login Button and Register Link */}
                    <div className="flex justify-between items-center mt-4 gap-2">
                        <span className="text-sm text-amber-500">
                            Not Registered? <Link className="underline hover:text-amber-600" to="/register">Create an account here</Link>
                        </span>
                        <Button first={"ENTER"}  second={"THE VIBE"}/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
