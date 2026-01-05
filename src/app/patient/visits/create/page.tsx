"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/doctor/Navbar";
import PatientSidebar from "@/components/patient/PatientSidebar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar as CalendarIcon,
  Clipboard,
  FileText,
  Clock,
  AlertTriangle,
  Heart,
  Brain,
  Eye,
  Bone,
  Baby,
  Stethoscope,
  Zap,
  Microscope,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createAppointment, getDepartments } from "@/lib/patientApi";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function CreateVisitPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    department: "",
    reason: "",
    preferredDate: "",
  });
  const [isMobile, setIsMobile] = useState(false);
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableDepartments, setAvailableDepartments] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const depts = await getDepartments();
        setAvailableDepartments(depts);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDepartmentSelect = (deptId: string) => {
    setSelectedDepartment(deptId);
    handleInputChange("department", deptId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.department) {
      toast({
        title: "Error",
        description: "Please select a department",
        variant: "destructive",
      });
      return;
    }

    if (!formData.reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for your visit",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Error",
        description: "Please select a preferred date",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedDept = departments.find(d => d.id === formData.department);
      const departmentName = selectedDept?.name || formData.department;
      const formattedDate = format(date, 'yyyy-MM-dd');
      const sanitizedReason = formData.reason
        .replace(/'/g, "'")
        .replace(/"/g, '"')
        .replace(/[^\w\s.,!?-]/g, '');

      await createAppointment({
        departmentName: departmentName,
        reason: sanitizedReason,
        preferredDate: formattedDate,
      });

      toast({
        title: "Success",
        description: "Your appointment has been created successfully!",
      });

      setTimeout(() => {
        router.push('/patient/visits');
      }, 1500);
    } catch (error: any) {
      console.error('Error creating appointment:', error);

      let errorMessage = "Failed to create appointment. Please try again.";

      if (error.message) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.fieldErrors && errorData.fieldErrors.length > 0) {
            const fieldError = errorData.fieldErrors[0];
            errorMessage = `${fieldError.field}: ${fieldError.message}`;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDepartmentIcon = (deptName: string) => {
    const name = deptName.toLowerCase();
    if (name.includes('cardiology') || name.includes('heart')) return Heart;
    if (name.includes('neurology') || name.includes('brain')) return Brain;
    if (name.includes('ophthalmology') || name.includes('eye')) return Eye;
    if (name.includes('orthopedics') || name.includes('bone')) return Bone;
    if (name.includes('pediatrics') || name.includes('child')) return Baby;
    if (name.includes('psychiatry') || name.includes('mental')) return Zap;
    if (name.includes('dermatology') || name.includes('skin')) return Microscope;
    return Stethoscope;
  };

  const departments = availableDepartments.length > 0
    ? availableDepartments.map((dept: any) => ({
      id: dept.id || dept.name,
      name: dept.name,
      description: dept.description || "Healthcare services",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      textColor: "text-blue-700",
    }))
    : [
      {
        id: "general",
        name: "General Medicine",
        description: "General health consultations and check-ups",
        color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
        textColor: "text-blue-700",
      },
      {
        id: "cardiology",
        name: "Cardiology",
        description: "Heart and cardiovascular health",
        color: "bg-red-50 border-red-200 hover:bg-red-100",
        textColor: "text-red-700",
      },
      {
        id: "dermatology",
        name: "Dermatology",
        description: "Skin conditions and treatments",
        color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
        textColor: "text-orange-700",
      },
      {
        id: "orthopedics",
        name: "Orthopedics",
        description: "Bone and joint health",
        color: "bg-green-50 border-green-200 hover:bg-green-100",
        textColor: "text-green-700",
      },
      {
        id: "pediatrics",
        name: "Pediatrics",
        description: "Child healthcare services",
        color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
        textColor: "text-pink-700",
      },
      {
        id: "neurology",
        name: "Neurology",
        description: "Nervous system disorders",
        color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
        textColor: "text-purple-700",
      },
      {
        id: "psychiatry",
        name: "Psychiatry",
        description: "Mental health services",
        color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
        textColor: "text-indigo-700",
      },
      {
        id: "ophthalmology",
        name: "Ophthalmology",
        description: "Eye care and vision services",
        color: "bg-teal-50 border-teal-200 hover:bg-teal-100",
        textColor: "text-teal-700",
      },
    ];

  const experienceTips = [
    {
      icon: Clipboard,
      text: "Prepare a list of questions for your doctor",
      color: "text-blue-600",
    },
    {
      icon: FileText,
      text: "Bring any relevant medical records or test results",
      color: "text-green-600",
    },
    {
      icon: Clock,
      text: "Arrive 15 minutes early for your appointment",
      color: "text-orange-600",
    },
    {
      icon: AlertTriangle,
      text: "Inform staff about allergies or current medications",
      color: "text-red-600",
    },
  ];

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <Navbar />
        <PatientSidebar isCollapsed={false} />
        <div className="pt-16 px-4 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Book Appointment
            </h1>
            <p className="text-gray-600 text-sm mt-1">Schedule your visit with our healthcare professionals</p>
          </motion.div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-lg p-4"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Choose Department
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {departments.map((dept, index) => {
                  const Icon = getDepartmentIcon(dept.name);
                  const isSelected = selectedDepartment === dept.id;
                  return (
                    <motion.button
                      key={dept.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => handleDepartmentSelect(dept.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${isSelected
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : `${dept.color} border-transparent hover:shadow-md`
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-500" : "bg-white"}`}>
                          <Icon className={`h-4 w-4 ${isSelected ? "text-white" : dept.textColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium text-sm ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                            {dept.name}
                          </h3>
                          <p className={`text-xs mt-1 ${isSelected ? "text-blue-700" : "text-gray-600"}`}>
                            {dept.description}
                          </p>
                        </div>
                        {isSelected && <CheckCircle className="h-5 w-5 text-blue-500" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-lg p-4"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Visit Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-sm font-semibold text-gray-700">
                    Reason for visit
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe your symptoms, concerns, or reason for the visit..."
                    value={formData.reason}
                    onChange={(e) => handleInputChange("reason", e.target.value)}
                    className="min-h-[80px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredDate" className="text-sm font-semibold text-gray-700">
                    Preferred Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-gray-200 hover:border-blue-500",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Select a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Appointment...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Book Appointment</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-lg p-4"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Preparation Tips
              </h2>
              <div className="space-y-3">
                {experienceTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gray-50">
                      <tip.icon className={`h-4 w-4 ${tip.color}`} />
                    </div>
                    <p className="text-sm text-gray-700 flex-1">{tip.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <Navbar />
      <div className="flex">
        <div className="w-64 flex-shrink-0">
          <PatientSidebar isCollapsed={false} />
        </div>
        <div className="flex-1 pt-20 p-4 min-h-screen overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Book Appointment
            </h1>
            <p className="text-gray-600 mt-1">Schedule your visit with our healthcare professionals</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Choose Your Department
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {departments.map((dept, index) => {
                    const Icon = getDepartmentIcon(dept.name);
                    const isSelected = selectedDepartment === dept.id;
                    return (
                      <motion.button
                        key={dept.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDepartmentSelect(dept.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${isSelected
                          ? "border-blue-500 bg-blue-50 shadow-lg"
                          : `${dept.color} border-transparent hover:shadow-md`
                          }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${isSelected ? "bg-blue-500" : "bg-white shadow-sm"}`}>
                            <Icon className={`h-6 w-6 ${isSelected ? "text-white" : dept.textColor}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-semibold ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                              {dept.name}
                            </h3>
                            <p className={`text-sm mt-1 ${isSelected ? "text-blue-700" : "text-gray-600"}`}>
                              {dept.description}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle className="h-6 w-6 text-blue-500 flex-shrink-0" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Appointment Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-sm font-semibold text-gray-700">
                      Reason for visit
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder="Please describe your symptoms, concerns, or reason for the visit in detail..."
                      value={formData.reason}
                      onChange={(e) => handleInputChange("reason", e.target.value)}
                      className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">
                      Provide as much detail as possible to help our medical team prepare for your visit.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredDate" className="text-sm font-semibold text-gray-700">
                      Preferred Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-gray-200 hover:border-blue-500",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Select your preferred date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Appointment...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Book Appointment</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Preparation Tips
                </h2>
                <div className="space-y-4">
                  {experienceTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="p-2 rounded-lg bg-gray-50">
                        <tip.icon className={`h-5 w-5 ${tip.color}`} />
                      </div>
                      <p className="text-sm text-gray-700 flex-1">{tip.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}