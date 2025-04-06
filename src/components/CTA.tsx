"use client";
import React from 'react';
import Link from 'next/link';
const CTA = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
      {}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
      </div>
      {}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full animate-blob"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full animate-blob animation-delay-2000"></div>
      <div className="relative z-10 container mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Ready to Split Your First Bill?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of users who are simplifying group expenses and making bill splitting a breeze.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/signup" 
              className="px-8 py-4 bg-white text-black font-bold rounded-full 
                         transition duration-300 ease-in-out 
                         hover:bg-gray-100 
                         transform hover:-translate-y-1 
                         shadow-lg hover:shadow-xl 
                         relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started — Free Forever</span>
              <span 
                className="absolute inset-0 bg-gradient-to-r from-gray-100 via-white to-gray-100 
                           opacity-0 group-hover:opacity-20 
                           transition-opacity duration-300"
              ></span>
            </Link>
            <Link 
              href="#features" 
              className="px-8 py-4 border-2 border-white/60 text-white 
                         rounded-full 
                         transition duration-300 ease-in-out 
                         hover:bg-white/10 
                         transform hover:-translate-y-1 
                         shadow-lg hover:shadow-xl 
                         relative overflow-hidden group"
            >
              <span className="relative z-10">Learn More</span>
              <span 
                className="absolute inset-0 bg-white/10 
                           opacity-0 group-hover:opacity-20 
                           transition-opacity duration-300"
              ></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CTA;
