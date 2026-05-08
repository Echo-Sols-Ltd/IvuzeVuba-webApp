"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  Play,
  Plus,
  Twitter,
  X,
  Users,
  Heart,
  Hospital,
  Shield,
  Smartphone,
  CreditCard,
  Clock,
  Activity,
  Calendar,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-[#0066CC] rounded-lg flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#0066CC]">HealthLink</span>
                <span className="text-[10px] text-slate-500 font-medium -mt-1 uppercase tracking-wider">Smart Health, Better Life.</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-10">
              <Link href="#home" className="text-sm font-semibold text-slate-600 hover:text-[#0066CC] transition-colors">Home</Link>
              <Link href="#features" className="text-sm font-semibold text-slate-600 hover:text-[#0066CC] transition-colors">Features</Link>
              <Link href="#institutions" className="text-sm font-semibold text-slate-600 hover:text-[#0066CC] transition-colors">For Institutions</Link>
              <Link href="#patients" className="text-sm font-semibold text-slate-600 hover:text-[#0066CC] transition-colors">For Patients</Link>
              <Link href="#about" className="text-sm font-semibold text-slate-600 hover:text-[#0066CC] transition-colors">About Us</Link>
              <Link href="#contact" className="text-sm font-semibold text-slate-600 hover:text-[#0066CC] transition-colors">Contact</Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-slate-600 font-semibold hover:text-[#0066CC]">Login</Button>
              </Link>
              <Link href="/auth/login">
                <Button className="bg-[#0066CC] hover:bg-[#0052A3] text-white px-6 rounded-xl font-semibold shadow-lg shadow-blue-200">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 py-6 px-4 space-y-4 shadow-xl">
            <Link href="#home" className="block text-base font-semibold text-slate-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="#features" className="block text-base font-semibold text-slate-600" onClick={() => setIsMenuOpen(false)}>Features</Link>
            <Link href="#institutions" className="block text-base font-semibold text-slate-600" onClick={() => setIsMenuOpen(false)}>For Institutions</Link>
            <Link href="#patients" className="block text-base font-semibold text-slate-600" onClick={() => setIsMenuOpen(false)}>For Patients</Link>
            <Link href="#about" className="block text-base font-semibold text-slate-600" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link href="#contact" className="block text-base font-semibold text-slate-600" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link href="/auth/login" className="w-full">
                <Button variant="outline" className="w-full border-[#0066CC] text-[#0066CC] rounded-xl font-semibold">Login</Button>
              </Link>
              <Link href="/auth/login" className="w-full">
                <Button className="w-full bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-xl font-semibold shadow-lg shadow-blue-200">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-[#F0F7FF] via-white to-white">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Text Content */}
            <div className="max-w-2xl">
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6">
                Digital Healthcare for a <span className="text-[#0066CC]">Healthier Rwanda</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-lg">
                HealthLink is an integrated digital health platform that connects patients, doctors, and hospitals for better, faster, and smarter healthcare.
              </p>

              {/* Icon Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
                {[
                  { icon: Zap, label: "NFC Access" },
                  { icon: Clock, label: "Real-time Queues" },
                  { icon: Shield, label: "Secure Records" },
                  { icon: CreditCard, label: "Mobile Money Payments" }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-[#0066CC]" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 leading-tight uppercase tracking-wide">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/login">
                  <Button size="lg" className="bg-[#0066CC] hover:bg-[#0052A3] text-white px-8 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 group">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-slate-200 bg-white text-slate-700 px-8 h-14 rounded-2xl font-bold text-lg hover:bg-slate-50">
                  <Play className="mr-2 w-5 h-5 fill-[#0066CC] text-[#0066CC]" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Hero Visual Content */}
            <div className="relative">
              {/* Dashboard Preview Overlay */}
              <div className="relative z-10 rounded-2xl shadow-2xl shadow-blue-200/50 border border-slate-200 overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                <Image
                  src="/dashboard-preview.png"
                  alt="HealthLink Dashboard"
                  width={800}
                  height={500}
                  className="w-full h-auto"
                />
              </div>

              {/* Doctor Image Overlay */}
              <div className="absolute -bottom-10 -right-10 z-20 w-1/2 lg:w-3/5 transform translate-y-1/4">
                <div className="relative group">
                   {/* Background Glow */}
                   <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-20 scale-75 group-hover:scale-100 transition-transform" />
                   <Image
                    src="/doctor-hero.png"
                    alt="Healthcare Professional"
                    width={400}
                    height={500}
                    className="relative z-10 w-full h-auto drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Floating Decorative Elements */}
              <div className="absolute top-1/4 -left-8 w-20 h-20 bg-green-400/20 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-1/4 -right-4 w-16 h-16 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose HealthLink */}
      <section id="features" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#0066CC] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Why Choose HealthLink</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Everything you need for<br />modern <span className="text-[#0066CC]">healthcare</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "For Patients",
                desc: "Access your records, track treatment, make payments, and get updates.",
                color: "blue"
              },
              {
                icon: Heart,
                title: "For Doctors",
                desc: "Manage queues, view patient history, add prescriptions, and refer with ease.",
                color: "green"
              },
              {
                icon: Hospital,
                title: "For Managers",
                desc: "Monitor operations, analyze reports, and improve service delivery.",
                color: "purple"
              },
              {
                icon: Shield,
                title: "For Admins",
                desc: "Manage users, systems, permissions, and keep everything secure.",
                color: "indigo"
              },
              {
                icon: Zap,
                title: "NFC Technology",
                desc: "Tap your card for quick check-in and secure identification.",
                color: "cyan"
              },
              {
                icon: Smartphone,
                title: "Accessible for All",
                desc: "USSD, SMS, and caregiver support for patients without smartphones.",
                color: "teal"
              }
            ].map((feature, idx) => (
              <div key={idx} className="group p-10 rounded-[32px] bg-slate-50/50 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-[#0066CC]" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-8">{feature.desc}</p>
                <Link href="#" className="inline-flex items-center text-[#0066CC] font-bold text-sm uppercase tracking-wider group/link">
                  Learn more
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 lg:py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left - Steps Content */}
            <div className="">
              <span className="text-[#0066CC] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">How It Works</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-12">
                Simple steps for better<br />healthcare
              </h2>

              <div className="space-y-10">
                {[
                  {
                    num: "01",
                    icon: Zap,
                    title: "Tap Your NFC Card",
                    desc: "Use your HealthLink card at any kiosk or reception to check in."
                  },
                  {
                    num: "02",
                    icon: Users,
                    title: "Get in Queue",
                    desc: "You'll be added to the right queue and notified of your position."
                  },
                  {
                    num: "03",
                    icon: Heart,
                    title: "Receive Care",
                    desc: "Consult your doctor, get treatment, prescriptions, and referrals."
                  },
                  {
                    num: "04",
                    icon: CreditCard,
                    title: "Pay & Track",
                    desc: "Make payments, access your records, and get updates via SMS or USSD."
                  }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#0066CC] font-bold text-lg shadow-md group-hover:bg-[#0066CC] group-hover:text-white transition-colors">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <step.icon className="w-5 h-5 text-[#0066CC]" />
                        {step.title}
                      </h4>
                      <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="#">
                <Button className="mt-12 bg-[#0066CC] hover:bg-[#0052A3] text-white px-8 h-14 rounded-2xl font-bold shadow-lg shadow-blue-200">
                  Learn More About the Process
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Right - Interactive Visuals */}
            <div className="relative">
              {/* NFC Illustration */}
              <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl shadow-blue-200/50 transform -rotate-3 hover:rotate-0 transition-transform duration-700">
                <Image
                  src="/nfc-illustration.png"
                  alt="NFC Card Tapping Reader"
                  width={600}
                  height={450}
                  className="w-full h-auto"
                />
              </div>

              {/* Phone Mockup Overlay */}
              <div className="absolute -bottom-20 -right-4 lg:-right-12 z-20 w-2/5 lg:w-1/2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-20 scale-75" />
                  <Image
                    src="/phone-mockup.png"
                    alt="HealthLink Mobile App"
                    width={300}
                    height={600}
                    className="relative z-10 w-full h-auto drop-shadow-2xl transform lg:rotate-3 group-hover:rotate-0 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section id="about" className="py-24 lg:py-32 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#0066CC] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Our Impact</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Building a healthier<br />Rwanda together
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              { icon: Hospital, value: "1000+", label: "Healthcare Facilities" },
              { icon: Users, value: "500K+", label: "Patients Served" },
              { icon: Calendar, value: "2M+", label: "Appointments Managed" },
              { icon: Activity, value: "98%", label: "Patient Satisfaction" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-16 h-16 bg-[#F0F7FF] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[#0066CC] transition-all">
                  <stat.icon className="w-8 h-8 text-[#0066CC] group-hover:text-white transition-colors" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-[#0066CC] mb-2">{stat.value}</div>
                <div className="text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-[#0066CC] rounded-[48px] p-10 lg:p-20 overflow-hidden shadow-2xl shadow-blue-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
              </svg>
            </div>
            
            {/* Rwanda Silhouette Placeholder (Stylized Map) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-1/2 h-full opacity-10 pointer-events-none">
              <div className="w-full h-full bg-white rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center text-white">
              <div>
                <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
                  Ready to transform healthcare?
                </h2>
                <p className="text-xl text-blue-100 mb-10 max-w-lg leading-relaxed">
                  Join thousands of healthcare professionals and patients already using HealthLink.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/auth/login">
                    <Button size="lg" className="bg-white text-[#0066CC] hover:bg-blue-50 px-8 h-16 rounded-2xl font-bold text-lg shadow-xl">
                      Get Started Today
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 h-16 rounded-2xl font-bold text-lg">
                    Contact Us
                  </Button>
                </div>
              </div>
              <div className="hidden lg:flex justify-end">
                {/* Rwanda Map Icon/Silhouette */}
                <div className="relative">
                  <div className="w-64 h-64 border-4 border-white/20 rounded-full flex items-center justify-center animate-pulse">
                     <MapPin className="w-32 h-32 text-white/40" />
                  </div>
                  {/* Decorative dots */}
                  <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full animate-ping" />
                  <div className="absolute bottom-10 left-0 w-3 h-3 bg-white/60 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
            {/* Logo Column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-[#0066CC] rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-[#0066CC]">HealthLink</span>
              </Link>
              <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-sm">
                Empowering Rwanda&apos;s healthcare system through technology, innovation, and inclusion.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <Link key={i} href="#" className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#0066CC] hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="text-slate-900 font-bold mb-6 uppercase tracking-wider text-sm">Platform</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><Link href="#" className="hover:text-[#0066CC] transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-[#0066CC] transition-colors">For Patients</Link></li>
                <li><Link href="#" className="hover:text-[#0066CC] transition-colors">For Doctors</Link></li>
                <li><Link href="#" className="hover:text-[#0066CC] transition-colors">For Managers</Link></li>
                <li><Link href="#" className="hover:text-[#0066CC] transition-colors">For Admins</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold mb-6 uppercase tracking-wider text-sm">Company</h4>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><Link href="#" className="hover:text-[#0066CC] transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-[#0066CC] transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-[#0066CC] transition-colors">News & Updates</Link></li>
                <li><Link href="#" className="hover:text-[#0066CC] transition-colors">Partners</Link></li>
                <li><Link href="#" className="hover:text-[#0066CC] transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold mb-6 uppercase tracking-wider text-sm">Support</h4>
              <div className="space-y-6">
                <ul className="space-y-4 text-slate-500 font-medium">
                  <li><Link href="#" className="hover:text-[#0066CC] transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-[#0066CC] transition-colors">Privacy Policy</Link></li>
                </ul>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-500 font-medium">
                    <Phone className="w-4 h-4 text-[#0066CC]" />
                    <span>+250 788 123 456</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 font-medium">
                    <Mail className="w-4 h-4 text-[#0066CC]" />
                    <span>info@healthlink.rw</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 font-medium">
                    <MapPin className="w-4 h-4 text-[#0066CC]" />
                    <span>Kigali, Rwanda</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 font-medium text-sm">
              © 2024 HealthLink. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-slate-400 font-medium">
              <Link href="#" className="hover:text-slate-600 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-slate-600 transition-colors">Terms</Link>
              <Link href="#" className="hover:text-slate-600 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
