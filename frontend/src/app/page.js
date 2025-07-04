// src/app/page.js
'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight, BarChart3, Users, FileCheck, Shield, Compass, Video } from "lucide-react";
import { useState } from 'react';

const Component= () => {
  // --- STATE FOR MODAL VISIBILITY AND MODAL FORM DATA ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedCardName, setClickedCardName] = useState('');
  const [modalFormData, setModalFormData] = useState({
    handle: '',
    email: '',
    phone: ''
  });
  const [modalSubmissionStatus, setModalSubmissionStatus] = useState('');

  // --- STATE FOR BOTTOM FORM DATA ---
  const [bottomFormData, setBottomFormData] = useState({
    handle: '',
    email: '',
    phone: ''
  });
  const [bottomSubmissionStatus, setBottomSubmissionStatus] = useState('');


  // --- Handlers for Modal Form Inputs ---
  const handleModalInputChange = (e) => {
    setModalFormData({ ...modalFormData, [e.target.name]: e.target.value });
  };

  // --- Handler for Bottom Form Inputs ---
  const handleBottomInputChange = (e) => {
    setBottomFormData({ ...bottomFormData, [e.target.name]: e.target.value });
  };


  // --- Common Submission Logic for Both Forms (Modal & Bottom) ---
  const commonSubmitLogic = async (formDataToSubmit, setFormStatus, clearFormData, context) => {
    setFormStatus('Submitting...');
    try {
      // CRITICAL: Ensure this uses the environment variable, NOT localhost:5000
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submit-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle: formDataToSubmit.handle,
          email: formDataToSubmit.email || null,
          phone: formDataToSubmit.phone || null,
          card_name: context.cardName || null,
          form_location: context.location
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFormStatus('Thank you! Your request has been submitted successfully.');
        clearFormData();
        // --- GA Event: Successful Form Submission ---
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'form_submission', {
            event_category: 'engagement',
            event_label: `early_access_${context.location}_success`,
            form_context: context.cardName || 'general',
            value: 1
          });
        }
      } else {
        setFormStatus(`Submission failed: ${data.message}`);
        // --- GA Event: Failed Form Submission ---
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'form_submission_failed', {
            event_category: 'engagement',
            event_label: `early_access_${context.location}_failure`,
            form_context: context.cardName || 'general',
            error_message: data.message
          });
        }
      }
    } catch (error) {
      console.error(`Network error during ${context.location} form submission:`, error);
      setFormStatus('Submission failed due to network error. Please try again.');
      // --- GA Event: Network Error on Form Submission ---
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'form_submission_failed', {
          event_category: 'engagement',
          event_label: `early_access_${context.location}_network_error`,
          form_context: context.cardName || 'general',
          error_message: error.message
        });
      }
    }
  };

  // --- MODAL FORM SUBMIT HANDLER ---
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    await commonSubmitLogic(
      modalFormData,
      setModalSubmissionStatus,
      () => setModalFormData({ handle: '', email: '', phone: '' }),
      { cardName: clickedCardName, location: 'modal' }
    );
  };

  // --- BOTTOM FORM SUBMIT HANDLER ---
  // const handleBottomSubmit = async (e) => {
  //   e.preventDefault();
  //   await commonSubmitLogic(
  //     bottomFormData,
  //     setBottomSubmissionStatus,
  //     () => setBottomFormData({ handle: '', email: '', phone: '' }),
  //     { cardName: null, location: 'bottom' }
  //   );
  // };


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000" />

          <div className="relative container mx-auto px-6 pt-20 pb-32">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 text-sm font-medium">
                ✨ CreatorHaven: Your Holistic AI Partner for Creator Mastery
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Beyond the Grind:
                </span>
                <br />
                <span className="text-gray-800">Your Path to Sustainable Creation.</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Creator fatigue is real. The grind is relentless. <strong className="text-purple-600">CreatorHaven</strong> is your dedicated partner, built to transform that struggle into sustainable success. Get <strong className="text-blue-600">AI-powered insights</strong>, expert <strong className="text-indigo-600">brand deal feedback</strong>, and access a <strong className="text-purple-600">supportive mentorship community</strong>. You don&apos;t have to do this alone.
              </p>


              <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-500">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-purple-500" />
                  <span>10K+ Videos Analyzed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>5K+ Active Creators</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-500" />
                  <span>Holistic Creator Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative py-24 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Fuel Your <span className="text-purple-600">Growth</span>, Master Your <span className="text-purple-600">Art</span>, Find Your <span className="text-purple-600">Flow</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Every feature designed to elevate your creative journey and unlock your full potential
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Direct Video Analysis */}
              <Card className="p-6 flex flex-col gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <Video className="h-7 w-7 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Direct Video Analysis</h3>
                </div>
                <p className="text-gray-600">
                  Upload or link a clip and get frame‑by‑frame feedback on hooks, pacing, and narrative impact.
                </p>
              </Card>

              {/* Mentor Match */}
              <Card className="p-6 flex flex-col gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <Compass className="h-7 w-7 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Mentor Match</h3>
                </div>
                <p className="text-gray-600">
                  Book 1‑on‑1 sessions with seasoned creators who&apos;ve walked the path before you.
                </p>
              </Card>

              {/* Top 100 Influencer Reports */}
              <Card className="p-6 flex flex-col gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-7 w-7 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Top 100 Influencer Reports</h3>
                </div>
                <p className="text-gray-600">
                  Weekly reverse‑engineered playbooks of the hottest 100 creators in your niche.
                </p>
              </Card>

              {/* AI‑Powered Insights */}
              <Card className="p-6 flex flex-col gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-7 w-7 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">AI‑Powered Insights</h3>
                </div>
                <p className="text-gray-600">
                  Spot hidden trends in comments, sentiment, and retention curves with our multi‑modal engine.
                </p>
              </Card>

              {/* Community Haven */}
              <Card className="p-6 flex flex-col gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-7 w-7 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Community Haven</h3>
                </div>
                <p className="text-gray-600">
                  Private circles, AMAs, and collab boards so you never create in isolation.
                </p>
              </Card>

              {/* Wellness &amp; Burnout Toolkit */}
              <Card className="p-6 flex flex-col gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-7 w-7 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Wellness &amp; Burnout Toolkit</h3>
                </div>
                <p className="text-gray-600">
                  Daily check‑ins, guided breathers, and progress nudges to keep your mind creator‑ready.
                </p>
              </Card>
            </div>

          </div>
        </div>

        {/* Final CTA Section (content as before) */}
        <div className="relative py-24 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Elevate Your Creator Journey?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join a community where every step of your creator journey—from content to well-being—is supported by intelligence and empathy.
            </p>
            {/* Main CTA Button */}
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => { // Still track GA and set card name
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'cta_button_click', {
                    event_category: 'engagement',
                    event_label: 'unlock_potential_bottom_button',
                  });
                }
                setClickedCardName('main_hero_cta_bottom'); // Label for this specific button
                setIsModalOpen(true);
                setModalSubmissionStatus('');
                setModalFormData({ handle: '', email: '', phone: '' });
              }}>
              Unlock Your Potential - Free Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Component;