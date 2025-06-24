'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleGoogleAuth = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="p-8 bg-white/10 rounded-2xl max-w-md w-full text-white backdrop-blur">
      <h1 className="text-3xl font-bold text-center mb-6">
        {isSignUp ? "Sign Up" : "Sign In"} to ARISE
      </h1>

      <Button
  onClick={handleGoogleAuth}
  className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 mb-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:text-black transition-colors"
>
  <svg
    className="w-5 h-5"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="#EA4335" d="M24 9.5c3.15 0 5.75 1.1 7.66 2.89l5.7-5.7C33.39 3.21 28.98 1.5 24 1.5 14.84 1.5 7.19 7.84 4.68 16.26l6.95 5.4C13.29 14.75 18.19 9.5 24 9.5z"/>
    <path fill="#34A853" d="M43.63 20.26H24v7.5h11.4c-1.34 3.58-4.39 6.44-8.4 7.5l6.95 5.4C40.81 36.16 44 30.07 44 24c0-.97-.1-1.92-.27-2.84l-.1-.9z"/>
    <path fill="#FBBC05" d="M10.38 28.84C9.42 26.65 9 24.38 9 22c0-2.38.42-4.65 1.38-6.84L3.43 9.76C1.26 13.1 0 17.42 0 22s1.26 8.9 3.43 12.24l6.95-5.4z"/>
    <path fill="#4285F4" d="M24 44.5c6.56 0 12.08-2.16 16.1-5.86l-6.95-5.4c-2.13 1.43-4.86 2.26-8.15 2.26-5.81 0-10.71-5.25-12.37-12.16l-6.95 5.4C7.19 40.16 14.84 44.5 24 44.5z"/>
  </svg>
  <span className="text-black">
    {isSignUp ? "Sign up" : "Sign in"} with Google
  </span>
</Button>


      <div className="flex items-center my-4">
        <div className="flex-grow h-px bg-gray-600" />
        <span className="px-4 text-gray-400">or</span>
        <div className="flex-grow h-px bg-gray-600" />
      </div>

      {isSignUp && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input placeholder="First name" />
          <Input placeholder="Last name" />
        </div>
      )}

      <Input type="email" placeholder="Email address" className="mb-4" />
      <Input type="password" placeholder="Password" className="mb-6" />

      <Button className="w-full bg-[#5C5FFF] hover:bg-[#4B4FFF]">
        CONTINUE
      </Button>

      <p className="text-center text-sm mt-6 text-gray-400">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-[#5C5FFF] hover:underline ml-1"
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}
