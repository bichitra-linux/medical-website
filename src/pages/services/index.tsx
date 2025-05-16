import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Import services data and icon mapping
import servicesData from "@/lib/services.json";
import faqsData from "@/lib/faq.json";
import iconMap from "@/lib/icon-map";
import Head from "next/head";

// Define types for our services data
interface ServiceData {
  id: string;
  title: string;
  description: string;
  features: string[];
  category: string;
  color: string;
  icon: string;
  badge?: string | null;
  price?: number;
}

interface CategoryData {
  id: string;
  name: string;
  color: string;
}

interface ServicesApiResponse {
  services: ServiceData[];
  categories: CategoryData[];
}

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState<ServiceData[]>([]);
  const [servicesData, setServicesData] = useState<{
    services: ServiceData[];
    categories: CategoryData[];
  }>({
    services: [],
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services data from the API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/service");

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data: ServicesApiResponse = await response.json();
        setServicesData(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on active tab and search term
  useEffect(() => {
    if (!servicesData.services || servicesData.services.length === 0) {
      setFilteredServices([]);
      return;
    }

    let result = [...servicesData.services];

    // Filter by category if not "all"
    if (activeTab !== "all") {
      result = result.filter((service) => service.category === activeTab);
    }

    // Filter by search term if present
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (service) =>
          service.title.toLowerCase().includes(term) ||
          service.description.toLowerCase().includes(term) ||
          service.features.some((feature) => feature.toLowerCase().includes(term))
      );
    }

    setFilteredServices(result);
  }, [activeTab, searchTerm, servicesData.services]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
  };

  // Get color classes based on color name
  const getColorClasses = (color: string) => {
    const colorMap: Record<
      string,
      {
        gradient: string;
        iconBg: string;
        text: string;
        border: string;
        hover: string;
        darkText: string;
      }
    > = {
      blue: {
        gradient: "from-white to-blue-50",
        iconBg: "from-blue-100 to-blue-200",
        text: "text-blue-600",
        border: "border-blue-50",
        hover: "hover:bg-blue-600",
        darkText: "text-blue-800",
      },
      red: {
        gradient: "from-white to-red-50",
        iconBg: "from-red-100 to-red-200",
        text: "text-red-600",
        border: "border-red-50",
        hover: "hover:bg-red-600",
        darkText: "text-red-800",
      },
      green: {
        gradient: "from-white to-green-50",
        iconBg: "from-green-100 to-green-200",
        text: "text-green-600",
        border: "border-green-50",
        hover: "hover:bg-green-600",
        darkText: "text-green-800",
      },
      amber: {
        gradient: "from-white to-amber-50",
        iconBg: "from-amber-100 to-amber-200",
        text: "text-amber-600",
        border: "border-amber-50",
        hover: "hover:bg-amber-600",
        darkText: "text-amber-800",
      },
      purple: {
        gradient: "from-white to-purple-50",
        iconBg: "from-purple-100 to-purple-200",
        text: "text-purple-600",
        border: "border-purple-50",
        hover: "hover:bg-purple-600",
        darkText: "text-purple-800",
      },
    };

    return colorMap[color] || colorMap.blue;
  };

  return (
    <>
      <Head>
        <title>Services | Purna Chandra Diagnostic</title>
      </Head>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Our Medical <span className="text-blue-600">Services</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Comprehensive healthcare services delivered with expertise and compassion to meet your
              health and wellness needs.
            </p>
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-blue-500" />
              </div>
              <Input
                type="text"
                placeholder="Search for a service..."
                className="pl-10 border-blue-200 bg-white/90 text-gray-800 placeholder:text-gray-500 
    focus:border-blue-400 focus:ring-2 focus:ring-blue-300 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            // Loading state
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-12 bg-gray-200 rounded-xl w-full max-w-3xl mx-auto"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-64 bg-gray-100 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : error ? (
            // Error state
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
                <p>{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-blue-600 text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={handleTabChange}
              className="max-w-4xl mx-auto"
            >
              <div className="flex justify-center mb-8 w-full">
                <TabsList className="w-full max-w-4xl grid grid-cols-3 md:grid-cols-6 gap-1.5 p-1.5 bg-white rounded-xl shadow-md border border-blue-100 min-h-[50px]">
                  {servicesData.categories.map((category) => {
                    // Define color classes with typed safety
                    const activeColorClass = (() => {
                      switch (category.color) {
                        case "blue":
                          return "data-[state=active]:bg-blue-600";
                        case "green":
                          return "data-[state=active]:bg-green-600";
                        case "amber":
                          return "data-[state=active]:bg-amber-600";
                        case "purple":
                          return "data-[state=active]:bg-purple-600";
                        case "red":
                          return "data-[state=active]:bg-red-600";
                        default:
                          return "data-[state=active]:bg-blue-600";
                      }
                    })();

                    // Abbreviate "Foreign Medical" on smallest screens
                    const displayName =
                      category.id === "foreign_medical" ? (
                        <span>
                          <span className="hidden sm:inline md:hidden">Foreign Med</span>
                          <span className="hidden md:inline">Foreign Medical</span>
                          <span className="sm:hidden">Foreign</span>
                        </span>
                      ) : (
                        category.name
                      );

                    return (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className={`rounded-lg flex items-center justify-center h-full py-1.5 px-2 text-sm md:text-base font-medium transition-all duration-200
            text-gray-700 hover:bg-gray-50
            data-[state=active]:shadow-sm ${activeColorClass} data-[state=active]:text-white`}
                      >
                        <span className="truncate">{displayName}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredServices.map((service) => {
                    const colorClasses = getColorClasses(service.color);

                    return (
                      <Card
                        key={service.id}
                        className="group border border-blue-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
                      >
                        <CardHeader
                          className={`pb-2 bg-gradient-to-br ${colorClasses.gradient} h-[140px]`}
                        >
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${colorClasses.iconBg} rounded-full flex items-center justify-center mb-3 ${colorClasses.text} shadow-sm group-hover:scale-110 transition-transform`}
                          >
                            {getIconComponent(service.icon)}
                          </div>
                          <div className="flex items-center justify-between">
                            <CardTitle className={`text-xl ${colorClasses.darkText}`}>
                              {service.title}
                            </CardTitle>
                            {service.badge && (
                              <Badge
                                className={`bg-${service.color}-100 ${colorClasses.text} hover:bg-${service.color}-200 shadow-sm`}
                              >
                                {service.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <CardDescription className={`${colorClasses.text} min-h-[20px]`}>
                              {service.description}
                            </CardDescription>
                            <div
                              className={`font-semibold text-base ${colorClasses.darkText} bg-white/80 px-2 py-0.5 rounded-md shadow-sm`}
                            >
                              {service.price ? `Rs. ${service.price}` : "Contact for price"}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="bg-white flex-grow h-[144px] py-4">
                          <ul className="space-y-2 text-gray-700">
                            {service.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <ChevronRight
                                  className={`h-4 w-4 ${colorClasses.text} mt-1 mr-2 flex-shrink-0`}
                                />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>

                        <CardFooter
                          className={`bg-white border-t ${colorClasses.border} mt-auto p-4`}
                        >
                          <Button
                            variant="outline"
                            className={`w-full border-${service.color}-600 ${colorClasses.text} ${colorClasses.hover} hover:text-white transition-colors`}
                          >
                            Learn More <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>

                {filteredServices.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      No services found. Try different search terms or category.
                    </p>
                  </div>
                )}

                {activeTab !== "all" && filteredServices.length > 0 && (
                  <div className="text-center mt-8">
                    <Button
                      variant="default"
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
                      onClick={() => handleTabChange("all")}
                    >
                      View All Services <Plus className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      {/* Service Details */}

      {/* Featured Service */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-100">
                Featured Service
              </Badge>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Telemedicine Consultations</h2>
              <p className="text-gray-600 mb-6">
                Access quality healthcare from the comfort of your home. Our telemedicine services
                provide convenient, secure virtual appointments with our experienced medical
                professionals.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                    <ChevronRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Convenient scheduling options</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                    <ChevronRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Secure, HIPAA-compliant platform</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                    <ChevronRight className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Prescription refills and follow-ups</span>
                </li>
              </ul>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                Book Telemedicine Appointment
              </Button>
            </div>
            <div className="relative h-[400px] bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-blue-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-32 h-32 text-blue-600"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service FAQs */}
      {/* Service FAQs */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{faqsData.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{faqsData.subtitle}</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqsData.faqs.map((faq) => (
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Our Care?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-blue-100 text-lg">
            Schedule an appointment today and let our expert medical team take care of your health
            needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/appointment"
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Book an Appointment
            </Link>
            <Link
              href="/contact"
              className="border border-white text-white hover:bg-blue-500 px-6 py-3 rounded-md font-medium transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
