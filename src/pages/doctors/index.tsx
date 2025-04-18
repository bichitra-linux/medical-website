import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import teamData from "@/lib/team.json";
import { Button } from "@/components/ui/button";
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
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  Search,
  Filter,
  BookOpen,
  Users,
  UserMinus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XCircle, ChevronDown, SlidersHorizontal } from "lucide-react";
import { debounce } from "lodash"; // Add lodash for debouncing

export default function DoctorsPage() {
  // Get doctors from team data with correct structure
  const activeDoctors = teamData.categories.doctors.members;
  const formerDoctors = teamData.categories.formerDoctors.members;

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("nameAsc");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [hasFilters, setHasFilters] = useState(false);

  // Get unique specialties for filter dropdown
  const specialties = [
    "all",
    ...new Set(
      activeDoctors.map((doctor) => doctor.specialty).filter((specialty) => specialty !== undefined)
    ),
  ];

  // Debounce search query changes to improve performance
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query) => {
      setDebouncedSearchQuery(query);
    }, 300),
    []
  );

  // Update debounced search when searchQuery changes
  useEffect(() => {
    debouncedSearch(searchQuery);

    // Check if any filters are applied
    setHasFilters(searchQuery !== "" || specialtyFilter !== "all");
  }, [searchQuery, specialtyFilter, debouncedSearch]);

  // Apply sorting and filtering to active doctors
  const filteredActiveDoctors = activeDoctors
    .filter((doctor) => {
      const matchesSearch =
        debouncedSearchQuery === "" ||
        doctor.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (doctor.bio && doctor.bio.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
        (doctor.specialty &&
          doctor.specialty.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));

      const matchesSpecialty =
        specialtyFilter === "all" || (doctor.specialty && doctor.specialty === specialtyFilter);

      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        case "specialty":
          return (a.specialty || "").localeCompare(b.specialty || "");
        default:
          return 0;
      }
    });

  // Handle clearing all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSpecialtyFilter("all");
    setSortOrder("nameAsc");
  };

  return (
    <>
      <Head>
        <title>Meet Our Doctors | Purna Chandra Diagnostic Center Health Services</title>
        <meta
          name="description"
          content="Meet the experienced physicians and specialists at Purna Chandra Diagnostic Center Health Services. Our team of dedicated doctors provides compassionate and comprehensive care."
        />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Doctors</h1>
            <p className="text-lg text-gray-600 mb-8">
              Meet our team of specialized doctors committed to providing exceptional healthcare
              with compassion and expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          {/* Main search bar with expanded/collapsed state */}
          <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
            <div className="p-4 md:p-5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Search input with clear button */}
                <div className="w-full md:w-1/2 relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                    <Input
                      placeholder="Search by name, specialty or keyword..."
                      className="pl-10 pr-10 border-gray-300 h-11 text-base text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search doctors"
                      type="search"
                      autoComplete="off"
                      spellCheck="false"
                    />
                    {searchQuery && (
                      <button
                        className="absolute right-3 top-3 text-blue-500 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-full"
                        onClick={() => setSearchQuery("")}
                        aria-label="Clear search"
                        type="button"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <label className="sr-only" htmlFor="doctor-search">
                    Search doctors
                  </label>
                </div>

                {/* Sort & Filter controls */}
                <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-3">
                  {/* Sort dropdown */}
                  <div className="w-full md:w-auto">
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger className="w-full border-gray-300 h-11">
                        <div className="flex items-center">
                          <Filter className="h-4 w-4 mr-2 text-gray-800" />
                          <SelectValue placeholder="Sort by" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
                        <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
                        <SelectItem value="specialty">Specialty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Specialty filter */}
                  <div className="w-full md:w-auto">
                    <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                      <SelectTrigger className="w-full md:w-[220px] border-gray-300 h-11">
                        <div className="flex items-center">
                          <SlidersHorizontal className="h-4 w-4 mr-2 text-gray-800" />
                          <SelectValue placeholder="Filter by specialty" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specialties</SelectItem>
                        {specialties
                          .filter((s) => s !== "all")
                          .map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear filters button */}
                  {hasFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-11 whitespace-nowrap border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Active filters display */}
              {hasFilters && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-500 mr-1">Active filters:</span>

                  {specialtyFilter !== "all" && (
                    <Badge className="bg-blue-50 hover:bg-blue-100 text-blue-800 gap-1 pl-2 pr-1 py-1 border-blue-200 group transition-colors">
                      <span>Specialty: {specialtyFilter}</span>
                      <button
                        onClick={() => setSpecialtyFilter("all")}
                        className="ml-1 rounded-full hover:bg-blue-200 p-0.5 transition-colors"
                        aria-label={`Remove ${specialtyFilter} filter`}
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </Badge>
                  )}

                  {searchQuery && (
                    <Badge className="bg-blue-50 hover:bg-blue-100 text-blue-800 gap-1 pl-2 pr-1 py-1 border-blue-200 group transition-colors">
                      <span>Search: {searchQuery}</span>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="ml-1 rounded-full hover:bg-blue-200 p-0.5 transition-colors"
                        aria-label="Clear search query"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </Badge>
                  )}

                  <Button
                    variant="link"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-blue-600 hover:text-blue-800 p-0 h-auto ml-auto"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Results counter - outside the filter box */}
          {hasFilters && (
            <div className="flex justify-center mt-4">
              <p className="text-blue-800 bg-blue-50 inline-block px-4 py-2 rounded-full text-sm font-medium">
                Showing {filteredActiveDoctors.length} of {activeDoctors.length} doctors
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Doctors Listing Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="active" className="w-full">
            {/* Enhanced Tabs Design */}
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white p-1 shadow-md rounded-lg border border-gray-200">
                <TabsTrigger
                  value="active"
                  className="flex items-center gap-2 px-6 py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-blue-50 transition-all duration-200 rounded-md"
                >
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Current Doctors ({activeDoctors.length})</span>
                </TabsTrigger>
                {formerDoctors.length > 0 && (
                  <TabsTrigger
                    value="former"
                    className="flex items-center gap-2 px-6 py-2.5 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-50 transition-all duration-200 rounded-md"
                  >
                    <UserMinus className="h-4 w-4" />
                    <span className="font-medium">Former Doctors ({formerDoctors.length})</span>
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            {/* Improved Active Tab Content */}
            <TabsContent value="active" className="animate-in fade-in-50 duration-300">
              {searchQuery || specialtyFilter !== "all" ? (
                <div className="mb-6 text-center">
                  <p className="text-blue-800 bg-blue-50 inline-block px-4 py-2 rounded-full text-sm font-medium">
                    Showing {filteredActiveDoctors.length} of {activeDoctors.length} doctors
                  </p>
                </div>
              ) : null}

              {filteredActiveDoctors.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-6">
                    <Search className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No doctors found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    No doctors match your current search criteria. Try adjusting your filters.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSpecialtyFilter("all");
                    }}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-colors"
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredActiveDoctors.map((doctor) => (
                    <Card
                      key={doctor.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-200"
                    >
                      <div className="relative h-48 bg-blue-50">
                        {doctor.image ? (
                          <Image
                            src={doctor.image}
                            alt={doctor.imageAlt || doctor.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
                            <User className="h-20 w-20 text-blue-200" />
                          </div>
                        )}
                      </div>

                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl text-gray-800 hover:text-blue-600 transition-colors">
                              <Link
                                href={`/doctors/${doctor.id}`}
                                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
                              >
                                {doctor.name}
                              </Link>
                            </CardTitle>
                            <CardDescription className="mt-1 text-blue-700">
                              {doctor.title}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pb-3">
                        {doctor.specialty && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge
                              variant="secondary"
                              className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                            >
                              {doctor.specialty}
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Improved Former Doctors Tab Content */}
            <TabsContent value="former" className="animate-in fade-in-50 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formerDoctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className="overflow-hidden border-gray-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative h-48 bg-gray-100 grayscale">
                      {doctor.image ? (
                        <Image
                          src={doctor.image}
                          alt={doctor.imageAlt || doctor.name}
                          fill
                          className="object-cover opacity-80"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
                          <User className="h-20 w-20 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-gray-700 to-gray-800 text-white text-xs py-1.5 px-3 text-center font-medium tracking-wide">
                        Former Doctor
                      </div>
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl text-gray-700">{doctor.name}</CardTitle>
                      <CardDescription className="mt-1 text-gray-600">
                        {doctor.title}
                        {doctor.years && (
                          <span className="ml-2 text-gray-500">({doctor.years})</span>
                        )}
                      </CardDescription>
                    </CardHeader>

                    
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need to Schedule an Appointment?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Our team of dedicated physicians is ready to provide you with the care you need.
            Schedule your appointment today.
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

      {/* Schema.org structured data for doctors */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            name: "Purna Chandra Diagnostic Center Health Services",
            url: "https://Purna Chandra Diagnostic Center-example.com",
            physician: activeDoctors.map((doctor) => ({
              "@type": "Physician",
              name: doctor.name,
              medicalSpecialty: doctor.specialty,
              description: doctor.bio,
            })),
          }),
        }}
      />
    </>
  );
}
