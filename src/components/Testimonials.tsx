"use client";
import React from 'react';
import Image from 'next/image';
const testimonials = [
  {
    id: 1,
    name: "Sarah L.",
    avatar: "/images/avatar1.jpg",
    rating: 5,
    text: "SplitApp has transformed how my friends and I handle group expenses. The virtual card feature means no one has to front the bill anymore. Game changer!"
  },
  {
    id: 2,
    name: "Michael T.",
    avatar: "/images/avatar2.jpg",
    rating: 5,
    text: "I use this app with my roommates for all our shared expenses. The interface is intuitive and the automatic payment splitting saves us so much time and awkwardness."
  },
  {
    id: 3,
    name: "Jessica K.",
    avatar: "/images/avatar3.jpg",
    rating: 4,
    text: "Our team uses SplitApp for client dinners and travel expenses. The receipt scanning feature is incredibly accurate, and the virtual cards integrate perfectly with our accounting software."
  }
];
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};
const Testimonials = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Don't just take our word for it — hear from some of our satisfied users
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="relative h-12 w-12 mr-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="rounded-full"
                    fill
                    style={{objectFit: 'cover'}}
                  />
                </div>
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <StarRating rating={testimonial.rating} />
                </div>
              </div>
              <p className="text-gray-600 italic">{testimonial.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <div className="inline-flex items-center p-1 bg-gray-100 rounded-full">
            <div className="bg-white rounded-full px-6 py-2 shadow-sm">
              <span className="font-medium">4.9/5</span>
            </div>
            <div className="px-6">
              <span className="text-gray-600">Average user rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
