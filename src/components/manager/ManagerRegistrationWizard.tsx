"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ArrowLeft, ArrowRight, User, Mail, Phone, Lock, Building, Calendar } from "lucide-react";
import { 
  registerManager, 
  checkEmailAvailability, 
  validateRegistrationData,
  type ManagerRegistrationData 
} from "@/lib/managerRegistrationApi";

interface StepProps {
  formData: ManagerRegistrationData;
  updateFormData: (field: keyof ManagerRegistrationData, value: string) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  loading?: boolean;
}

// Step 1: Personal Information
const PersonalInfoStep = ({ formData, updateFormData, errors, onNext, isFirstStep }: StepProps) => {
  const canProceed = formData.firstName && formData.lastName && formData.gender && formData.dateOfBirth;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Let's start with your basic information</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateFormData("firstName", e.target.value)}
            placeholder="John"
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateFormData("lastName", e.target.value)}
            placeholder="Doe"
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
          className={errors.dateOfBirth ? "border-red-500" : ""}
        />
        {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
      </div>

      <div>
        <Label htmlFor="gender">Gender *</Label>
        <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
          <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender}</p>}
      </div>

      <Button 
        onClick={onNext} 
        className="w-full" 
        disabled={!canProceed}
      >
        Next <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

// Step 2: Contact Information
const ContactInfoStep = ({ formData, updateFormData, errors, onNext, onPrev }: StepProps) => {
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleEmailCheck = async () => {
    if (!formData.email) return;
    
    setEmailChecking(true);
    try {
      const result = await checkEmailAvailability(formData.email);
      setEmailAvailable(result.available);
      
      // Show different toast messages based on the result
      if (result.message.includes('unavailable') || result.message.includes('Network error')) {
        toast({
          title: "Email Check Unavailable",
          description: result.message,
          variant: "default",
        });
      } else {
        toast({
          title: result.available ? "Email Available" : "Email Taken",
          description: result.message,
          variant: result.available ? "default" : "destructive",
        });
      }
    } catch (error) {
      console.error('Email check failed:', error);
      // Set as available and let backend handle validation
      setEmailAvailable(true);
      toast({
        title: "Email Check Failed",
        description: "Unable to verify email availability. Registration will proceed with backend validation.",
        variant: "default",
      });
    } finally {
      setEmailChecking(false);
    }
  };

  const canProceed = formData.email && formData.phoneNumber && formData.countryOfResidence && emailAvailable !== false;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600">How can we reach you?</p>
      </div>
      
      <div>
        <Label htmlFor="email">Email Address *</Label>
        <div className="flex gap-2">
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              updateFormData("email", e.target.value);
              setEmailAvailable(null);
            }}
            placeholder="john.doe@hospital.com"
            className={errors.email || emailAvailable === false ? "border-red-500" : emailAvailable === true ? "border-blue-500" : ""}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEmailCheck}
            disabled={!formData.email || emailChecking}
          >
            {emailChecking ? "..." : "Check"}
          </Button>
          {emailAvailable === null && formData.email && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEmailAvailable(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip
            </Button>
          )}
        </div>
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        {emailAvailable === true && (
          <p className="text-sm text-blue-600 mt-1 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" /> Email is available
          </p>
        )}
        {emailAvailable === false && (
          <p className="text-sm text-red-600 mt-1">Email is already registered</p>
        )}
        {emailAvailable === null && formData.email && (
          <p className="text-sm text-gray-500 mt-1">Click "Check" to verify email availability or "Skip" to proceed</p>
        )}
      </div>

      <div>
        <Label htmlFor="phoneNumber">Phone Number *</Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => updateFormData("phoneNumber", e.target.value)}
          placeholder="+250788123456"
          className={errors.phoneNumber ? "border-red-500" : ""}
        />
        {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>}
      </div>

      <div>
        <Label htmlFor="countryOfResidence">Country of Residence *</Label>
        <Input
          id="countryOfResidence"
          value={formData.countryOfResidence}
          onChange={(e) => updateFormData("countryOfResidence", e.target.value)}
          placeholder="Rwanda"
          className={errors.countryOfResidence ? "border-red-500" : ""}
        />
        {errors.countryOfResidence && <p className="text-sm text-red-500 mt-1">{errors.countryOfResidence}</p>}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrev} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={onNext} className="flex-1" disabled={!canProceed}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Step 3: Identification
const IdentificationStep = ({ formData, updateFormData, errors, onNext, onPrev }: StepProps) => {
  const canProceed = formData.nationalId;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
          <Calendar className="h-6 w-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Identification</h2>
        <p className="text-gray-600">We need to verify your identity</p>
      </div>
      
      <div>
        <Label htmlFor="nationalId">National ID *</Label>
        <Input
          id="nationalId"
          value={formData.nationalId}
          onChange={(e) => updateFormData("nationalId", e.target.value)}
          placeholder="1234567890123456"
          className={errors.nationalId ? "border-red-500" : ""}
        />
        {errors.nationalId && <p className="text-sm text-red-500 mt-1">{errors.nationalId}</p>}
        <p className="text-sm text-gray-500 mt-1">Enter your national identification number</p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrev} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={onNext} className="flex-1" disabled={!canProceed}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Step 4: Hospital Information
const HospitalInfoStep = ({ formData, updateFormData, errors, onNext, onPrev }: StepProps) => {
  const canProceed = formData.hospitalName;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
          <Building className="h-6 w-6 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hospital Information</h2>
        <p className="text-gray-600">Which hospital will you manage?</p>
      </div>
      
      <div>
        <Label htmlFor="hospitalName">Hospital Name *</Label>
        <Input
          id="hospitalName"
          value={formData.hospitalName}
          onChange={(e) => updateFormData("hospitalName", e.target.value)}
          placeholder="Central Hospital"
          className={errors.hospitalName ? "border-red-500" : ""}
        />
        {errors.hospitalName && <p className="text-sm text-red-500 mt-1">{errors.hospitalName}</p>}
        <p className="text-sm text-gray-500 mt-1">Enter the name of the hospital you will oversee</p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrev} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={onNext} className="flex-1" disabled={!canProceed}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Step 5: Security
const SecurityStep = ({ formData, updateFormData, errors, onNext, onPrev, loading }: StepProps) => {
  const passwordsMatch = formData.password === formData.confirmPassword;
  const canProceed = formData.password && formData.confirmPassword && passwordsMatch && formData.password.length >= 8;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
          <Lock className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Security</h2>
        <p className="text-gray-600">Create a secure password for your account</p>
      </div>
      
      <div>
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => updateFormData("password", e.target.value)}
          placeholder="Enter password (min 8 characters)"
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
        <p className="text-sm text-gray-500 mt-1">Minimum 8 characters required</p>
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => updateFormData("confirmPassword", e.target.value)}
          placeholder="Confirm password"
          className={errors.confirmPassword || (!passwordsMatch && formData.confirmPassword) ? "border-red-500" : passwordsMatch && formData.confirmPassword ? "border-blue-500" : ""}
        />
        {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
        {!passwordsMatch && formData.password && formData.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
        )}
        {passwordsMatch && formData.confirmPassword && (
          <p className="text-sm text-blue-600 mt-1 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" /> Passwords match
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrev} className="flex-1" disabled={loading}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={onNext} className="flex-1 bg-primary hover:bg-primary/90" disabled={!canProceed || loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </div>
  );
};

// Main Wizard Component
export default function ManagerRegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState<ManagerRegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    countryOfResidence: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    nationalId: "",
    dateOfBirth: "",
    gender: "MALE",
    hospitalName: "",
  });

  const steps = [
    { title: "Personal Info", component: PersonalInfoStep },
    { title: "Contact", component: ContactInfoStep },
    { title: "Identification", component: IdentificationStep },
    { title: "Hospital", component: HospitalInfoStep },
    { title: "Security", component: SecurityStep },
  ];

  const updateFormData = (field: keyof ManagerRegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 0: // Personal Info
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        break;
      case 1: // Contact
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
        if (!formData.countryOfResidence) newErrors.countryOfResidence = "Country is required";
        break;
      case 2: // Identification
        if (!formData.nationalId) newErrors.nationalId = "National ID is required";
        break;
      case 3: // Hospital
        if (!formData.hospitalName) newErrors.hospitalName = "Hospital name is required";
        break;
      case 4: // Security
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.confirmPassword) newErrors.confirmPassword = "Password confirmation is required";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep === steps.length - 1) {
      // Final step - submit registration
      setLoading(true);
      try {
        const validationErrors = validateRegistrationData(formData);
        if (validationErrors.length > 0) {
          toast({
            title: "Validation Error",
            description: validationErrors[0],
            variant: "destructive",
          });
          return;
        }

        const result = await registerManager(formData);
        
        if (result.success) {
          toast({
            title: "Registration Successful! 🎉",
            description: `Welcome ${result.firstName} ${result.lastName}! Your manager account has been created. Redirecting to login...`,
          });
          
          // Navigate to login page after a short delay
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
        } else {
          toast({
            title: "Registration Failed",
            description: result.message || "An error occurred during registration",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Blue Background (30% width, hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[30%] bg-gradient-to-br from-blue-600 to-blue-700 flex-col justify-between p-8">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-white text-xl font-semibold">HealthLink</span>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            Join HealthLink as a Manager
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed mb-6">
            Take control of healthcare operations and lead your hospital to excellence with our comprehensive management platform.
          </p>
          
          {/* Features List */}
          <div className="space-y-3 text-left">
            {[
              "Hospital Operations Management",
              "Staff Performance Analytics", 
              "Real-time Patient Queue Monitoring",
              "Financial Reporting & Insights"
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 text-blue-100">
                <CheckCircle className="h-5 w-5 text-blue-300 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Images */}
        <div className="flex items-end justify-between">
          <div className="relative">
            <div className="w-20 h-20 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="relative">
            <div className="w-32 h-32 bg-blue-500 rounded-lg flex items-center justify-center">
              <User className="w-16 h-16 text-white" />
            </div>
          </div>
          <div className="relative">
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - White Background (70% width, full width on mobile) */}
      <div className="flex-1 lg:w-[70%] bg-gray-50 p-6 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStep 
                      ? "bg-primary text-white" 
                      : index === currentStep 
                      ? "bg-primary text-white" 
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      index < currentStep ? "bg-primary" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Current Step Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <CurrentStepComponent
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              onNext={handleNext}
              onPrev={handlePrev}
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === steps.length - 1}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}