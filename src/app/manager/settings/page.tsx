"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Lock, Bell, Settings } from "lucide-react";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ManagerSettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
    address: "",
    id: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.USER.PROFILE, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Profile data received:", data);
        setProfile({
          firstName: data.firstName || "",
          lastName: data.lastName === "string" ? "" : (data.lastName || ""),
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          role: data.role || "",
          address: data.address || "",
          id: data.id || "",
        });
        setTwoFactorEnabled(data.twoFactorEnabled || false);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch profile:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch(API_ENDPOINTS.USER.UPDATE_PROFILE, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phoneNumber: profile.phoneNumber,
          address: profile.address,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        // Refresh profile data to show updated values
        await fetchProfile();
        setIsEditing(false);
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password changed successfully",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to change password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      if (twoFactorEnabled) {
        // Disable 2FA
        const response = await fetch(API_ENDPOINTS.AUTH.DISABLE_2FA, {
          method: "POST",
          headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (response.ok) {
          setTwoFactorEnabled(false);
          setTwoFactorSecret("");
          setShowSecret(false);
          toast({
            title: "Success",
            description: "Two-factor authentication disabled",
          });
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to disable 2FA",
            variant: "destructive",
          });
        }
      } else {
        // Enable 2FA
        const response = await fetch(API_ENDPOINTS.AUTH.ENABLE_2FA, {
          method: "POST",
          headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (response.ok) {
          setTwoFactorEnabled(true);
          setTwoFactorSecret(data.secret);
          setShowSecret(true);
          toast({
            title: "Success",
            description: "Two-factor authentication enabled",
          });
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to enable 2FA",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle 2FA",
        variant: "destructive",
      });
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode) {
      toast({
        title: "Error",
        description: "Please enter verification code",
        variant: "destructive",
      });
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_2FA, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Code verified successfully",
        });
        setVerificationCode("");
      } else {
        toast({
          title: "Error",
          description: data.error || "Invalid verification code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify code",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-600 text-lg mt-2">Manage your account and system preferences</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg">
          <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
            <div className="flex items-center gap-6 mb-8">
              <Avatar className="h-24 w-24 ring-4 ring-purple-100">
                <AvatarImage src="/man.png" />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  {profile.firstName?.[0]}{profile.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm" disabled className="mb-2">Change Photo</Button>
                <p className="text-sm text-gray-500">JPG, PNG. Max 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name</Label>
                <Input 
                  id="firstName" 
                  value={profile.firstName} 
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})} 
                  disabled={!isEditing}
                  className={`mt-1 ${!isEditing ? "bg-gray-50/80" : "bg-white"} border-gray-200 focus:border-purple-500 focus:ring-purple-500`}
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={profile.lastName} 
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})} 
                  disabled={!isEditing}
                  className={`mt-1 ${!isEditing ? "bg-gray-50/80" : "bg-white"} border-gray-200 focus:border-purple-500 focus:ring-purple-500`}
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profile.email} 
                  disabled
                  className="mt-1 bg-gray-50/80 border-gray-200"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone</Label>
                <Input 
                  id="phone" 
                  value={profile.phoneNumber} 
                  onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})} 
                  disabled={!isEditing}
                  className={`mt-1 ${!isEditing ? "bg-gray-50/80" : "bg-white"} border-gray-200 focus:border-purple-500 focus:ring-purple-500`}
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-sm font-semibold text-gray-700">Role</Label>
                <Input 
                  id="role" 
                  value={profile.role} 
                  disabled
                  className="mt-1 bg-gray-50/80 border-gray-200"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-sm font-semibold text-gray-700">Address</Label>
                <Input 
                  id="address" 
                  value={profile.address} 
                  onChange={(e) => setProfile({...profile, address: e.target.value})} 
                  disabled={!isEditing}
                  className={`mt-1 ${!isEditing ? "bg-gray-50/80" : "bg-white"} border-gray-200 focus:border-purple-500 focus:ring-purple-500`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700">
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      fetchProfile();
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="currentPassword" className="text-sm font-semibold text-gray-700">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="mt-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="mt-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm New Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="mt-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <Button onClick={handleChangePassword} disabled={changingPassword} className="bg-purple-600 hover:bg-purple-700">
                {changingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600 mb-6">
                Add an extra layer of security to your account
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Button 
                    variant={twoFactorEnabled ? "destructive" : "default"}
                    onClick={handleToggle2FA}
                    className={!twoFactorEnabled ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                  </Button>
                  {twoFactorEnabled && (
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      2FA is enabled
                    </span>
                  )}
                </div>

                {showSecret && twoFactorSecret && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 max-w-md">
                    <p className="text-sm font-semibold text-purple-900 mb-3">
                      Your 2FA Secret Code:
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-purple-300 font-mono text-lg text-center mb-3">
                      {twoFactorSecret}
                    </div>
                    <p className="text-xs text-purple-700">
                      Save this code securely. You'll need it to verify your identity.
                    </p>
                  </div>
                )}

                {twoFactorEnabled && (
                  <div className="max-w-md">
                    <Label htmlFor="verificationCode" className="text-sm font-semibold text-gray-700">Test Verification Code</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        id="verificationCode"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                      <Button 
                        onClick={handleVerify2FA}
                        disabled={verifying}
                        variant="outline"
                      >
                        {verifying ? "Verifying..." : "Verify"}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your secret code to test verification
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      </motion.div>
    </div>
  );
}
