"use client";

import {
  Calendar,
  DollarSign,
  LayoutDashboard,
  Pill,
  Menu,
  Settings,
  LogOut,
  X,
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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

interface PatientSidebarProps {
  isCollapsed?: boolean;
}

const PatientSidebar = ({ isCollapsed = false }: PatientSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [visitDetailsOpen, setVisitDetailsOpen] = useState(false);

  const links = [
    { label: "Overview", href: "/patient/dashboard", icon: LayoutDashboard },
    {
      label: "Visit Details",
      href: "#",
      icon: Calendar,
      hasDropdown: true,
    },
    { label: "Prescriptions", href: "/patient/prescriptions", icon: Pill },
    { label: "Payments", href: "/patient/payments", icon: DollarSign },
  ];

  const subLinks = [
    { label: "Create visit", href: "/patient/visits/create" },
    { label: "View visits", href: "/patient/visits" },
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
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-16 left-4 z-50 p-3 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Menu className="h-5 w-5 text-gray-700" />
      </button>

      <div
        className={`bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-200/60 flex flex-col justify-between z-50 transform transition-all duration-300 backdrop-blur-sm
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 ${isCollapsed ? "w-16" : "w-64"
          } ${open
            ? "fixed inset-y-0 left-0 h-screen shadow-2xl"
            : "fixed left-0 top-0 bottom-0 hidden md:flex h-screen"
          }`}
      >
        <div className="">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/60">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <Image src="/logo.svg" alt="HealthLink Logo" width={32} height={32} />
                <div>
                  <h1 className="font-semibold text-black">HealthLink</h1>
                  <p className="text-[#6B6B6B] text-xs">
                    Your health care assistant
                  </p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="flex justify-center w-full">
                <Image src="/logo.svg" alt="HealthLink Logo" width={32} height={32} />
              </div>
            )}
            <button
              onClick={() => setOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          <nav className="mt-3 px-3">
            {links.map((link, idx) => {
              const isActive =
                pathname === link.href ||
                (link.href === "/patient/visits" &&
                  pathname.startsWith("/patient/visits"));
              const Icon = link.icon;

              return (
                <div key={idx} className="mb-1">
                  {link.hasDropdown ? (
                    <button
                      onClick={() => setVisitDetailsOpen(!visitDetailsOpen)}
                      className={`flex items-center gap-3 px-3 py-3 text-sm w-full rounded-xl transition-all duration-200 group ${isActive
                        ? "bg-[#118CDB] text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
                        } ${isCollapsed ? "justify-center" : ""}`}
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`} />
                      {!isCollapsed && (
                        <>
                          <span className="font-medium">{link.label}</span>
                          {visitDetailsOpen ? (
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform" />
                          ) : (
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform" />
                          )}
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      prefetch={true}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200 group ${isActive
                        ? "bg-[#118CDB] text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
                        } ${isCollapsed ? "justify-center" : ""}`}
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`} />
                      {!isCollapsed && <span className="font-medium">{link.label}</span>}
                    </Link>
                  )}

                  <AnimatePresence>
                    {link.hasDropdown && !isCollapsed && visitDetailsOpen && (
                      <motion.div
                        className="ml-6 mt-2 space-y-1 overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        {subLinks.map((subLink, subIdx) => (
                          <motion.div
                            key={subIdx}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: subIdx * 0.1, duration: 0.3 }}
                          >
                            <Link
                              href={subLink.href}
                              prefetch={true}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100/60 hover:text-gray-900 rounded-lg transition-all duration-200 group"
                            >
                              <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-gray-600"></div>
                              <FileText className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                              <span>{subLink.label}</span>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-200/60 p-3 space-y-2">
          <Link
            href="/patient/settings"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-all duration-200 group ${pathname === "/patient/settings"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-100/60 hover:text-gray-900"
              } ${isCollapsed ? "justify-center" : ""}`}
          >
            <Settings className="h-4 w-4 flex-shrink-0 text-gray-500 group-hover:text-gray-700" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-all duration-200 w-full text-gray-600 hover:bg-red-50 hover:text-red-600 group ${isCollapsed ? "justify-center" : ""
              }`}
          >
            <LogOut className="h-4 w-4 flex-shrink-0 text-gray-500 group-hover:text-red-500" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
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

export default PatientSidebar;
