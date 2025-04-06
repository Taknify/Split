"use client";

import React from 'react';
import Image from 'next/image';

const steps = [
  {
    id: 1,
    title: "Create a group",
    description: "Invite friends to your expense group in seconds.",
    iconBg: "bg-blue-500",
    image: "/images/create-group.svg"
  },
  {
    id: 2,
    title: "Add an expense",
    description: "Enter a bill amount and choose how to split it.",
    iconBg: "bg-teal-400",
    image: "/images/add-expense.svg"
  },
  {
    id: 3,
    title: "Everyone pays",
    description: "Each person is charged through their preferred payment method.",
    iconBg: "bg-emerald-500",
    image: "/images/everyone-pays.svg"
  },
  {
    id: 4,
    title: "Virtual card created",
    description: "Use the virtual card for immediate payment anywhere.",
    iconBg: "bg-cyan-500",
    image: "/images/virtual-card.svg"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-gradient-to-r from-teal-400 to-blue-500 text-white text-sm font-medium px-4 py-2 rounded-full mb-4">How it works</span>
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-4 tracking-tight">
            Split bills in 4 simple steps
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Our streamlined process makes splitting bills effortless
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute left-1/2 top-24 bottom-24 w-0.5 bg-gradient-to-b from-blue-500 via-teal-400 to-cyan-500 transform -translate-x-1/2"></div>
          
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className={`lg:grid lg:grid-cols-2 lg:gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Number indicator - visible on mobile/tablet only */}
                  <div className="md:hidden absolute -left-4 top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white" style={{backgroundColor: index === 0 ? '#3B82F6' : index === 1 ? '#2DD4BF' : index === 2 ? '#10B981' : '#06B6D4'}}>
                    {step.id}
                  </div>

                  {/* Text content */}
                  <div className={`relative z-10 lg:flex lg:items-center ${index % 2 === 1 ? 'lg:justify-end' : ''}`}>
                    <div className={`px-6 py-8 md:p-0 rounded-2xl ${index % 2 === 1 ? 'lg:text-right' : ''}`}>
                      <div className={`hidden lg:flex items-center justify-center w-12 h-12 ${step.iconBg} rounded-full text-white font-bold absolute left-1/2 transform -translate-x-1/2 z-20`}>
                        {step.id}
                      </div>
                      <h3 className="text-3xl font-display font-bold mb-4">{step.title}</h3>
                      <p className="text-xl text-gray-600 mb-6">{step.description}</p>
                      <div className={`h-1 w-16 ${step.iconBg} rounded ${index % 2 === 1 ? 'lg:ml-auto' : ''}`}></div>
                    </div>
                  </div>
                  
                  {/* Image/illustration */}
                  <div className="mt-8 lg:mt-0 relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      style={{objectFit: 'cover'}}
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
