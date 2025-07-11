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
import { ArrowRight, BarChart3, Users, FileCheck, Shield, Compass, Video, Eye, TrendingUp, Heart } from "lucide-react";
import { useState, useEffect } from 'react';


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
  // --- Google Analytics: Track page view on load ---
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'CreatorHaven Landing Page',
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
    }
  }, []);




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
     // Extract UTM/context info from browser
     const searchParams = new URLSearchParams(window.location.search);
     const utmSource = searchParams.get("utm_source");
     const utmMedium = searchParams.get("utm_medium");
     const utmCampaign = searchParams.get("utm_campaign");
     const referrer = document.referrer;
     const userAgent = navigator.userAgent;

     // CRITICAL: Ensure this uses the environment variable, NOT localhost:5000
     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submit-form`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         handle: formDataToSubmit.handle,
         email: formDataToSubmit.email || null,
         phone: formDataToSubmit.phone || null,
         card_name: context.cardName || null,
         form_location: context.location,
         utmSource,
         utmMedium,
         utmCampaign,
         referrer,
         userAgent
       }),
     });

     const data = await response.json();

     // --- Updated GA event logic for form submission ---
     if (response.ok) {
       setFormStatus('Thank you! Your request has been submitted successfully.');
       clearFormData();
       // --- GA Event: Successful Form Submission ---
       if (typeof window !== 'undefined' && window.gtag) {
         window.gtag('event', 'form_submission_success', {
           event_category: 'engagement',
           event_label: `early_access_${context.location}_success`,
           form_context: context.cardName || 'general'
         });
       }
     } else {
       const errorMessage = data?.message || 'Unexpected error';
       setFormStatus(`Submission failed: ${errorMessage}`);
       // --- GA Event: Failed Form Submission ---
       if (typeof window !== 'undefined' && window.gtag) {
         window.gtag('event', 'form_submission_failed', {
           event_category: 'engagement',
           event_label: `early_access_${context.location}_failure`,
           form_context: context.cardName || 'general',
           error_message: errorMessage
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
         form_context: context.cardName || 'general'
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
       <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-100 to-indigo-100 py-32 px-6">
         {/* Decorative Background Blobs */}
         <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse -z-10" />
         <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl animate-pulse delay-1000 -z-10" />

         <div className="max-w-5xl mx-auto text-center">
           <div className="inline-block px-5 py-2 mb-6 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg">
             💜 For Creators, Influencers & Content Artists
           </div>

           <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
             The World Sees the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Spotlight</span>
           </h1>

           <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-6">
             We Stand Beside You in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 italic">Shadows Too</span>
           </h2>


           <div className="mt-48 flex justify-center gap-6 md:gap-12 text-sm md:text-base text-gray-800 font-medium flex-wrap">
             <div className="flex items-center gap-2">
               <span className="text-pink-500 text-xl">🎥</span> 10K+ Videos Analyzed
             </div>
             <div className="flex items-center gap-2">
               <span className="text-blue-500 text-xl">📊</span> AI-Powered Growth Insights
             </div>
             <div className="flex items-center gap-2">
               <span className="text-purple-500 text-xl">🧠</span> Creator Mental Health First
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
             {/* AI Powered Growth Insights */}
             <Card
               className="p-6 flex flex-col gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer"
               onClick={() => {
                 setClickedCardName("AI Powered Growth Insights");
                 setIsModalOpen(true);
                 setModalSubmissionStatus('');
                 setModalFormData({ handle: '', email: '', phone: '' });
               }}
             >
               <div className="flex items-center gap-3">
                 <BarChart3 className="h-7 w-7 text-purple-600" />
                 <h3 className="text-xl font-semibold text-gray-900">AI Powered Growth Insights</h3>
               </div>
               <p className="text-gray-600">
                 Understand how you rank and get <span className="font-semibold text-purple-600">clear growth insights</span> for your next leap.
               </p>
               <span className="text-blue-600 font-medium">Show my progress →</span>
             </Card>

             {/* Decode What Goes Viral */}
             <Card
               className="p-6 flex flex-col gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer"
               onClick={() => {
                 setClickedCardName("Decode What Goes Viral");
                 setIsModalOpen(true);
                 setModalSubmissionStatus('');
                 setModalFormData({ handle: '', email: '', phone: '' });
               }}
             >
               <div className="flex items-center gap-3">
                 <Eye className="h-7 w-7 text-purple-600" />
                 <h3 className="text-xl font-semibold text-gray-900">Decode What Goes Viral</h3>
               </div>
               <p className="text-gray-600">
                 AI breaks down <span className="font-semibold text-purple-600">viral video patterns</span>—so you can create smarter.
               </p>
               <span className="text-blue-600 font-medium">Show me viral secrets →</span>
             </Card>

             {/* Improve Your Content */}
             <Card
               className="p-6 flex flex-col gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer"
               onClick={() => {
                 setClickedCardName("Improve Your Content");
                 setIsModalOpen(true);
                 setModalSubmissionStatus('');
                 setModalFormData({ handle: '', email: '', phone: '' });
               }}
             >
               <div className="flex items-center gap-3">
                 <TrendingUp className="h-7 w-7 text-purple-600" />
                 <h3 className="text-xl font-semibold text-gray-900">Improve Your Content</h3>
               </div>
               <p className="text-gray-600">
                 Get instant tips on <span className="font-semibold text-blue-600">visuals, hooks, and delivery</span> from the best creators.
               </p>
               <span className="text-blue-600 font-medium">Analyze my content →</span>
             </Card>

             {/* Protect Your Brand Deals */}
             <Card
               className="p-6 flex flex-col gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer"
               onClick={() => {
                 setClickedCardName("Protect Your Brand Deals");
                 setIsModalOpen(true);
                 setModalSubmissionStatus('');
                 setModalFormData({ handle: '', email: '', phone: '' });
               }}
             >
               <div className="flex items-center gap-3">
                 <FileCheck className="h-7 w-7 text-purple-600" />
                 <h3 className="text-xl font-semibold text-gray-900">Protect Your Brand Deals</h3>
               </div>
               <p className="text-gray-600">
                 Review deals with <span className="font-semibold text-green-600">contract safety tips</span> and fair rate advice.
               </p>
               <span className="text-blue-600 font-medium">Protect my deals →</span>
             </Card>

             {/* Find Your Mentor */}
             <Card
               className="p-6 flex flex-col gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer"
               onClick={() => {
                 setClickedCardName("Find Your Mentor");
                 setIsModalOpen(true);
                 setModalSubmissionStatus('');
                 setModalFormData({ handle: '', email: '', phone: '' });
               }}
             >
               <div className="flex items-center gap-3">
                 <Compass className="h-7 w-7 text-purple-600" />
                 <h3 className="text-xl font-semibold text-gray-900">Find Your Mentor</h3>
               </div>
               <p className="text-gray-600">
                 Find mentors who offer <span className="font-semibold text-orange-600">real-world guidance</span> tailored to your journey.
               </p>
               <span className="text-blue-600 font-medium">Find my mentor →</span>
             </Card>

             {/* Creator Mental Health First */}
             <Card
               className="p-6 flex flex-col gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer"
               onClick={() => {
                 setClickedCardName("Creator Mental Health First");
                 setIsModalOpen(true);
                 setModalSubmissionStatus('');
                 setModalFormData({ handle: '', email: '', phone: '' });
               }}
             >
               <div className="flex items-center gap-3">
                 <Heart className="h-7 w-7 text-purple-600" />
                 <h3 className="text-xl font-semibold text-gray-900">Creator Mental Health First</h3>
               </div>
               <p className="text-gray-600">
                 Join a <span className="font-semibold text-pink-600">safe, honest space</span> to talk and feel supported.
               </p>
               <span className="text-blue-600 font-medium">Join safe community →</span>
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

       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle className="text-center text-2xl font-bold text-purple-700 mb-1">
               Join the Waitlist
             </DialogTitle>
             <DialogDescription className="text-center text-gray-600 mb-4 text-base">
               Get early access to features that will transform your creator journey
             </DialogDescription>
           </DialogHeader>
           <form onSubmit={handleModalSubmit} className="space-y-5">
             <input
               type="text"
               name="handle"
               placeholder="@yourhandle or facebook.com/yourpage"
               required
               className="w-full border rounded px-3 py-2"
               onChange={handleModalInputChange}
               value={modalFormData.handle}
             />
             <input
               type="email"
               name="email"
               placeholder="your@email.com"
               className="w-full border rounded px-3 py-2"
               onChange={handleModalInputChange}
               value={modalFormData.email}
             />
             <input
               type="tel"
               name="phone"
               placeholder="+1 (555) 123-4567"
               className="w-full border rounded px-3 py-2"
               onChange={handleModalInputChange}
               value={modalFormData.phone}
             />
             <Button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">
               Join Waitlist
             </Button>
             {modalSubmissionStatus && <p className="text-sm text-gray-600">{modalSubmissionStatus}</p>}
           </form>
         </DialogContent>
       </Dialog>
     </div>
   </>
 );
}
export default Component;
