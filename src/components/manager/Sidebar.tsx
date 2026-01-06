"use client";

import {
  Calendar,
  LayoutDashboard,
  Menu,
  Settings,
  LogOut,
  Users,
  X,
  Cross,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const links = [
    { label: "Overview", href: "/manager", icon: LayoutDashboard },
    { label: "Patient Queues", href: "/manager/patients", icon: Calendar },
    { label: "Staff", href: "/manager/staff", icon: Users },
    { label: "Pharmacy", href: "/manager/pharmacy", icon: Cross },
  ];

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutDialog(false);
      setOpen(false);
      router.push(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect even if logout fails
      router.push(ROUTES.LOGIN);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-16 left-4 z-50 p-3 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Menu className="h-5 w-5 text-gray-700" />
      </button>

      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-200/60 flex flex-col z-40 transform transition-all duration-300 backdrop-blur-sm shadow-lg
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 ${
          open
            ? "fixed inset-y-0 left-0 w-64 h-screen"
            : "fixed left-0 top-0 bottom-0 w-64 h-screen hidden md:flex"
        }`}
      >
        {/* Header */}
        <div className="pt-16 flex-shrink-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#118CDB] rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <h1 className="font-bold text-base text-gray-900">Manager Portal</h1>
            </div>
            <button 
              onClick={() => setOpen(false)} 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-3 px-3">
            {links.map((link, idx) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <div key={idx} className="mb-1">
                  <Link
                    href={link.href}
                    prefetch={true}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-[#118CDB] text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`} />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Spacer to push footer to bottom */}
        <div className="flex-1"></div>

        {/* Footer - Always at bottom */}
        <div className="border-t border-gray-200/60 p-3 space-y-2 flex-shrink-0 bg-white/80">
          <Link
            href="/manager/settings"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-all duration-200 group ${
              pathname === "/manager/settings"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-100/60 hover:text-gray-900"
            }`}
          >
            <Settings className="h-4 w-4 flex-shrink-0 text-gray-500 group-hover:text-gray-700" />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-all duration-200 w-full text-gray-600 hover:bg-red-50 hover:text-red-600 group"
          >
            <LogOut className="h-4 w-4 flex-shrink-0 text-gray-500 group-hover:text-red-500" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will be redirected to the
              home page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={cancelLogout} 
              className="flex-1"
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmLogout}
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Yes, Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;
