import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from '../apiClient'; // Make sure apiClient.register handles file uploads
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button"
const Register = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showToast } = useAppContext();

    // Preview states for avatar and cover images
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    // Using react-hook-form for validation
    const { register, handleSubmit, formState: { errors } } = useForm();

    const mutation = useMutation(apiClient.register, {
        onSuccess: async () => {
            showToast({ message: "Registration Success!", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
            navigate("/");
        },
        onError: (error) => {
            showToast({ message: error.message, type: "ERROR" });
        },
    });

    // Handle avatar image change
    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle cover image change
    const handleCoverChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // On form submit, create FormData and send it to API
    const onSubmit = (formData) => {
        const formDataToSubmit = new FormData();
        formDataToSubmit.append("fullname", formData.fullname);
        formDataToSubmit.append("username", formData.username);
        formDataToSubmit.append("email", formData.email);
        formDataToSubmit.append("password", formData.password);
        if (formData.avatar[0]) {
            formDataToSubmit.append("avatar", formData.avatar[0]);
        }
        if (formData.coverImage[0]) {
            formDataToSubmit.append("coverImage", formData.coverImage[0]);
        }

        mutation.mutate(formDataToSubmit);
    };

    return (
        <div className='flex bg-custom-gradient gap-4'>
            <div className='relative flex h-screen w-4/6 bg-cover bg-center bg-no-repeat'>
                <img src="/login_bg.jpg" alt="Background" className='absolute inset-0 w-full h-full object-cover opacity-60' />
                <div className='absolute inset-0 bg-black bg-opacity-10'></div>
            </div>

            {/* Right panel with form */}
            <div className='flex justify-center items-center w-2/6 min-w-fit'>
                <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                    {/* Title */}
                    <h2 className="text-5xl font-bold text-amber-600 text-center">Register</h2>

                    {/* Full Name */}
                    <label className="text-amber-600 text-md font-extrabold">Full Name</label>
                    <input
                        type="text"
                        {...register('fullname', { required: 'Full Name is required' })}
                        placeholder='Enter your full name'
                        className="border border-amber-600 rounded w-full py-2 px-4 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    {errors.fullname && <span className="text-red-500">{errors.fullname.message}</span>}

                    {/* Username */}
                    <label className="text-amber-600 text-md font-extrabold">Username</label>
                    <input
                        type="text"
                        {...register('username', { required: 'Username is required' })}
                        placeholder='Enter your username'
                        className="border border-amber-600 rounded w-full py-2 px-4 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    {errors.username && <span className="text-red-500">{errors.username.message}</span>}

                    {/* Email */}
                    <label className="text-amber-600 text-md font-extrabold">Email</label>
                    <input
                        type="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' }
                        })}
                        placeholder='Enter your email'
                        className="border border-amber-600 rounded w-full py-2 px-4 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    {errors.email && <span className="text-red-500">{errors.email.message}</span>}

                    {/* Password */}
                    <label className="text-amber-600 text-md font-extrabold">Password</label>
                    <input
                        type="password"
                        {...register('password', { required: 'Password is required'})}
                        placeholder='Enter your password'
                        className="border border-amber-600 rounded w-full py-2 px-4 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    {errors.password && <span className="text-red-500">{errors.password.message}</span>}

                    {/* Avatar Image */}
                    <div className="p-2">
                        <h2 className="text-lg font-bold text-amber-600 mb-1">Avatar Image</h2>
                        <div className="border border-amber-600 rounded p-4 flex flex-col gap-2">
                            <input
                                type="file"
                                {...register('avatar',
                                     {required: 'Avatar Image is required'}
    )}
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="border border-amber-600 rounded py-2 px-3 text-amber-600 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                            {avatarPreview && (
                                <div className="mt-2">
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        className="rounded-full w-24 h-24 object-cover"
                                    />
                                </div>
                            )}
                            {errors.avatar && <span className="text-red-500">{errors.avatar.message}</span>}
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="p-2">
                        <h2 className="text-lg font-bold text-amber-600 mb-1">Cover Image</h2>
                        <div className="border border-amber-600 rounded p-4 flex flex-col gap-2">
                            <input
                                type="file"
                                {...register('coverImage')}
                                accept="image/*"
                                onChange={handleCoverChange}
                                className="border border-amber-600 rounded py-2 px-3 text-amber-600 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                            {coverPreview && (
                                <div className="mt-2">
                                    <img
                                        src={coverPreview}
                                        alt="Cover Preview"
                                        className="rounded-lg w-full h-32 object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Register Button and Login Link */}
                    <div className="flex justify-between items-center mt-2 gap-2 pb-4 ">
                        <span className="text-sm text-amber-500">
                            Already Registered? <Link className="underline hover:text-amber-600" to="/login">Click here</Link>
                        </span>
                        <Button first={"JOIN"}  second={"THE VIBE"}/>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
