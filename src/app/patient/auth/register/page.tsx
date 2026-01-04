"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, X, User, MapPin, Shield, Check } from "lucide-react";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ROUTES, API_BASE_URL, API_ENDPOINTS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { slideInRight, slideInLeft, fadeIn } from "@/lib/animations";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
}

type Stage = 1 | 2 | 3;

export default function PatientRegistrationPage() {
  const [currentStage, setCurrentStage] = useState<Stage>(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    nationalId: "",
    dateOfBirth: "",
    gender: "",
  });
  const [showAlert, setShowAlert] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const router = useRouter();

  const stages = [
    { number: 1, title: "Personal Info", icon: User, description: "Tell us about yourself" },
    { number: 2, title: "Contact Details", icon: MapPin, description: "Where can we reach you?" },
    { number: 3, title: "Security", icon: Shield, description: "Secure your account" },
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStage = (stage: Stage): boolean => {
    const newErrors: Partial<FormData> = {};

    switch (stage) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        if (!formData.nationalId.trim()) newErrors.nationalId = "National ID is required";
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        if (!formData.gender) newErrors.gender = "Please select your gender";
        break;
      case 2:
        if (!formData.country) newErrors.country = "Please select your country";
        if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
        break;
      case 3:
        if (!formData.password) {
          newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStage(currentStage)) {
      setCurrentStage((prev) => Math.min(prev + 1, 3) as Stage);
    }
  };

  const handlePrevious = () => {
    setCurrentStage((prev) => Math.max(prev - 1, 1) as Stage);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStage < 3) {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'Escape' && currentStage > 1) {
      e.preventDefault();
      handlePrevious();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStage(3)) return;

    setIsLoading(true);

    try {
      // Store signup data in sessionStorage for verification step
      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        countryOfResidence: formData.country,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        nationalId: formData.nationalId,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
      };

      sessionStorage.setItem('pendingSignup', JSON.stringify(signupData));

      // Make API call to register patient
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PATIENT_SIGNUP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok && data.requiresVerification) {
        // Redirect to email verification page with email parameter
        router.push(`${ROUTES.PATIENT_VERIFY_EMAIL}?email=${encodeURIComponent(formData.email)}`);
      } else {
        throw new Error(data.error || data.message || 'Registration failed');
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert(`Registration failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStageContent = () => {
    const stageContent = {
      1: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <motion.div 
              className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <User className="w-8 h-8 text-blue-600" />
            </motion.div>
            <motion.h2 
              className="text-2xl font-bold text-gray-900 mb-2"
              {...fadeIn}
              transition={{ delay: 0.3 }}
            >
              Personal Information
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              {...fadeIn}
              transition={{ delay: 0.4 }}
            >
              Let's start with the basics
            </motion.p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter your first name"
                className={`mt-1 transition-all duration-200 ${errors.firstName ? 'border-red-500 ring-red-100' : 'focus:ring-blue-100'}`}
              />
              {errors.firstName && (
                <motion.p 
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.firstName}
                </motion.p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter your last name"
                className={`mt-1 transition-all duration-200 ${errors.lastName ? 'border-red-500 ring-red-100' : 'focus:ring-blue-100'}`}
              />
              {errors.lastName && (
                <motion.p 
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.lastName}
                </motion.p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email address"
              className={`mt-1 transition-all duration-200 ${errors.email ? 'border-red-500 ring-red-100' : 'focus:ring-blue-100'}`}
            />
            {errors.email && (
              <motion.p 
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div>
              <Label htmlFor="nationalId" className="text-sm font-medium text-gray-700">
                National ID *
              </Label>
              <Input
                id="nationalId"
                value={formData.nationalId}
                onChange={(e) => handleInputChange("nationalId", e.target.value)}
                placeholder="Enter your national ID"
                className={`mt-1 transition-all duration-200 ${errors.nationalId ? 'border-red-500 ring-red-100' : 'focus:ring-blue-100'}`}
              />
              {errors.nationalId && (
                <motion.p 
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.nationalId}
                </motion.p>
              )}
            </div>

            <div>
              <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                Date of Birth *
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className={`mt-1 transition-all duration-200 ${errors.dateOfBirth ? 'border-red-500 ring-red-100' : 'focus:ring-blue-100'}`}
              />
              {errors.dateOfBirth && (
                <motion.p 
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.dateOfBirth}
                </motion.p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
              Gender *
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleInputChange("gender", value)}
            >
              <SelectTrigger className={`mt-1 transition-all duration-200 ${errors.gender ? 'border-red-500 ring-red-100' : 'focus:ring-blue-100'}`}>
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <motion.p 
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.gender}
              </motion.p>
            )}
          </motion.div>
        </div>
      ),
      2: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <motion.div 
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <MapPin className="w-8 h-8 text-green-600" />
            </motion.div>
            <motion.h2 
              className="text-2xl font-bold text-gray-900 mb-2"
              {...fadeIn}
              transition={{ delay: 0.3 }}
            >
              Contact Details
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              {...fadeIn}
              transition={{ delay: 0.4 }}
            >
              How can we reach you?
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Label htmlFor="country" className="text-sm font-medium text-gray-700">
              Country of Residence *
            </Label>
            <Select
              value={formData.country}
              onValueChange={(value) => handleInputChange("country", value)}
            >
              <SelectTrigger className={`mt-1 transition-all duration-200 ${errors.country ? 'border-red-500 ring-red-100' : 'focus:ring-blue-100'}`}>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rwanda">🇷🇼 Rwanda</SelectItem>
                <SelectItem value="kenya">🇰🇪 Kenya</SelectItem>
                <SelectItem value="uganda">🇺🇬 Uganda</SelectItem>
                <SelectItem value="tanzania">🇹🇿 Tanzania</SelectItem>
                <SelectItem value="burundi">🇧🇮 Burundi</SelectItem>
                <SelectItem value="drc">🇨🇩 Democratic Republic of Congo</SelectItem>
              </SelectContent>
            </Select>
            {errors.country && (
              <motion.p 
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.country}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
              Phone Number *
            </Label>
            <div className={`mt-1 transition-all duration-200 ${errors.phoneNumber ? 'border-red-500 rounded-md' : ''}`}>
              <PhoneInput
                international
                defaultCountry="RW"
                value={formData.phoneNumber}
                onChange={(value) => handleInputChange("phoneNumber", value || "")}
                placeholder="Enter your phone number"
                className="w-full"
              />
            </div>
            {errors.phoneNumber && (
              <motion.p 
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.phoneNumber}
              </motion.p>
            )}
          </motion.div>
        </div>
      ),
      3: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <motion.div 
              className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Shield className="w-8 h-8 text-purple-600" />
            </motion.div>
            <motion.h2 
              className="text-2xl font-bold text-gray-900 mb-2"
              {...fadeIn}
              transition={{ delay: 0.3 }}
            >
              Secure Your Account
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              {...fadeIn}
              transition={{ delay: 0.4 }}
            >
              Create a strong password
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password *
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Create a strong password"
              className={`mt-1 transition-all duration-200 ${errors.password ? 'border-red-500 ring-red-100' : 'focus:ring-blue-100'}`}
            />
            {errors.password && (
              <motion.p 
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.password}
              </motion.p>
            )}
            <motion.p 
              className="text-gray-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Password must be at least 6 characters long
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password *
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              placeholder="Confirm your password"
              className={`mt-1 transition-all duration-200 ${errors.confirmPassword ? 'border-red-500 ring-red-100' : 'focus:ring-blue-100'}`}
            />
            {errors.confirmPassword && (
              <motion.p 
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </motion.div>
        </div>
      )
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {stageContent[currentStage]}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Blue Background (30% width, hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[30%] bg-gradient-to-br from-blue-600 to-blue-700 flex-col justify-between p-8">
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
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            Let&apos;s set up your account to take control of your health.
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Manage appointments, access records, and stay healthy – all in one
            secure place.
          </p>
        </div>

        {/* Bottom Images */}
        <div className="flex items-end justify-between">
          <div className="relative">
            <Image
              src="/patients/boxImage.png"
              alt="First Aid Kit"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          <div className="relative">
            <Image
              src="/patients/doctorImage.png"
              alt="Doctor"
              width={180}
              height={180}
              className="object-contain"
            />
          </div>
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
      <div className="flex-1 lg:w-[70%] bg-gray-50 p-6 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Progress Indicator */}
          <motion.div 
            className="flex items-center justify-center space-x-4 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {stages.map((stage, index) => (
              <div key={stage.number} className="flex items-center">
                <motion.div 
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    currentStage >= stage.number
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {currentStage > stage.number ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="icon"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <stage.icon className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                {index < stages.length - 1 && (
                  <motion.div 
                    className={`w-16 h-0.5 mx-2 transition-all duration-500 ${
                      currentStage > stage.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.1 }}
                  />
                )}
              </div>
            ))}
          </motion.div>

          {/* Stage Title */}
          <motion.div 
            className="text-center mb-6"
            key={`title-${currentStage}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Step {currentStage} of 3: {stages[currentStage - 1].title}
            </h3>
            <p className="text-gray-600 mt-1">{stages[currentStage - 1].description}</p>
            <p className="text-xs text-gray-400 mt-2">
              Press Enter to continue • Press Escape to go back
            </p>
          </motion.div>

          {/* Alert Message */}
          <AnimatePresence>
            {showAlert && (
              <motion.div 
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start justify-between"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-red-700">
                    <p className="font-medium">Patient Registration Only.</p>
                    <p className="text-red-600 mt-1">
                      This signup is for patients accessing healthcare services.
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowAlert(false)}
                  className="text-red-400 hover:text-red-600 ml-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Registration Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                  {/* Stage Content */}
                  <div className="min-h-[400px] flex flex-col justify-between">
                    <div className="flex-1">
                      {renderStageContent()}
                    </div>

                    {/* Navigation Buttons */}
                    <motion.div 
                      className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div>
                        <AnimatePresence>
                          {currentStage > 1 && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevious}
                                className="flex items-center space-x-2 hover:bg-gray-50 transition-colors"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Previous</span>
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        {currentStage < 3 ? (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="button"
                              onClick={handleNext}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 flex items-center space-x-2 transition-all duration-200"
                            >
                              <span>Next</span>
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                          >
                            <Button
                              type="submit"
                              disabled={isLoading}
                              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 flex items-center space-x-2 transition-all duration-200"
                            >
                              {isLoading ? (
                                <>
                                  <motion.div 
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  />
                                  <span>Creating Account...</span>
                                </>
                              ) : (
                                <>
                                  <span>Create Account</span>
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Login Link */}
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/patient/auth/login"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
              >
                Login
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
