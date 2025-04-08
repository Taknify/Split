"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
const steps = [
  {
    id: 1,
    title: "Create a group",
    description: "Invite friends to your expense group in seconds.",
    gradient: "from-red-500 via-pink-500 to-purple-500",
    bgGradient: "from-red-50 to-white",
    lineGradient: "from-red-500 to-purple-500",
    image: "/images/create-group.svg"
  },
  {
    id: 2,
    title: "Add an expense",
    description: "Enter a bill amount and choose how to split it.",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    bgGradient: "from-blue-50 to-white",
    lineGradient: "from-blue-500 to-teal-500",
    image: "/images/payment-illustration.svg"
  },
  {
    id: 3,
    title: "Everyone pays",
    description: "Each person is charged through their preferred payment method.",
    gradient: "from-green-500 via-emerald-500 to-lime-500",
    bgGradient: "from-green-50 to-white",
    lineGradient: "from-green-500 to-lime-500",
    image: "/images/card-stack.png"
  },
  {
    id: 4,
    title: "Virtual card created",
    description: "Use the virtual card for immediate payment anywhere.",
    gradient: "from-yellow-500 via-amber-500 to-orange-500",
    bgGradient: "from-yellow-50 to-white",
    lineGradient: "from-yellow-500 to-orange-500",
    image: "/images/virtual-card.png"
  }
];
const HowItWorks = () => {
  const [activeGradient, setActiveGradient] = useState(steps[0].bgGradient);
  const [activeLineGradient, setActiveLineGradient] = useState(steps[0].lineGradient);
  const sectionRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const section = sectionRef.current;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.scrollY;
      // Calculate which step's gradient to use based on scroll position within the section
      const progress = (scrollPosition - sectionTop) / sectionHeight;
      const stepIndex = Math.min(Math.max(Math.floor(progress * steps.length), 0), steps.length - 1);
      setActiveGradient(steps[stepIndex].bgGradient);
      setActiveLineGradient(steps[stepIndex].lineGradient);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <section 
      id="how-it-works" 
      ref={sectionRef}
      className={`py-24 relative bg-gradient-to-b ${activeGradient}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-4 tracking-tight text-black">
            Split bills in 4 simple steps
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-800">
            Our streamlined process makes splitting bills effortless
          </p>
        </div>
        <div className="relative">
          {}
          <div 
            className={`hidden lg:block absolute left-1/2 top-24 bottom-24 w-0.5 transform -translate-x-1/2 bg-gradient-to-b ${activeLineGradient}`}
          ></div>
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => (
              <div key={step.id} className="relative group">
                <div className={`lg:grid lg:grid-cols-2 lg:gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  {}
                  <div className={`relative z-10 lg:flex lg:items-center ${index % 2 === 1 ? 'lg:justify-end' : ''}`}>
                    <div className={`px-6 py-8 md:p-0 rounded-2xl ${index % 2 === 1 ? 'lg:text-right' : ''}`}>
                      <div className={`hidden lg:flex items-center justify-center w-12 h-12 bg-black text-white font-bold absolute left-1/2 transform -translate-x-1/2 z-20`}>
                        {step.id}
                      </div>
                      <h3 className="text-3xl font-display font-bold mb-4 text-black">{step.title}</h3>
                      <p className="text-xl text-gray-800 mb-6">{step.description}</p>
                      <div className={`h-1 w-16 bg-black rounded ${index % 2 === 1 ? 'lg:ml-auto' : ''}`}></div>
                    </div>
                  </div>
                  {}
                  <div className="mt-8 lg:mt-0 relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
                    <div 
                      className={`absolute inset-0 opacity-20 group-hover:opacity-50 transition-opacity duration-500 bg-gradient-to-r ${step.gradient}`}
                    ></div>
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      style={{objectFit: 'cover', zIndex: 10}}
                      className="relative z-10"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;
