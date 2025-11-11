"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Lock, Bell, Briefcase } from "lucide-react";

export default function DoctorSettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@hospital.com",
    phone: "+250 788 987 654",
    specialization: "Cardiology",
    licenseNumber: "MD-12345",
    department: "Cardiology Department",
    yearsOfExperience: "10",
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your professional profile and preferences</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="professional" className="gap-2">
            <Briefcase className="h-4 w-4" />
            Professional
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <div className="flex items-center gap-6 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">SJ</AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">Change Photo</Button>
                <p className="text-sm text-gray-500 mt-2">JPG, PNG. Max 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={profile.firstName} onChange={(e) => setProfile({...profile, firstName: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={profile.lastName} onChange={(e) => setProfile({...profile, lastName: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="professional">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input id="specialization" value={profile.specialization} onChange={(e) => setProfile({...profile, specialization: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input id="licenseNumber" value={profile.licenseNumber} onChange={(e) => setProfile({...profile, licenseNumber: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" value={profile.department} onChange={(e) => setProfile({...profile, department: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" value={profile.yearsOfExperience} onChange={(e) => setProfile({...profile, yearsOfExperience: e.target.value})} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Update Password</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Patient Assignments</p>
                  <p className="text-sm text-gray-500">Get notified when new patients are assigned</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Appointment Reminders</p>
                  <p className="text-sm text-gray-500">Reminders for upcoming consultations</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Emergency Alerts</p>
                  <p className="text-sm text-gray-500">Critical patient alerts</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Updates</p>
                  <p className="text-sm text-gray-500">Updates about system changes</p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      </motion.div>
    </div>
  );
}
