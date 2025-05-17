import React from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | Purna Chandra Diagnostic</title>
      </Head>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
              Your Health Is Our <span className="text-blue-600">Priority</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Providing exceptional healthcare with compassion and expertise. Our team of
              specialists is dedicated to your wellbeing and comprehensive care.
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
                <rect
                  x="200"
                  y="300"
                  width="200"
                  height="250"
                  fill="#ffffff"
                  stroke="#60A5FA"
                  strokeWidth="2"
                />
                <rect
                  x="250"
                  y="350"
                  width="100"
                  height="100"
                  fill="#BFDBFE"
                  stroke="#60A5FA"
                  strokeWidth="2"
                />
                <rect
                  x="280"
                  y="400"
                  width="40"
                  height="50"
                  fill="#ffffff"
                  stroke="#60A5FA"
                  strokeWidth="2"
                />
                <rect x="250" y="300" width="100" height="30" fill="#2563EB" />
                <path d="M300 280 L350 300 L250 300 Z" fill="#2563EB" />

                {/* Medical cross symbol */}
                <rect x="600" y="250" width="120" height="30" rx="5" fill="#2563EB" />
                <rect x="645" y="205" width="30" height="120" rx="5" fill="#2563EB" />
                <circle
                  cx="660"
                  cy="265"
                  r="80"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="4"
                  strokeDasharray="10,5"
                />

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
                <path
                  d="M750 440 C745 445, 745 455, 750 460 C755 455, 755 445, 750 440"
                  fill="#2563EB"
                />
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Medical Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We provide a wide range of medical services to meet all your healthcare needs with
              state-of-the-art facilities and expert care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Diagnostic Services",
                description:
                  "Comprehensive diagnostic evaluations using advanced technology to accurately identify medical conditions and guide treatment plans.",
                icon: "🔬",
              },
              {
                title: "Consultation Services",
                description:
                  "Professional medical consultations with experienced healthcare providers for personalized advice and treatment recommendations.",
                icon: "👨‍⚕️",
              },
              {
                title: "Specialist Care",
                description:
                  "Expert care from specialized physicians across various medical disciplines for complex or specific health conditions.",
                icon: "🩺",
              },
              {
                title: "Laboratory Services",
                description:
                  "State-of-the-art laboratory testing facilities providing accurate analysis for disease diagnosis, prevention, and monitoring.",
                icon: "⚗️",
              },
              {
                title: "Foreign Medical Services",
                description:
                  "Comprehensive medical examinations and certification for patients seeking employment abroad, including required tests and documentation for work visas and international placements.",
                icon: "🌎",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                  <span role="img" aria-label={service.title}>
                    {service.icon}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link
                  href="/services"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Learn more <span className="ml-1 text-lg">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Laboratory Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              State-of-the-Art Laboratory
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Advanced diagnostic testing with precision, accuracy, and care
            </p>
            <div className="inline-block mt-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              C Grade Laboratory • Certified by Government of Nepal
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-blue-50 p-8 md:p-10 rounded-xl shadow-md">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Cutting-Edge Diagnostics
                </h3>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  Our advanced laboratory is equipped with the latest diagnostic technology,
                  providing accurate and timely results for a comprehensive range of tests. From
                  routine blood work to specialized molecular diagnostics, our state-of-the-art
                  equipment ensures precision in every analysis. Our laboratory operates under
                  strict quality control protocols, with each test performed by highly trained
                  technicians who combine technical expertise with meticulous attention to detail.
                </p>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  We understand that accurate diagnostics form the foundation of effective
                  healthcare, which is why our laboratory maintains rigorous standards that meet and
                  exceed industry benchmarks. As a{" "}
                  <span className="font-semibold text-blue-700">
                    C Grade laboratory certified by the Government of Nepal
                  </span>
                  , our testing services provide physicians with reliable information for confident
                  diagnoses and treatment decisions. We're committed to quick turnaround times
                  without compromising accuracy, with many routine tests available within days.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="font-medium text-blue-600 mb-1">Automated Analysis</div>
                    <div className="text-sm text-gray-600">High-precision results</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="font-medium text-blue-600 mb-1">Rapid Turnaround</div>
                    <div className="text-sm text-gray-600">Results when you need them</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/laboratory.png"
                  alt="Modern medical laboratory with advanced diagnostic equipment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {/* Overlay with certification information */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent flex flex-col items-center justify-end p-6">
                  <span className="text-white text-xl font-medium">Excellence in Diagnostics</span>
                  <div className="bg-green-800/70 px-4 py-1 rounded-full mt-2">
                    <span className="text-blue-100 text-sm">
                      C Grade • Government of Nepal Certified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-12 p-5 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
            <div className="mr-4 bg-blue-100 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold">Government of Nepal Certified:</span> Our C Grade
              laboratory certification ensures that we meet all national standards for diagnostic
              facilities, equipment calibration, testing procedures, and staff qualifications.
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Quality Healthcare?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-blue-100 text-lg">
            Schedule an appointment today and take the first step towards better health with our
            expert medical team.
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
