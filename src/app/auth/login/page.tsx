"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { API_ENDPOINTS, ROLE_ROUTES, STORAGE_KEYS } from "@/lib/api";
import { APP_NAME, MESSAGES, PLACEHOLDERS, ALT_TEXTS, ROUTES } from "@/lib/constants";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);

  useEffect(() => {
    // Check if user came from email verification
    const verified = searchParams.get("verified");
    if (verified === "true") {
      setShowVerificationSuccess(true);
      // Hide the success message after 5 seconds
      setTimeout(() => setShowVerificationSuccess(false), 5000);
    }
  }, [searchParams]);

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || MESSAGES.ERRORS.LOGIN_FAILED);
      }

      const data: LoginResponse = await response.json();

      // Store auth data
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, data.role);
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, data.email);
      localStorage.setItem(STORAGE_KEYS.USER_ID, data.userId);

      // Route based on role from backend
      const route = ROLE_ROUTES[data.role.toUpperCase()];
      if (route) {
        router.push(route);
      } else {
        throw new Error(MESSAGES.ERRORS.INVALID_ROLE);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : MESSAGES.ERRORS.LOGIN_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[30%] bg-blue-600 flex-col justify-between p-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt={ALT_TEXTS.LOGO}
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <span className="text-white text-xl font-semibold">{APP_NAME}</span>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            {MESSAGES.LOGIN.WELCOME_TITLE}
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            {MESSAGES.LOGIN.WELCOME_SUBTITLE}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <Image
            src="/patients/boxImage.png"
            alt={ALT_TEXTS.FIRST_AID_KIT}
            width={100}
            height={100}
            className="object-contain"
          />
          <Image
            src="/patients/doctorImage.png"
            alt={ALT_TEXTS.DOCTOR}
            width={180}
            height={180}
            className="object-contain"
          />
          <Image
            src="/patients/doctorTool.png"
            alt={ALT_TEXTS.STETHOSCOPE}
            width={90}
            height={90}
            className="object-contain"
          />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 lg:w-[70%] bg-white p-6 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-3 h-3 bg-gray-300 rounded-full border-2 border-gray-300"></div>
            <div className="w-16 h-0.5 bg-blue-600"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-blue-600 relative">
              <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {MESSAGES.LOGIN.TITLE}
            </h2>
            <p className="text-gray-600 mt-2">{MESSAGES.LOGIN.SUBTITLE}</p>
          </div>

          {showVerificationSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-green-800 font-medium">Email verified successfully!</p>
                <p className="text-green-700 text-sm">You can now log in to your account.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder={PLACEHOLDERS.EMAIL}
                className="mt-1 w-full"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder={PLACEHOLDERS.PASSWORD}
                  className="w-full pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isLoading}
                />
                <Label htmlFor="rememberMe" className="text-sm font-medium text-gray-700">
                  {MESSAGES.LOGIN.REMEMBER_ME}
                </Label>
              </div>
              <a
                href={ROUTES.FORGOT_PASSWORD}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {MESSAGES.LOGIN.FORGOT_PASSWORD}
              </a>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? MESSAGES.LOGIN.LOADING_TEXT : MESSAGES.LOGIN.BUTTON_TEXT}
              {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              {MESSAGES.LOGIN.NO_ACCOUNT}{" "}
              <a
                href={ROUTES.PATIENT_REGISTER}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {MESSAGES.LOGIN.SIGNUP_LINK}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UnifiedLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
