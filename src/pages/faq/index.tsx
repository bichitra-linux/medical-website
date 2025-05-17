import React from "react";
import Head from "next/head";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import faqData from "@/lib/faq.json";

export default function FAQPage() {
  return (
    <>
      <Head>
        <title>Frequently Asked Questions | Purna Chandra Diagnostic Center </title>
        
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {faqData.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {faqData.subtitle}
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-blue-100 rounded-lg overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="text-left p-4 text-gray-800 hover:bg-blue-50 data-[state=open]:bg-blue-50 data-[state=open]:text-blue-700 font-medium transition-all flex justify-between items-center">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4 text-gray-700 border-t border-blue-50">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}