import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Linkedin, Quote, Target, Twitter, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import testimonialsData from "@/lib/testimonials.json";
import iconMap from "@/lib/icon-map";
import historyData from "@/lib/history.json";
import valuesData from "@/lib/values.json";
import teamData from "@/lib/team.json";

// Add this function if it doesn't exist yet
const getIconComponent = (iconName: string) => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent className="h-5 w-5 text-blue-600" /> : null;
};

export default function AboutUs() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              About <span className="text-blue-600">Purna Chandra Diagnostic Center</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Dedicated to providing exceptional healthcare services with compassion, expertise, and
              a patient-centered approach since 2005.
            </p>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission & Vision</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Guiding principles that drive our commitment to exceptional healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  {getIconComponent("Stethoscope") ? (
                    <div className="transform scale-[6] text-blue-400 opacity-70">
                      {getIconComponent("Stethoscope")}
                    </div>
                  ) : (
                    <div className="transform scale-[6] text-blue-400 opacity-70">
                      <Heart className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent flex items-end justify-center pb-6">
                  <span className="text-white text-lg font-medium">
                    Excellence in Healthcare Since 2005
                  </span>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-6">
              <Card className="border-0 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 pt-3 pb-3 border-l-4 border-blue-500">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      {getIconComponent("Heart")}
                    </div>
                    <CardTitle className="text-xl text-gray-800">Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 px-5 pb-5">
                  <p className="text-gray-700 leading-relaxed">
                    To provide exceptional healthcare with compassion and expertise, ensuring every
                    patient receives personalized care and achieves the best possible health
                    outcomes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 pt-3 pb-3 border-l-4 border-blue-500">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      {getIconComponent("Target")}
                    </div>
                    <CardTitle className="text-xl text-gray-800">Our Vision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 px-5 pb-5">
                  <p className="text-gray-700 leading-relaxed">
                    To be the leading healthcare provider known for excellence, innovation, and
                    patient-centered care, improving the health and wellbeing of our community.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our History */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              {historyData.title}
            </h2>
            <p className="text-lg text-gray-600 mb-10 text-center">{historyData.subtitle}</p>

            <div className="space-y-0 relative">
              {/* Timeline connector - vertical line */}
              <div
                className="absolute left-0 md:left-1/3 ml-4 md:ml-0 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-transparent"
                style={{ height: "calc(100% - 30px)" }}
              ></div>

              {historyData.milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex flex-col md:flex-row relative pb-12">
                  {/* Timeline dot indicator */}
                  <div className="absolute left-0 md:left-1/3 ml-4 md:ml-0 md:-translate-x-1/2 top-4 w-3 h-3 rounded-full bg-blue-600 shadow-md z-10"></div>

                  <div className="md:w-1/3 mb-4 md:mb-0 pl-10 md:pl-0">
                    <div className="bg-blue-600 text-white rounded-lg p-4 md:mr-6 text-center md:text-right shadow-md">
                      <h3 className="font-bold text-xl">{milestone.year}</h3>
                      <p className="text-blue-100">{milestone.label}</p>
                    </div>
                  </div>

                  <div className="md:w-2/3 pl-10 md:pl-6">
                    <div className="bg-white rounded-lg p-5 shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">
                        {milestone.title}
                      </h4>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Show connector dot at the beginning of the next event (except for the last item) */}
                  {index < historyData.milestones.length - 1 && (
                    <div className="absolute left-0 md:left-1/3 ml-4 md:ml-0 md:-translate-x-1/2 bottom-6 w-3 h-3 rounded-full bg-blue-400 opacity-25"></div>
                  )}
                </div>
              ))}

              {/* Final indicator dot - pointed toward the future */}
              <div className="absolute left-0 md:left-1/3 ml-4 md:ml-0 md:-translate-x-1/2 bottom-0 w-3 h-3 rounded-full bg-blue-300 opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{valuesData.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{valuesData.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuesData.values.map((value) => (
              <div
                key={value.id}
                className="bg-blue-50 p-6 rounded-lg border-t-4 border-blue-600 hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                  {getIconComponent(value.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{teamData.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{teamData.subtitle}</p>
          </div>

          {/* Doctors Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              {teamData.categories.doctors.title}
            </h3>
            <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
              {teamData.categories.doctors.subtitle}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamData.categories.doctors.members.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  <div className="h-64 bg-blue-100 flex items-center justify-center relative">
                    {doctor.image ? (
                      <Image
                        src={doctor.image}
                        alt={doctor.imageAlt || doctor.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="h-24 w-24 text-blue-300">
                        {getIconComponent(doctor.placeholderIcon) || <User className="h-24 w-24" />}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
                    <p className="text-blue-600 mb-1">{doctor.title}</p>
                    {doctor.specialty && (
                      <p className="text-sm text-blue-500 mb-3">Specialty: {doctor.specialty}</p>
                    )}
                    <p className="text-gray-600 mb-4">{doctor.bio}</p>

                    {doctor.socials && doctor.socials.length > 0 && (
                      <div className="flex space-x-3">
                        {doctor.socials.map((social) => (
                          <Link
                            key={social.platform}
                            href={social.url}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            aria-label={`${social.platform} profile for ${doctor.name}`}
                          >
                            {getIconComponent(social.icon) ||
                              (social.platform === "linkedin" ? (
                                <Linkedin className="h-5 w-5" />
                              ) : social.platform === "twitter" ? (
                                <Twitter className="h-5 w-5" />
                              ) : null)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href={teamData.categories.doctors.viewAllLink}
                className="inline-flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-md font-medium transition-all duration-300"
              >
                {teamData.categories.doctors.viewAllText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Staff Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              {teamData.categories.staff.title}
            </h3>
            <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
              {teamData.categories.staff.subtitle}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamData.categories.staff.members.map((staff) => (
                <div
                  key={staff.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  <div className="h-64 bg-blue-100 flex items-center justify-center relative">
                    {staff.image ? (
                      <Image
                        src={staff.image}
                        alt={staff.imageAlt || staff.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="h-24 w-24 text-blue-300">
                        {getIconComponent(staff.placeholderIcon) || <User className="h-24 w-24" />}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800">{staff.name}</h3>
                    <p className="text-blue-600 mb-3">{staff.title}</p>
                    <p className="text-gray-600 mb-4">{staff.bio}</p>

                    {staff.socials && staff.socials.length > 0 && (
                      <div className="flex space-x-3">
                        {staff.socials.map((social) => (
                          <Link
                            key={social.platform}
                            href={social.url}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            aria-label={`${social.platform} profile for ${staff.name}`}
                          >
                            {getIconComponent(social.icon) ||
                              (social.platform === "linkedin" ? (
                                <Linkedin className="h-5 w-5" />
                              ) : social.platform === "twitter" ? (
                                <Twitter className="h-5 w-5" />
                              ) : null)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href={teamData.categories.staff.viewAllLink}
                className="inline-flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-md font-medium transition-all duration-300"
              >
                {teamData.categories.staff.viewAllText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{testimonialsData.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{testimonialsData.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialsData.testimonials.slice(0, 3).map((testimonial) => (
              <Card key={testimonial.id} className="relative border-0 shadow-md">
                <div className="absolute top-4 left-4 text-blue-200">
                  <Quote className="h-10 w-10" />
                </div>
                <CardContent className="pt-10 pb-4">
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </CardContent>
                <CardFooter className="flex items-center pt-2 border-t border-gray-100">
                  <Avatar className="h-10 w-10 bg-blue-100 border-2 border-blue-200">
                    <AvatarFallback className="text-blue-600 font-medium text-sm">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800 text-sm">{testimonial.name}</h4>
                    <p className="text-gray-500 text-xs">{testimonial.duration}</p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {testimonialsData.testimonials.length > 3 && (
            <div className="text-center mt-10">
              <Link
                href="/testimonials"
                className="inline-flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-md font-medium transition-all duration-300"
              >
                View More Testimonials
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
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
