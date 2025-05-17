import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserMinus,
  Search,
  XCircle,
  Loader2,
  Award,
  SlidersHorizontal,
  Filter,
} from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  nmcNumber: string;
  bio: string;
  image?: string;
  isActive: boolean;
}

export default function DoctorsPage() {
  const [activeDoctors, setActiveDoctors] = useState<Doctor[]>([]);
  const [formerDoctors, setFormerDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // search + filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"nameAsc" | "nameDesc" | "specialty">("nameAsc");

  // debounce search
  const debouncer = useCallback(
    debounce((q: string) => setDebouncedSearch(q), 300),
    []
  );
  useEffect(() => {
    debouncer(searchQuery);
  }, [searchQuery, debouncer]);

  // fetch doctors
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/doctors");
        if (!res.ok) throw new Error(res.statusText);
        const { activeDoctors, formerDoctors } = await res.json();
        setActiveDoctors(activeDoctors);
        setFormerDoctors(formerDoctors);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        <p>Error: {error}</p>
      </div>
    );

  const specialties = ["all", ...Array.from(new Set(activeDoctors.map((d) => d.specialty)))];

  const filtered = activeDoctors
    .filter((d) => {
      const matchesSearch =
        debouncedSearch === "" ||
        d.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        d.specialty.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesSpec = specialtyFilter === "all" || d.specialty === specialtyFilter;
      return matchesSearch && matchesSpec;
    })
    .sort((a, b) => {
      if (sortOrder === "nameAsc") return a.name.localeCompare(b.name);
      if (sortOrder === "nameDesc") return b.name.localeCompare(a.name);
      return a.specialty.localeCompare(b.specialty);
    });

  const hasFilters = searchQuery !== "" || specialtyFilter !== "all";

  const clearAll = () => {
    setSearchQuery("");
    setSpecialtyFilter("all");
    setSortOrder("nameAsc");
  };

  return (
    <>
      <Head>
              <title>Our Doctors | Purna Chandra Diagnostic Center</title>
            </Head>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Our Doctors</h1>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Browse our expert medical team and find the right specialist for you.
        </p>
      </section>

      {/* Search & Filter */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-3 text-blue-500" />
                <Input
                  placeholder="Search by name or specialty…"
                  className="pl-10 pr-10 h-11 text-gray-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-blue-500 hover:text-blue-700"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Sort & Specialty */}
              <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                <Select
                  value={sortOrder}
                  onValueChange={(value) =>
                    setSortOrder(value as "nameAsc" | "nameDesc" | "specialty")
                  }
                >
                  <SelectTrigger className="h-11 border-gray-300 text-gray-600 w-full md:w-48">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2 text-gray-800" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nameAsc">Name (A–Z)</SelectItem>
                    <SelectItem value="nameDesc">Name (Z–A)</SelectItem>
                    <SelectItem value="specialty">Specialty</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                  <SelectTrigger className="h-11 border-gray-300 text-gray-600 w-full md:w-48">
                    <div className="flex items-center">
                      <SlidersHorizontal className="h-4 w-4 mr-2 text-gray-800" />
                      <SelectValue placeholder="Filter by specialty" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {specialties
                      .filter((s) => s !== "all")
                      .map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {hasFilters && (
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Active filter badge */}
          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {specialtyFilter !== "all" && (
                <Badge className="bg-blue-50 text-blue-800 flex items-center gap-1">
                  Specialty: {specialtyFilter}
                  <XCircle
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => setSpecialtyFilter("all")}
                  />
                </Badge>
              )}
              {searchQuery && (
                <Badge className="bg-blue-50 text-blue-800 flex items-center gap-1">
                  Search: {searchQuery}
                  <XCircle className="h-4 w-4 cursor-pointer" onClick={() => setSearchQuery("")} />
                </Badge>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Listings */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="active">
            <TabsList className="flex justify-center gap-2 mb-8">
              <TabsTrigger
                value="active"
                className="px-6 py-2 rounded-lg bg-blue-100 text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Active ({filtered.length})
              </TabsTrigger>
              {formerDoctors.length > 0 && (
                <TabsTrigger
                  value="former"
                  className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 data-[state=active]:bg-gray-600 data-[state=active]:text-white"
                >
                  Former ({formerDoctors.length})
                </TabsTrigger>
              )}
            </TabsList>

            {/* Active */}
            <TabsContent value="active">
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-500">No doctors found.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((d) => (
                    <Card
                      key={d.id}
                      className="overflow-hidden border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
                    >
                      {/* Image container matches staff styling */}
                      <div className="relative h-48 bg-blue-50">
                        {d.image ? (
                          <Image src={d.image} alt={d.name} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
                            <Users className="h-20 w-20 text-blue-200" />
                          </div>
                        )}
                      </div>

                      <CardHeader className="pb-2 px-4">
                        <CardTitle className="text-xl text-gray-800 hover:text-blue-600 transition-colors">
                          <Link href={`/doctors/${d.id}`}>{d.name}</Link>
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {d.qualifications}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="px-4">
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 border border-blue-200"
                        >
                          {d.specialty}
                        </Badge>
                        <p className="mt-3 text-sm text-gray-600 line-clamp-3">{d.bio}</p>
                      </CardContent>

                      <CardFooter className="px-4 pb-4 flex justify-between text-gray-500">
                        <Award className="inline mr-1 text-yellow-500" /> NMC: {d.nmcNumber}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Former Doctors */}
            {formerDoctors.length > 0 && (
              <TabsContent value="former">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formerDoctors.map((d) => (
                    <Card
                      key={d.id}
                      className="overflow-hidden border-gray-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="relative h-48 bg-gray-100 grayscale">
                        {d.image ? (
                          <Image
                            src={d.image}
                            alt={d.name}
                            fill
                            className="object-cover opacity-80"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
                            <UserMinus className="h-20 w-20 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-gray-700 to-gray-800 text-white text-xs py-1.5 px-3 text-center font-medium tracking-wide">
                          Former Doctor
                        </div>
                      </div>

                      <CardHeader className="pt-2 px-4">
                        <CardTitle className="text-lg text-gray-700">{d.name}</CardTitle>
                      </CardHeader>

                      <CardContent className="px-4 pb-4">
                        <Badge className="bg-gray-100 text-gray-700">{d.specialty}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </section>
    </>
  );
}
