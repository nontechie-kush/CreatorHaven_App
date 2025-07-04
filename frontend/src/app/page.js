// src/app/page.js
"use client";

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
import React, { useState } from 'react';

const Index = () => {
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
  const handleBottomSubmit = async (e) => {
    e.preventDefault(); 
    await commonSubmitLogic(
      bottomFormData, 
      setBottomSubmissionStatus, 
      () => setBottomFormData({ handle: '', email: '', phone: '' }), 
      { cardName: null, location: 'bottom' } 
    );
  };


  return (
    // --- WRAP BOTH TOP-LEVEL ELEMENTS IN A REACT FRAGMENT ---
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

              {/* Main CTA Button - NOW USES DIALOGTRIGGER */}
              <DialogTrigger asChild> {/* asChild means the button below will trigger the dialog */}
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => { // Still track GA and set card name
                    if (typeof window !== 'undefined' && window.gtag) {
                      window.gtag('event', 'cta_button_click', {
                        event_category: 'engagement',
                        event_label: 'unlock_potential_hero_button', // Label specifically for hero CTA
                      });
                    }
                    setClickedCardName('main_hero_cta'); // Set a name for the main CTA
                    setIsModalOpen(true); 
                    setModalSubmissionStatus('');
                    setModalFormData({ handle: '', email: '', phone: '' });
                  }}>
                  Unlock Your Potential - Free Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>

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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feature Cards - ONCLICK OPENS MODAL */}
              <DialogTrigger asChild> 
                <Card 
                  className="p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer"
                  onClick={() => { // Still use onClick here to ensure GA is tracked on the card
                    if (typeof window !== 'undefined' && window.gtag) {
                      window.gtag('event', 'feature_card_click', {
                        event_category: 'feature_interest',
                        event_label: 'ai_powered_growth_insights_card',
                        value: 1,
                      });
                    }
                    setClickedCardName('ai_powered_growth_insights_card'); // Set name when card clicked
                    setIsModalOpen(true); 
                    setModalSubmissionStatus('');
                    setModalFormData({ handle: '', email: '', phone: '' }); // Clear form
                  }}
                  role="button" 
                  tabIndex="0" 
                >
                  <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">AI Powered Growth Insights</h3>
                  <p className="text-gray-600">
                    <strong className="text-purple-600">Decode</strong> what makes content viral with AI analysis of thousands of successful creator videos
                  </p>
                  <a href="#" className="mt-4 inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold text-sm">
                      Show my progress <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Card>
              </DialogTrigger>

              {/* Feature 2 */}
              <DialogTrigger asChild>
                <Card 
                  className="p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer"
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.gtag) {
                      window.gtag('event', 'feature_card_click', {
                        event_category: 'feature_interest',
                        event_label: 'decode_what_goes_viral_card',
                        value: 1,
                      });
                    }
                    setClickedCardName('decode_what_goes_viral_card');
                    setIsModalOpen(true); 
                    setModalSubmissionStatus('');
                    setModalFormData({ handle: '', email: '', phone: '' });
                  }}
                  role="button"
                  tabIndex="0"
                >
                  <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Decode What Goes Viral</h3>
                  <p className="text-gray-600">
                    <strong className="text-blue-600">Stop guessing.</strong> Get AI analysis of thousands of viral videos in your niche. Understand the patterns, timing, and elements that make content explode.
                  </p>
                  <a href="#" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm">
                    Show me viral secrets <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Card>
              </DialogTrigger>

              {/* Feature 3 */}
              <DialogTrigger asChild>
                <Card 
                  className="p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 cursor-pointer"
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.gtag) {
                      window.gtag('event', 'feature_interest', {
                        event_category: 'feature_interest',
                        event_label: 'improve_your_content_card',
                        value: 1,
                      });
                    }
                    setClickedCardName('improve_your_content_card');
                    setIsModalOpen(true); 
                    setModalSubmissionStatus('');
                    setModalFormData({ handle: '', email: '', phone: '' });
                  }}
                  role="button"
                  tabIndex="0"
                >
                  <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Improve Your Content</h3>
                  <p className="text-gray-600">
                    Get personalized feedback on your videos. See exactly what to improve in your <strong className="text-indigo-600">visuals, pitch, and storytelling</strong> based on top performers.
                  </p>
                  <a href="#" className="mt-4 inline-flex items-centers text-indigo-600 hover:text-indigo-800 font-semibold text-sm">
                      Analyze my content <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Card>
              </DialogTrigger>

              {/* Feature 4 */}
              <DialogTrigger asChild>
                <Card 
                  className="p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 cursor-pointer"
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.gtag) {
                      window.gtag('event', 'feature_interest', {
                        event_category: 'feature_interest',
                        event_label: 'protect_your_brand_deals_card',
                        value: 1,
                      });
                    }
                    setClickedCardName('protect_your_brand_deals_card');
                    setIsModalOpen(true); 
                    setModalSubmissionStatus('');
                    setModalFormData({ handle: '', email: '', phone: '' });
                  }}
                  role="button"
                  tabIndex="0"
                >
                  <div className="bg-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                    <FileCheck className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Protect Your Brand Deals</h3>
                  <p className="text-gray-600">
                    Assess <strong className="text-emerald-600">contracts</strong> for risk and fairness with AI-powered legal insights
                  </p>
                  <a href="#" className="mt-4 inline-flex items-center text-emerald-600 hover:text-emerald-800 font-semibold text-sm">
                      Protect my deals <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Card>
              </DialogTrigger>

              {/* Feature 5 */}
              <DialogTrigger asChild>
                <Card 
                  className="p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 cursor-pointer"
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.gtag) {
                      window.gtag('event', 'feature_interest', {
                        event_category: 'feature_interest',
                        event_label: 'find_your_mentor_card',
                        value: 1,
                      });
                    }
                    setClickedCardName('find_your_mentor_card');
                    setIsModalOpen(true); 
                    setModalSubmissionStatus('');
                    setModalFormData({ handle: '', email: '', phone: '' });
                  }}
                  role="button"
                  tabIndex="0"
                >
                  <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                    <Compass className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Mentor Matching</h3>
                  <p className="text-gray-600">
                    Connect with relevant <strong className="text-orange-600">mentors</strong> who guide your creative journey to new heights
                  </p>
                  <a href="#" className="mt-4 inline-flex items-center text-orange-600 hover:text-orange-800 font-semibold text-sm">
                      Find my mentor <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Card>
              </DialogTrigger>

              {/* Feature 6 */}
              <DialogTrigger asChild>
                <Card 
                  className="p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 cursor-pointer"
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.gtag) {
                      window.gtag('event', 'feature_card_click', {
                        event_category: 'feature_interest',
                        event_label: 'creator_mental_health_first_card',
                        value: 1,
                      });
                    }
                    setClickedCardName('creator_mental_health_first_card');
                    setIsModalOpen(true); 
                    setModalSubmissionStatus('');
                    setModalFormData({ handle: '', email: '', phone: '' });
                  }}
                  role="button"
                  tabIndex="0"
                >
                  <div className="bg-pink-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Creator Mental Health First</h3>
                  <p className="text-gray-600">
                    Share your real struggles without judgment. Connect with other creators in an <strong className="text-pink-600">anonymous, supportive space</strong> where you can be vulnerable and get real help.
                  </p>
                  <a href="#" className="mt-4 inline-flex items-center text-pink-600 hover:text-pink-800 font-semibold text-sm">
                      Join safe community <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Card>
              </DialogTrigger>
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
    </>;
  );

  export default Index;