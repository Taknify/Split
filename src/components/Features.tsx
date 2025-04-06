"use client";
import React from 'react';
import { Icon } from './icons';
const features = [
  {
    id: 1,
    icon: "split",
    title: "Split Easily",
    description: "Customize expense splits with a tap.",
    color: "bg-blue-500 text-white"
  },
  {
    id: 2,
    icon: "card",
    title: "Virtual Cards",
    description: "Instant group-funded virtual cards.",
    color: "bg-green-500 text-white"
  },
  {
    id: 3,
    icon: "receipt",
    title: "Scan Receipts",
    description: "Automatic expense tracking and split.",
    color: "bg-purple-500 text-white"
  },
  {
    id: 4,
    icon: "track",
    title: "Track Expenses",
    description: "Real-time expense monitoring.",
    color: "bg-orange-500 text-white"
  }
];
const Features = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Split Bills Like Never Before
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className={`${feature.color} rounded-2xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            >
              <div className="mb-4 text-white">
                <Icon name={feature.icon as any} size="lg" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Features;
