"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
  role: "patient" | "doctor" | "manager" | "";
  rememberMe: boolean;
}

export default function UnifiedLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    role: "",
    rememberMe: false,
  });

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.role) {
      alert("Please select your role");
      return;
    }

    // TODO: Replace with actual API call to /api/auth/login
    console.log("Login submitted:", formData);

    // Mock authentication - route based on role
    const roleRoutes = {
      patient: "/patient/dashboard",
      doctor: "/doctor/overview",
      manager: "/manager",
    };

    if (formData.email && formData.password && formData.role) {
      router.push(roleRoutes[formData.role]);
    } else {
      alert("Invalid credentials");
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
              alt="HealthLink Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <span className="text-white text-xl font-semibold">HealthLink</span>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            Welcome to HealthLink Portal
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Access your personalized healthcare dashboard securely.
          </p>
        </div>

        <div className="flex items-end justify-between">
          <Image
            src="/patients/boxImage.png"
            alt="First Aid Kit"
            width={100}
            height={100}
            className="object-contain"
          />
          <Image
            src="/patients/doctorImage.png"
            alt="Doctor"
            width={180}
            height={180}
            className="object-contain"
          />
          <Image
            src="/patients/doctorTool.png"
            alt="Stethoscope"
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
              Login to Your Portal
            </h2>
            <p className="text-gray-600 mt-2">Select your role and sign in</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                I am a
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="example@hospital.com"
                className="mt-1 w-full"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="rememberMe" className="text-sm font-medium text-gray-700">
                  Remember me
                </Label>
              </div>
              <a
                href="/auth/forgot-password"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
            >
              LOGIN
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="/patient/auth/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign Up as Patient
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
