"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  registerManager, 
  checkEmailAvailability, 
  validateRegistrationData,
  type ManagerRegistrationData 
} from "@/lib/managerRegistrationApi";

export default function ManagerRegistrationForm() {
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

  const [loading, setLoading] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (field: keyof ManagerRegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset email availability when email changes
    if (field === 'email') {
      setEmailAvailable(null);
    }
  };

  const handleEmailCheck = async () => {
    if (!formData.email) return;
    
    setEmailChecking(true);
    try {
      const result = await checkEmailAvailability(formData.email);
      setEmailAvailable(result.available);
      
      toast({
        title: result.available ? "Email Available" : "Email Taken",
        description: result.message,
        variant: result.available ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check email availability",
        variant: "destructive",
      });
    } finally {
      setEmailChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validationErrors = validateRegistrationData(formData);
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors[0],
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await registerManager(formData);
      
      if (result.success) {
        toast({
          title: "Registration Successful! 🎉",
          description: `Manager ${result.firstName} ${result.lastName} has been registered successfully! Redirecting to login...`,
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
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manager Registration</h2>
        <p className="text-gray-600 mt-2">Register a new manager for the HealthLink system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter first name"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter last name"
              required
            />
          </div>
        </div>

        {/* Email with availability check */}
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
              className={emailAvailable === false ? "border-red-500" : emailAvailable === true ? "border-blue-500" : ""}
              required
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleEmailCheck}
              disabled={!formData.email || emailChecking}
            >
              {emailChecking ? "Checking..." : "Check"}
            </Button>
          </div>
          {emailAvailable === true && (
            <p className="text-sm text-blue-600 mt-1">✓ Email is available</p>
          )}
          {emailAvailable === false && (
            <p className="text-sm text-red-600 mt-1">✗ Email is already registered</p>
          )}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              placeholder="+250788123456"
              required
            />
          </div>
          <div>
            <Label htmlFor="countryOfResidence">Country of Residence *</Label>
            <Input
              id="countryOfResidence"
              value={formData.countryOfResidence}
              onChange={(e) => handleInputChange("countryOfResidence", e.target.value)}
              placeholder="Enter country"
              required
            />
          </div>
        </div>

        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nationalId">National ID *</Label>
            <Input
              id="nationalId"
              value={formData.nationalId}
              onChange={(e) => handleInputChange("nationalId", e.target.value)}
              placeholder="Enter national ID"
              required
            />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              required
            />
          </div>
        </div>

        {/* Gender and Hospital */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gender">Gender *</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value as "MALE" | "FEMALE" | "OTHER")}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="hospitalName">Hospital Name *</Label>
            <Input
              id="hospitalName"
              value={formData.hospitalName}
              onChange={(e) => handleInputChange("hospitalName", e.target.value)}
              placeholder="Enter hospital name"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Enter password (min 8 characters)"
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              placeholder="Confirm password"
              className={formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? "border-red-500" : ""}
              required
            />
            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={loading || emailAvailable === false}
        >
          {loading ? "Registering..." : "Register Manager"}
        </Button>
      </form>
    </div>
  );
}