"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/doctor/Navbar";
import PatientSidebar from "@/components/patient/PatientSidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Lock } from "lucide-react";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PatientSettingsPage() {
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
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 flex">
        <div className="w-64 flex-shrink-0">
          <PatientSidebar />
        </div>
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Lock className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="p-6">
                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/man.png" />
                    <AvatarFallback className="text-2xl">
                      {profile.firstName?.[0]}{profile.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" disabled>Change Photo</Button>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG. Max 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={profile.firstName} 
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})} 
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={profile.lastName} 
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})} 
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profile.email} 
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={profile.phoneNumber} 
                      onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})} 
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input 
                      id="role" 
                      value={profile.role} 
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      value={profile.address} 
                      onChange={(e) => setProfile({...profile, address: e.target.value})} 
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="userId">User ID</Label>
                    <Input 
                      id="userId" 
                      value={profile.id ? profile.id.substring(0, 8) + "..." : ""} 
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
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
                      <Button onClick={handleSaveProfile} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleChangePassword} disabled={changingPassword}>
                    {changingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Button 
                        variant={twoFactorEnabled ? "destructive" : "default"}
                        onClick={handleToggle2FA}
                      >
                        {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                      </Button>
                      {twoFactorEnabled && (
                        <span className="text-sm text-green-600 font-medium">
                          ✓ 2FA is enabled
                        </span>
                      )}
                    </div>

                    {showSecret && twoFactorSecret && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
                        <p className="text-sm font-semibold text-blue-900 mb-2">
                          Your 2FA Secret Code:
                        </p>
                        <div className="bg-white p-3 rounded border border-blue-300 font-mono text-lg text-center mb-2">
                          {twoFactorSecret}
                        </div>
                        <p className="text-xs text-blue-700">
                          Save this code securely. You'll need it to verify your identity.
                        </p>
                      </div>
                    )}

                    {twoFactorEnabled && (
                      <div className="max-w-md">
                        <Label htmlFor="verificationCode">Test Verification Code</Label>
                        <div className="flex gap-2 mt-1">
                          <Input 
                            id="verificationCode"
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={6}
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
        </div>
      </div>
    </div>
  );
}
