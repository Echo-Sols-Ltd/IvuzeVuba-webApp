"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mail, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/constants";

export default function VerifyEmailPage() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get email from URL params
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Get stored signup data
      const storedSignupData = sessionStorage.getItem('pendingSignup');
      if (!storedSignupData) {
        throw new Error('Registration data not found. Please register again.');
      }

      const signupData = JSON.parse(storedSignupData);

      // Make API call to verify email and complete registration
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PATIENT_VERIFY_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          verificationCode,
          signupData
        })
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        // Clear stored signup data
        sessionStorage.removeItem('pendingSignup');
        
        if (data.accessToken) {
          // User is automatically logged in, store tokens and redirect to dashboard
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Redirect to patient dashboard
          router.push("/patient/dashboard?registered=true");
        } else if (data.requiresLogin) {
          // Verification successful but needs to login manually
          router.push("/patient/auth/login?verified=true");
        } else {
          // Default fallback to dashboard
          router.push("/patient/dashboard?registered=true");
        }
      } else {
        throw new Error(data.error || 'Invalid verification code');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError("");

    try {
      // Get stored signup data
      const storedSignupData = sessionStorage.getItem('pendingSignup');
      if (!storedSignupData) {
        throw new Error('Registration data not found. Please register again.');
      }

      const signupData = JSON.parse(storedSignupData);

      // Make API call to resend verification code
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PATIENT_SIGNUP}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });

      const data = await response.json();

      if (response.ok) {
        setCountdown(60); // 60 second cooldown
      } else {
        throw new Error(data.error || 'Failed to resend verification code');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Blue Background (30% width, hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[30%] bg-blue-600 flex-col justify-between p-8">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="HealthLink Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <span className="text-white text-xl font-semibold">HealthLink</span>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            Check your email
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            We&apos;ve sent a verification code to your email address to complete your registration.
          </p>
        </div>

        {/* Bottom Images */}
        <div className="flex items-end justify-between">
          {/* Left Image - First Aid Kit */}
          <div className="relative">
            <Image
              src="/patients/boxImage.png"
              alt="First Aid Kit"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>

          {/* Middle Image - Doctor (Bigger) */}
          <div className="relative">
            <Image
              src="/patients/doctorImage.png"
              alt="Doctor"
              width={180}
              height={180}
              className="object-contain"
            />
          </div>

          {/* Right Image - Stethoscope */}
          <div className="relative">
            <Image
              src="/patients/doctorTool.png"
              alt="Stethoscope"
              width={90}
              height={90}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Right Panel - White Background (70% width, full width on mobile) */}
      <div className="flex-1 lg:w-[70%] bg-white p-6 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-lg">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-blue-600"></div>
            <div className="w-16 h-0.5 bg-blue-600"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-blue-600"></div>
          </div>

          {/* Form Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600">
              We&apos;ve sent a 6-digit verification code to
            </p>
            <p className="text-blue-600 font-medium">{email}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Verification Form */}
          <form onSubmit={handleVerifyCode} className="space-y-6">
            {/* Verification Code */}
            <div>
              <Label
                htmlFor="verificationCode"
                className="text-sm font-medium text-gray-700"
              >
                Verification Code
              </Label>
              <Input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="mt-1 w-full text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 w-5 h-5 animate-spin" />
                  VERIFYING...
                </>
              ) : (
                <>
                  VERIFY EMAIL
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* Resend Code */}
          <div className="text-center mt-6">
            <p className="text-gray-600 mb-2">Didn&apos;t receive the code?</p>
            <Button
              type="button"
              variant="ghost"
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isResending ? (
                <>
                  <RefreshCw className="mr-2 w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                "Resend Code"
              )}
            </Button>
          </div>

          {/* Back to Registration */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Wrong email address?{" "}
              <a
                href="/patient/auth/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Go back to registration
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}