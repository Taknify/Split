import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';

export default async function Home() {
  // Check if user is logged in and redirect to dashboard
  const session = await auth();
  if (session?.user) {
    // For demo purposes, if the user is test@example.com, redirect to admin
    if (session.user.email === 'test@example.com') {
      redirect('/admin');
    } else {
      redirect('/dashboard');
    }
  }
  return (
    <main>
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
