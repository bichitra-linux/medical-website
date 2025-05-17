import { useState } from "react";
import contactData from "@/lib/contact.json";
import faqData from "@/lib/faq.json";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Icons
import iconMap from "@/lib/icon-map";
import { Phone, Mail, MapPin, Clock, AlertCircle, Send } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

// Helper function to get icon component from the icon map
const getIconComponent = (iconName: string) => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
};

// Form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(7, {
    message: "Please enter a valid phone number.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    // Simulate API call
    setTimeout(() => {
      // 95% success rate for demo purposes
      if (Math.random() > 0.05) {
        setFormSubmitted(true);
        setFormError(false);
        form.reset();
      } else {
        setFormError(true);
      }
    }, 1000);
  }

  // Toggle FAQ accordions
  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>Contact Us | Purna Chandra Diagnostic Center</title>
        
      </Head>

      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 mb-8">
              We're here to help with all your healthcare needs. Reach out to us with any questions
              or to schedule an appointment.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
              <a
                href="#appointmentForm"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-blue-600 font-medium py-3 px-6 rounded-md border border-blue-200 transition-colors duration-300"
              >
                <Clock className="h-5 w-5" />
                Request Appointment
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="relative mb-8 pb-6 border-b border-gray-100">
                <div className="absolute left-0 top-0 w-2 h-12 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                <div className="pl-5">
                  <h2
                    className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300"
                    id="contact-info-heading"
                  >
                    {contactData.mainInfo.title}
                  </h2>
                  <p
                    className="text-gray-600 max-w-md leading-relaxed"
                    aria-labelledby="contact-info-heading"
                  >
                    {contactData.mainInfo.description}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Phone Numbers */}
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-200 transition-colors duration-300">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                        {contactData.phone.title}
                      </h3>
                      <div className="mt-2 space-y-2">
                        {contactData.phone.contacts.map((contact, index) => (
                          <p key={index} className="text-gray-600">
                            {contact.label}:{" "}
                            <a
                              href={contact.href}
                              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300"
                            >
                              {contact.value}
                            </a>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-200 transition-colors duration-300">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                        {contactData.email.title}
                      </h3>
                      <div className="mt-2 space-y-2">
                        {contactData.email.contacts.map((contact, index) => (
                          <p key={index} className="text-gray-600">
                            {contact.label}:{" "}
                            <a
                              href={contact.href}
                              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300"
                            >
                              {contact.value}
                            </a>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-200 transition-colors duration-300">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                        {contactData.location.title}
                      </h3>
                      <p className="text-gray-600 mt-2 mb-2">
                        {contactData.location.address.line1}
                        <br />
                        {contactData.location.address.line2}
                      </p>
                      <a
                        href={contactData.location.directions.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300"
                      >
                        {contactData.location.directions.text}
                        {iconMap["ArrowUpRight"] && getIconComponent("ArrowUpRight")}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="group">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-200 transition-colors duration-300">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                        {contactData.hours.title}
                      </h3>
                      <div className="text-gray-600 space-y-2 mt-2">
                        {contactData.hours.schedule.map((time, index) => (
                          <p key={index}>
                            {time.days}: <span className="font-medium">{time.hours}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schema.org structured data for SEO */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "MedicalBusiness",
                      name: "Purna Chandra Diagnostic Center Health Services",
                      address: {
                        "@type": "PostalAddress",
                        streetAddress: contactData.location.address.line1,
                        addressLocality: contactData.location.address.line2,
                      },
                      telephone: contactData.phone.contacts[0].value,
                      email: contactData.email.contacts[0].value,
                      openingHoursSpecification: [
                        {
                          "@type": "OpeningHoursSpecification",
                          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                          opens: "08:00",
                          closes: "18:00",
                        },
                        {
                          "@type": "OpeningHoursSpecification",
                          dayOfWeek: "Saturday",
                          opens: "09:00",
                          closes: "13:00",
                        },
                      ],
                    }),
                  }}
                />
              </div>
            </div>

            {/* Contact Form */}
            <div id="appointmentForm">
              <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r pb-6 border-b relative">
                  <div className="absolute left-0 top-0 w-2 h-12 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <div className="pl-5">
                    <CardTitle className="text-2xl text-gray-800">Send Us a Message</CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Fill out this form and we'll get back to you within 24-48 hours.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-8">
                  {formSubmitted ? (
                    <div className="p-6 text-center">
                      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6 animate-fade-in">
                        {iconMap["CheckCircle"] && (
                          <div className="text-green-600 h-10 w-10">
                            {getIconComponent("CheckCircle")}
                          </div>
                        )}
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                        Thank You For Reaching Out
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Your message has been received. A member of our team will review your
                        inquiry and respond within 24-48 business hours.
                      </p>
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          onClick={() => setFormSubmitted(false)}
                          className="px-6"
                        >
                          Send Another Message
                        </Button>
                        <div className="text-sm text-gray-500 mt-1">
                          Reference ID: {`MED-${Math.floor(Math.random() * 900000) + 100000}`}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                        aria-label="Contact request form"
                      >
                        {/* Personal Information Section */}
                        <fieldset className="border border-gray-200 rounded-md p-5 pb-6">
                          <legend className="text-sm font-medium text-gray-700 px-2">
                            Your Information
                          </legend>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700">
                                    Full Name <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Your name"
                                      {...field}
                                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                      aria-required="true"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700">
                                    Email <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="your.email@example.com"
                                      {...field}
                                      type="email"
                                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                      aria-required="true"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700">
                                    Phone <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="(123) 456-7890"
                                      {...field}
                                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                      aria-required="true"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </fieldset>

                        {/* Message Section */}
                        <fieldset className="border border-gray-200 rounded-md p-5 pb-6">
                          <legend className="text-sm font-medium text-gray-700 px-2">
                            Your Message
                          </legend>

                          <div className="space-y-5 mt-3">
                            <FormField
                              control={form.control}
                              name="subject"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700">
                                    Subject <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="What is this regarding?"
                                      {...field}
                                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                      aria-required="true"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="message"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700">
                                    Message <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Please provide details about your inquiry..."
                                      rows={5}
                                      {...field}
                                      className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                      aria-required="true"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </fieldset>

                        {formError && (
                          <Alert variant="destructive" className="animate-shake">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            <AlertTitle>There was a problem sending your message</AlertTitle>
                            <AlertDescription>
                              We apologize for the inconvenience. Please try again later.
                            </AlertDescription>
                          </Alert>
                        )}

                        <Button
                          type="submit"
                          className="w-full py-6 text-base bg-blue-600 hover:bg-blue-700 transition-all"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? (
                            <div className="flex items-center gap-2 justify-center">
                              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                              <span>Sending your message...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 justify-center">
                              <Send className="h-5 w-5" />
                              <span>Send Message</span>
                            </div>
                          )}
                        </Button>

                        <div className="text-xs text-gray-500 text-center mt-4 space-y-2">
                          <p>
                            <span className="text-red-500">*</span> Required fields
                          </p>
                          <p>
                            By submitting this form, you agree to our{" "}
                            <Link href="/privacy" className="text-blue-600 hover:underline">
                              Privacy Policy
                            </Link>{" "}
                            and consent to being contacted regarding your inquiry.
                          </p>
                        </div>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>

              {/* Structured data for form SEO */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ContactPage",
                    name: "Purna Chandra Diagnostic Center Contact Form",
                    description: "Contact form for Purna Chandra Diagnostic Center Health Services",
                    url: "https://Purna Chandra Diagnostic Center.com/contact",
                    contactPoint: {
                      "@type": "ContactPoint",
                      telephone: contactData.phone.contacts[0].value,
                      contactType: "customer service",
                      availableLanguage: ["English"],
                      contactOption: ["TollFree"],
                      areaServed: ["NP"],
                    },
                  }),
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" id="find-us">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Find Us</h2>
            <p className="text-gray-600">
              We're conveniently located in the heart of the Medical District, with easy access to
              public transportation and ample parking.
            </p>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            {/* Interactive Map */}
            <div className="h-[450px] w-full relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.353237477518!2d85.342653!3d27.7063779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1977d82d8263%3A0xc317e4e5a0733b18!2sPurna%20Chandra%20Diagnostic%20Centre%20Pvt.%20Ltd.!5e0!3m2!1sen!2snp!4v1744877859255!5m2!1sen!2snp"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Purna Chandra Diagnostic Center Health Services Location"
                aria-label="Map showing our location in the Medical District"
                className="absolute inset-0"
                onLoad={() => console.log("Map loaded")}
                aria-hidden="false"
              ></iframe>

              {/* Custom Map Marker for better visibility */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-8 z-10 pointer-events-none">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-transparent mt-0.5"></div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-blue-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Purna Chandra Diagnostic Center Pvt. Ltd
                      </h3>
                      <p className="text-gray-600 mt-1">Gaushala, Kathmandu, Nepal</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-blue-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-md font-semibold text-gray-800">Hours of Operation</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-gray-600">
                        {contactData.hours.schedule.map((timeSlot, index) => (
                          <React.Fragment key={index}>
                            <div>{timeSlot.days}:</div>
                            <div>{timeSlot.hours}</div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                    <a
                      href="https://maps.app.goo.gl/LLbj3G2t6W5eRnX28"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                    >
                      <MapPin className="h-4 w-4" />
                      Google Maps
                    </a>
                    <a
                      href="https://www.waze.com/live-map/directions/np/bagmati-province/kathmandu/purna-chandra-diagnostic-centre-pvt.-ltd.?to=place.ChIJY4It2HcZ6zkRGDtzoOXkF8M"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors duration-300"
                    >
                      <div className="h-4 w-4">
                        {iconMap["Navigation"] && getIconComponent("Navigation")}
                      </div>
                      Waze
                    </a>
                    <a
                      href=""
                      
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors duration-300"
                    >
                      <div className="h-4 w-4">
                        {iconMap["Map"] ? (
                          getIconComponent("Map")
                        ) : (
                          <span className="inline-block w-4 h-4 bg-gray-700 rounded-full text-white text-[10px] font-bold items-center justify-center">
                            A
                          </span>
                        )}
                      </div>
                      Apple Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{faqData.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{faqData.subtitle}</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqData.faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-blue-100 rounded-lg overflow-hidden bg-white shadow-sm"
                >
                  <AccordionTrigger className="text-left p-4 text-gray-800 hover:bg-blue-50 data-[state=open]:bg-blue-50 data-[state=open]:text-blue-700 font-medium transition-all flex w-full justify-between items-center">
                    <span>{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 text-gray-700 border-t border-blue-50">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Schedule Your Visit?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Our team is available to assist you with scheduling appointments and answering any
            questions you may have about our services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:+1234567890"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-medium py-3 px-6 rounded-md transition-colors duration-300"
            >
              <Phone className="h-5 w-5" />
              Call For Appointment
            </a>
            <a
              href="#appointmentForm"
              className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md border border-white transition-colors duration-300"
            >
              <Mail className="h-5 w-5" />
              Message Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
