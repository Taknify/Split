"use client";
import React from 'react';
import Link from 'next/link';
const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {}
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold mb-8 leading-none tracking-tight">
            <span className="block">PAY AND SPLIT.</span>
            <span className="block text-gray-300">ANY BANK,</span>
            <span className="block gradient-text bg-gradient-to-r from-green-400 via-pink-500 to-amber-400 bg-clip-text text-transparent">
              ANYWHERE.
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
            Use it online or IRL, for one-off or recurring expenses.
          </p>
        </div>
        {}
        <div className="flex justify-center items-center space-x-[-50px] mb-16">
          {}
          <div 
            className="w-64 h-40 md:w-80 md:h-48 rounded-2xl shadow-xl transform rotate-12 z-10"
            style={{ 
              backgroundImage: 'linear-gradient(45deg, #FFFFFF, #F0F0F0)',
              color: '#000'
            }}
          >
            <div className="p-4 h-full flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-12 h-9 rounded-md bg-gray-300"></div>
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
              <div className="flex justify-center space-x-1 my-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-5 h-8 bg-gray-300 rounded"></div>
                ))}
              </div>
              <div className="flex justify-between text-xs">
                <span>Sarah Johnson</span>
                <span>12/26</span>
              </div>
            </div>
          </div>
          {}
          <div 
            className="w-64 h-40 md:w-80 md:h-48 rounded-2xl shadow-xl z-20"
            style={{ 
              backgroundImage: 'linear-gradient(45deg, #000000, #333333)',
              color: '#fff'
            }}
          >
            <div className="p-4 h-full flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-12 h-9 rounded-md bg-gray-700"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              </div>
              <div className="flex justify-center space-x-1 my-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-5 h-8 bg-gray-700 rounded"></div>
                ))}
              </div>
              <div className="flex justify-between text-xs">
                <span>Michael Chen</span>
                <span>09/25</span>
              </div>
            </div>
          </div>
          {}
          <div 
            className="w-64 h-40 md:w-80 md:h-48 rounded-2xl shadow-xl transform -rotate-12 z-10"
            style={{ 
              backgroundImage: 'linear-gradient(45deg, #FF3B30, #FF6B6B)',
              color: '#fff'
            }}
          >
            <div className="p-4 h-full flex flex-col justify-between">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs opacity-80">SplitApp</p>
                  <p className="text-sm">Virtual Card</p>
                </div>
                <div className="w-8 h-8 bg-white/10 rounded-full"></div>
              </div>
              <div className="flex justify-center space-x-1 my-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-6 bg-white/10 rounded"></div>
                ))}
              </div>
              <div className="flex justify-between text-xs">
                <span>Group Dinner</span>
                <span>04/25</span>
              </div>
            </div>
          </div>
        </div>
        {}
        <div className="flex justify-center space-x-4">
          <Link 
            href="/signup" 
            className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors"
          >
            Get Started — It's Free
          </Link>
          <Link 
            href="#how-it-works" 
            className="border-2 border-white/60 text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
          >
            See How It Works
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Hero;
