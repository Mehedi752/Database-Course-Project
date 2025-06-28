import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
// import authImg from '../assets/auth.jpg';
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Login = () => {
    const navigate = useNavigate();
    const { setUser, signInWithGoogle, signInUser, setLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const location = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const axiosPublic = useAxiosPublic();

    const onSubmit = async (data) => {
        const { email, password } = data;
        console.log(data);

        signInUser(email, password)
            .then((res) => {
                console.log(res);
                setUser(res.user);
                setLoading(false);
                toast.success('Login successful!');
                navigate(location.state ? location.state : '/');
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }



    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then((res) => {
                setUser(res.user);
                const user = {
                    name: res.user.displayName,
                    email: res.user.email,
                    photoURL: res.user.photoURL,
                    role: 'user',
                    timestamp: new Date().toISOString(),
                }

                // axiosPublic.post('/users', user)
                //     .then(res => {
                //         console.log('User added to database : ', res.data);
                //         toast.success(`Welcome ${user.name} to our website`);

                //     })
                //     .catch(err => {
                //         console.log('Error adding user to database : ', err);
                //     })

                navigate(location.state ? location.state : '/');
            })
            .catch((error) => {
                console.log(error);
            })
    };

    return (
        <div>
            <div className=" flex flex-col-reverse lg:flex-row items-center justify-between space-y-6 container mx-auto py-[50px] px-6">
                {/* <img src={authImg} alt="" className="lg:w-[500px] lg:h-[500px]" /> */}
                <div className="w-full p-12 space-y-4 bg-white rounded shadow-xl border border-gray-200 lg:mx-[350px]">
                    <h1 className="text-2xl font-bold text-center">Login</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-semibold">Email</label>
                            <input
                                type="email"
                                {...register('email', { required: true })}
                                className="input input-bordered w-full dark:bg-white dark:text-black"
                                placeholder="Enter your email"
                                required
                            />
                            {errors.email && <p className="text-red-600">Email is required</p>}
                        </div>
                        <div className="relative mb-4">
                            <label className="block mb-1 text-sm font-semibold">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register("password", {
                                    required: true, minLength: 6, maxLength: 20,
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,20}$/
                                })}
                                className="input input-bordered w-full dark:bg-white dark:text-black"
                                placeholder="Enter your password"
                                required
                            />

                            <div onClick={() => setShowPassword(!showPassword)} className='absolute right-4 bottom-4'>
                                {
                                    showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>
                                }
                            </div>

                            {errors.password?.type === 'required' && <p className="text-red-600">Password is required</p>}
                            {errors.password?.type === 'minLength' && <p className="text-red-600">Password must be at least 6 characters</p>}
                            {errors.password?.type === 'maxLength' && <p className="text-red-600">Password must be at most 20 characters</p>}
                            {errors.password?.type === 'pattern' && <p className="text-red-600">Password must contain at least one uppercase
                                letter, one lowercase letter, one number and one special character</p>}

                        </div>

                        <button type="submit" className="btn bg-[#1a237e] border-none hover:bg-blue-700 text-white w-full">
                            Login
                        </button>
                    </form>

                    <div className="divider">OR</div>
                    <button onClick={handleGoogleSignIn} className="btn bg-white hover:bg-[#1a237e] hover:text-white  w-full flex items-center"
                    >
                        <FcGoogle className="text-lg"></FcGoogle>
                        Sign in with Google
                    </button>
                    <p className="text-sm text-center">
                        Don't have an account?{" "}
                        <Link to="/auth/register" className="text-red-600">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;