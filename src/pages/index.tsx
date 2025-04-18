import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
              Your Health Is Our <span className="text-blue-600">Priority</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Providing exceptional healthcare with compassion and expertise. Our team of specialists is dedicated to your wellbeing and comprehensive care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/appointment" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium text-center transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Book Appointment
              </Link>
              <Link 
                href="/services" 
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium text-center transition-all duration-300"
              >
                Our Services
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative h-[350px] sm:h-[400px] w-full">
            <svg 
                viewBox="0 0 1000 800" 
                className="w-full h-full" 
                xmlns="http://www.w3.org/2000/svg"
                aria-labelledby="medicalIllustrationTitle"
                role="img"
              >
                <title id="medicalIllustrationTitle">Medical care illustration</title>
                {/* Background elements */}
                <rect x="100" y="100" width="800" height="600" rx="20" fill="#EBF5FF" />
                <circle cx="500" cy="400" r="250" fill="#DBEAFE" />
                
                {/* Medical building */}
                <rect x="200" y="300" width="200" height="250" fill="#ffffff" stroke="#60A5FA" strokeWidth="2" />
                <rect x="250" y="350" width="100" height="100" fill="#BFDBFE" stroke="#60A5FA" strokeWidth="2" />
                <rect x="280" y="400" width="40" height="50" fill="#ffffff" stroke="#60A5FA" strokeWidth="2" />
                <rect x="250" y="300" width="100" height="30" fill="#2563EB" />
                <path d="M300 280 L350 300 L250 300 Z" fill="#2563EB" />
                
                {/* Medical cross symbol */}
                <rect x="600" y="250" width="120" height="30" rx="5" fill="#2563EB" />
                <rect x="645" y="205" width="30" height="120" rx="5" fill="#2563EB" />
                <circle cx="660" cy="265" r="80" fill="none" stroke="#60A5FA" strokeWidth="4" strokeDasharray="10,5" />
                
                {/* Doctor silhouette */}
                <circle cx="450" cy="220" r="40" fill="#60A5FA" />
                <rect x="425" y="260" width="50" height="80" rx="5" fill="#60A5FA" />
                <rect x="420" y="340" width="60" height="100" rx="5" fill="#93C5FD" />
                <rect x="410" y="380" width="30" height="120" fill="#93C5FD" />
                <rect x="460" y="380" width="30" height="120" fill="#93C5FD" />
                
                {/* Patient silhouette */}
                <circle cx="550" cy="240" r="35" fill="#93C5FD" />
                <rect x="530" y="275" width="40" height="70" rx="5" fill="#93C5FD" />
                <rect x="525" y="345" width="50" height="80" rx="5" fill="#BFDBFE" />
                <rect x="520" y="380" width="25" height="100" fill="#BFDBFE" />
                <rect x="555" y="380" width="25" height="100" fill="#BFDBFE" />
                
                {/* Heartbeat line */}
                <path 
                  d="M200 600 L250 600 L270 550 L300 650 L330 550 L350 600 L800 600" 
                  fill="none" 
                  stroke="#EF4444" 
                  strokeWidth="3" 
                />
                
                {/* Medical icons */}
                <circle cx="750" cy="350" r="30" fill="white" stroke="#60A5FA" strokeWidth="2" />
                <path d="M740 350 L760 350 M750 340 L750 360" stroke="#2563EB" strokeWidth="3" />
                
                <circle cx="820" cy="400" r="25" fill="white" stroke="#60A5FA" strokeWidth="2" />
                <path d="M810 400 L830 400" stroke="#2563EB" strokeWidth="3" />
                
                <circle cx="750" cy="450" r="20" fill="white" stroke="#60A5FA" strokeWidth="2" />
                <path d="M750 440 C745 445, 745 455, 750 460 C755 455, 755 445, 750 440" fill="#2563EB" />
              </svg>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
            <div className="p-6 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-blue-600 text-3xl font-bold mb-2">25+</h3>
              <p className="text-gray-700 font-medium">Experienced Doctors</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-blue-600 text-3xl font-bold mb-2">15k+</h3>
              <p className="text-gray-700 font-medium">Satisfied Patients</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-blue-600 text-3xl font-bold mb-2">10+</h3>
              <p className="text-gray-700 font-medium">Years Experience</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-blue-600 text-3xl font-bold mb-2">24/7</h3>
              <p className="text-gray-700 font-medium">Medical Support</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Medical Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We provide a wide range of medical services to meet all your healthcare needs with state-of-the-art facilities and expert care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Primary Care",
                description: "Comprehensive healthcare services for patients of all ages, including routine check-ups and preventive care.",
                icon: "🩺"
              },
              {
                title: "Specialized Consultations",
                description: "Expert consultations with specialists across different medical disciplines for specific health conditions.",
                icon: "👨‍⚕️"
              },
              {
                title: "Diagnostic Services",
                description: "Advanced diagnostic testing and imaging services to accurately identify health issues.",
                icon: "🔬"
              },
              {
                title: "Emergency Care",
                description: "24/7 emergency medical services for urgent health situations requiring immediate attention.",
                icon: "🚑"
              },
              {
                title: "Surgical Procedures",
                description: "Both routine and complex surgical procedures performed by our skilled surgical team.",
                icon: "⚕️"
              },
              {
                title: "Preventive Medicine",
                description: "Programs focused on preventing illness and promoting overall wellness and health.",
                icon: "❤️"
              }
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                  <span role="img" aria-label={service.title}>{service.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link href="/services" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Learn more <span className="ml-1 text-lg">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Doctors */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Expert Doctors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Meet our team of experienced and dedicated medical professionals committed to providing exceptional care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                specialty: "Cardiologist",
                image: "/images/doctor1.jpg"
              },
              {
                name: "Dr. Michael Chen",
                specialty: "Neurologist",
                image: "/images/doctor2.jpg"
              },
              {
                name: "Dr. Emily Williams",
                specialty: "Pediatrician",
                image: "/images/doctor3.jpg"
              },
              {
                name: "Dr. David Miller",
                specialty: "Orthopedic Surgeon",
                image: "/images/doctor4.jpg"
              }
            ].map((doctor, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="relative h-64 w-full bg-blue-50">
                  <div className="absolute inset-0 flex items-center justify-center text-blue-300 text-5xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{doctor.name}</h3>
                  <p className="text-blue-600 mb-3">{doctor.specialty}</p>
                  <Link 
                    href="/doctors" 
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    View Profile <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/doctors" 
              className="inline-block border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-all duration-300"
            >
              View All Doctors
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience Quality Healthcare?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-blue-100 text-lg">
            Schedule an appointment today and take the first step towards better health with our expert medical team.
          </p>
          <Link 
            href="/appointment" 
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-md font-medium inline-block transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Book Your Appointment
          </Link>
        </div>
      </section>
    </>
  );
}