import React from "react";
import Head from "next/head";
import termsData from "@/lib/terms.json";

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Services | Purna Chandra Diagnostic Center</title>
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {termsData.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {termsData.subtitle}
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl space-y-12">
          {termsData.sections.map((section) => (
            <div key={section.id}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {section.heading}
              </h2>
              <p className="text-gray-600 whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}