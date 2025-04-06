"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const Hero = () => {
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  
  // Card animation states
  const [card1Pos, setCard1Pos] = useState({ x: 0, y: 0, rotate: -12 });
  const [card2Pos, setCard2Pos] = useState({ x: 0, y: 0, rotate: 6 });
  const [card3Pos, setCard3Pos] = useState({ x: 0, y: 0, rotate: -3 });

  // Set visibility after component mounts for animations
  useEffect(() => {
    setIsVisible(true);
    
    // Add subtle floating animation to cards
    const interval = setInterval(() => {
      setCard1Pos({ 
        x: Math.sin(Date.now() / 2000) * 5, 
        y: Math.cos(Date.now() / 2500) * 5, 
        rotate: -12 + Math.sin(Date.now() / 3000) * 2 
      });
      setCard2Pos({ 
        x: Math.sin(Date.now() / 2200 + 1) * 5, 
        y: Math.cos(Date.now() / 2700 + 1) * 5, 
        rotate: 6 + Math.sin(Date.now() / 3200) * 2 
      });
      setCard3Pos({ 
        x: Math.sin(Date.now() / 2400 + 2) * 5, 
        y: Math.cos(Date.now() / 2900 + 2) * 5, 
        rotate: -3 + Math.sin(Date.now() / 3400) * 2 
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // Define animation classes based on visibility
  const fadeInClass = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10';
  const staggerDelay = (index) => `transition-all duration-1000 delay-${index * 200}`;

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-green-500/20 blur-3xl"></div>
        
        {/* Logo and Navigation */}
        <div className={`flex justify-center items-center mb-16 ${fadeInClass} ${staggerDelay(0)}`}>
          <h1 className="font-display text-4xl font-bold tracking-tight">
            <span className="text-green-400">Split</span>
            <span className="text-pink-400">App</span>
          </h1>
        </div>
        
        {/* Main Hero Content */}
        <div className="flex flex-col items-center mb-16 relative z-10">
          <div className="max-w-5xl text-center">
            <h2 className={`text-5xl md:text-7xl lg:text-8xl font-display font-extrabold mb-8 leading-none tracking-tight ${fadeInClass} ${staggerDelay(1)}`}>
              <span className="block">PAY AND SPLIT.</span>
              <span className="block text-gray-300">ANY BANK,</span>
              <span className="block gradient-text bg-gradient-to-r from-green-400 via-pink-500 to-amber-400 bg-clip-text text-transparent">ANYWHERE.</span>
            </h2>
            <p className={`text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 ${fadeInClass} ${staggerDelay(2)}`}>
              Use it online or IRL, for one-off or recurring expenses.
            </p>
          </div>
        </div>
        
        {/* Credit Cards Visual */}
        <div className={`relative w-full h-96 md:h-[500px] mb-16 ${fadeInClass} ${staggerDelay(3)}`}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl">
            {/* First card - primary color */}
            <div 
              className="absolute credit-card w-64 h-40 md:w-80 md:h-48 rounded-2xl shadow-xl z-10 sm:left-10 md:left-20"
              style={{ 
                backgroundImage: 'linear-gradient(45deg, #FF5FA2, #FF85C0)',
                transform: `translateX(${card1Pos.x}px) translateY(${card1Pos.y}px) rotate(${card1Pos.rotate}deg)`,
                transition: 'transform 0.5s ease-out'
              }}
            >
              <div className="absolute top-4 left-4 flex justify-between items-start w-full pr-4">
                <div className="credit-card-chip w-12 h-9 rounded-md bg-yellow-500/80"></div>
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/80" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                  </svg>
                </div>
              </div>
              <div className="credit-card-number mt-8 flex justify-center">
                <div className="credit-card-digit-group flex space-x-1">
                  <div className="credit-card-digit w-5 h-8 bg-white/20 rounded flex items-center justify-center text-white font-mono">•</div>
                  <div className="credit-card-digit w-5 h-8 bg-white/20 rounded flex items-center justify-center text-white font-mono">•</div>
                  <div className="credit-card-digit w-5 h-8 bg-white/20 rounded flex items-center justify-center text-white font-mono">•</div>
                  <div className="credit-card-digit w-5 h-8 bg-white/20 rounded flex items-center justify-center text-white font-mono">•</div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <p className="text-xs text-white/80">Sarah Johnson</p>
                <p className="text-xs text-white/80">12/26</p>
              </div>
            </div>
            
            {/* Second card - secondary color */}
            <div 
              className="absolute top-10 credit-card w-64 h-40 md:w-80 md:h-48 rounded-2xl shadow-xl z-20 sm:left-40 md:left-60"
              style={{ 
                backgroundImage: 'linear-gradient(45deg, #10B981, #34D399)',
                transform: `translateX(${card2Pos.x}px) translateY(${card2Pos.y}px) rotate(${card2Pos.rotate}deg)`,
                transition: 'transform 0.5s ease-out'
              }}
            >
              <div className="absolute top-4 left-4 flex justify-between items-start w-full pr-4">
                <div className="credit-card-chip w-12 h-9 rounded-md bg-yellow-500/80"></div>
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/80" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                  </svg>
                </div>
              </div>
              <div className="credit-card-number mt-8 flex justify-center">
                <div className="credit-card-digit-group flex space-x-1">
                  <div className="credit-card-digit w-5 h-8 bg-white/20 rounded flex items-center justify-center text-white font-mono">•</div>
                  <div className="credit-card-digit w-5 h-8 bg-white/20 rounded flex items-center justify-center text-white font-mono">•</div>
                  <div className="credit-card-digit w-5 h-8 bg-white/20 rounded flex items-center justify-center text-white font-mono">•</div>
                  <div className="credit-card-digit w-5 h-8 bg-white/20 rounded flex items-center justify-center text-white font-mono">•</div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <p className="text-xs text-white/80">Michael Chen</p>
                <p className="text-xs text-white/80">09/25</p>
              </div>
            </div>
            
            {/* Third card - dark with details */}
            <div 
              className="absolute top-20 credit-card w-64 h-40 md:w-80 md:h-48 rounded-2xl shadow-xl z-30 p-4 sm:left-80 md:left-[300px]"
              style={{ 
                backgroundImage: 'linear-gradient(45deg, #1F2937, #0F0F0F)',
                transform: `translateX(${card3Pos.x}px) translateY(${card3Pos.y}px) rotate(${card3Pos.rotate}deg)`,
                transition: 'transform 0.5s ease-out'
              }}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-400">SplitApp</p>
                  <p className="text-sm font-medium text-white">Virtual Card</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-8 flex items-center space-x-2">
                <div className="w-8 h-6 rounded bg-white/10"></div>
                <div className="w-8 h-6 rounded bg-white/10"></div>
                <div className="w-8 h-6 rounded bg-white/10"></div>
                <div className="w-8 h-6 rounded bg-white/10"></div>
              </div>
              <div className="mt-3 flex justify-between">
                <div className="text-xs text-gray-400">
                  <p>Group Dinner</p>
                </div>
                <div className="text-xs text-gray-400">
                  <p>04/25</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center mb-20 ${fadeInClass} ${staggerDelay(4)}`}>
          <Link 
            href="/signup" 
            className="btn btn-primary btn-lg relative overflow-hidden group"
          >
            <span className="relative z-10">Get Started — It's Free</span>
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
          </Link>
          <Link 
            href="#how-it-works" 
            className="btn btn-outline btn-lg relative overflow-hidden group border-2 border-white/60 text-white hover:bg-white/10"
          >
            <span className="relative z-10">See How It Works</span>
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
          </Link>
        </div>
        
        {/* Banner Section with Illustration */}
        <div className={`bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-2xl p-8 md:p-10 mb-20 shadow-lg border border-gray-700/50 ${fadeInClass} ${staggerDelay(5)}`}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-display font-bold mb-4 gradient-text bg-gradient-to-r from-pink-400 to-green-400 bg-clip-text text-transparent">
                Split any bill, anywhere
              </h3>
              <p className="text-xl text-gray-300 mb-6">
                Whether it's dining out, travel expenses, or utility bills — SplitApp makes it easy to split costs with friends, family, or roommates.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-primary px-4 py-2 rounded-full text-sm">Restaurants</span>
                <span className="badge badge-secondary px-4 py-2 rounded-full text-sm">Rent</span>
                <span className="badge badge-success px-4 py-2 rounded-full text-sm">Utilities</span>
                <span className="badge badge-accent px-4 py-2 rounded-full text-sm">Groceries</span>
              </div>
            </div>
            <div className="relative h-64 md:h-80 animate-pulse-slow">
              <Image 
                src="/images/payment-illustration.svg" 
                alt="Split payments illustration" 
                fill 
                style={{objectFit: 'contain'}} 
                className="drop-shadow-lg"
              />
            </div>
          </div>
        </div>
        
        {/* Partner Logos */}
        <div className={`border-t border-gray-800 pt-16 ${fadeInClass} ${staggerDelay(6)}`}>
          <div className="text-center mb-8">
            <h3 className="text-xl font-display font-bold text-gray-300">Powered by trusted payment networks</h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
            <div className="w-24 h-12 relative grayscale opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110">
              <Image src="/images/mastercard-logo.svg" alt="Mastercard" fill style={{objectFit: 'contain'}} />
            </div>
            <div className="w-24 h-12 relative grayscale opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110">
              <Image src="/images/visa-logo.svg" alt="Visa" fill style={{objectFit: 'contain'}} />
            </div>
            <div className="w-24 h-12 relative grayscale opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110">
              <Image src="/images/amex-logo.svg" alt="American Express" fill style={{objectFit: 'contain'}} />
            </div>
            <div className="w-24 h-12 relative grayscale opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110">
              <Image src="/images/stripe-logo.svg" alt="Stripe" fill style={{objectFit: 'contain'}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
