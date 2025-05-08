import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import teamData from "@/lib/team.json";
import { toast } from "sonner";
import { useAppointmentsSwitch } from "@/context/AppointmentSwitchContext";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";

// Icons
import {
  Calendar as CalendarIcon,
  Clock,
  FileText,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";

// Define the form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  doctorId: z.string({
    required_error: "Please select a doctor",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  visitType: z.enum(["new", "followup"], {
    required_error: "Please select a visit type",
  }),
  reason: z.string().min(10, "Please provide a brief description of your visit reason"),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

// Define the type for our form
type AppointmentFormValues = z.infer<typeof formSchema>;

export default function AppointmentPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { appointmentsEnabled, isLoading: isLoadingSwitch } = useAppointmentsSwitch();

  // Initialize form with react-hook-form
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      visitType: "new",
      reason: "",
      termsAccepted: false,
    },
  });

  // Get doctors from team data
  const doctors = teamData.categories.doctors.members;

  // Generate time slots based on selected date
  const generateTimeSlots = (date: Date) => {
    const day = date.getDay();
    // No appointments on weekends
    if (day === 0 || day === 6) {
      setAvailableTimeSlots([]);
      return;
    }

    // Sample time slots - in a real app, this would come from your backend
    const slots = [
      "9:00 AM",
      "9:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
      "2:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
    ];

    // Randomly remove some slots to simulate availability
    const availableSlots = slots.filter(() => Math.random() > 0.3);
    setAvailableTimeSlots(availableSlots);
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      form.setValue("date", date);
      generateTimeSlots(date);
    } else {
      setAvailableTimeSlots([]);
    }
  };

  // Form submission handler
  const onSubmit: SubmitHandler<AppointmentFormValues> = (values) => {
    setIsSubmitting(true);

    // Use Promise-based approach
    Promise.resolve()
      .then(() => new Promise((resolve) => setTimeout(resolve, 1500)))
      .then(() => {
        // For demonstration - in a real app, you'd send this to your backend
        console.log("Form values:", values);

        // Show success toast
        toast("Appointment Requested", {
          description:
            "We've received your appointment request and will contact you shortly to confirm.",
        });

        // Redirect to confirmation page
        router.push("/appointment/confirmation");
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        toast("Something went wrong", {
          description: "There was a problem submitting your appointment request. Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (isLoadingSwitch) {
    return (
      <>
        <Head>
          <title>Loading Appointments | Purna Chandra Diagnostic Center</title>
        </Head>
        <section className="py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we check appointment availability.</p>
        </section>
      </>
    );
  }

  if (!appointmentsEnabled) {
    return (
      <>
        <Head>
          <title>Appointments Unavailable | Purna Chandra Diagnostic Center</title>
        </Head>
        <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Appointments Temporarily Unavailable
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                We are currently not accepting new appointment requests online. Please check back
                later or contact our office directly for assistance.
              </p>
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-300 shadow-sm hover:shadow"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Schedule an Appointment | Purna Chandra Diagnostic Center Health Services</title>
        <meta
          name="description"
          content="Schedule an appointment with our healthcare professionals at Purna Chandra Diagnostic Center Health Services. Easy online booking for new and existing patients."
        />
      </Head>

      {/* Toast notifications container */}
      <Toaster />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Schedule an Appointment
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Book your visit with our healthcare professionals. We're here to provide you with
              exceptional care.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-md">
                <CardHeader className="bg-blue-50 border-b border-blue-100">
                  <CardTitle className="text-2xl text-blue-800">Request Your Appointment</CardTitle>
                  <CardDescription>
                    Fill out the form below to request an appointment. Required fields are marked
                    with an asterisk (*).
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your first name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your last name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="your.email@example.com"
                                    type="email"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  We'll send confirmation details to this email address.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                  <Input placeholder="(555) 123-4567" type="tel" {...field} />
                                </FormControl>
                                <FormDescription>
                                  We may call this number to confirm your appointment.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Doctor Selection */}
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Select a Provider</h3>
                        <FormField
                          control={form.control}
                          name="doctorId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Doctor *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a doctor" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {doctors.map((doctor) => (
                                    <SelectItem key={doctor.id} value={doctor.id}>
                                      Dr. {doctor.name}{" "}
                                      {doctor.specialty ? `- ${doctor.specialty}` : ""}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Choose the healthcare provider you'd like to see.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Appointment Date and Time */}
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Date & Time</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Preferred Date *</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={`w-full pl-3 text-left font-normal ${
                                          !field.value && "text-muted-foreground"
                                        }`}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Select a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={handleDateSelect}
                                      disabled={(date) => {
                                        // Disable weekends, past dates, and dates more than 3 months ahead
                                        const now = new Date();
                                        const threeMoLater = new Date();
                                        threeMoLater.setMonth(now.getMonth() + 3);
                                        const day = date.getDay();
                                        return (
                                          date < now ||
                                          date > threeMoLater ||
                                          day === 0 ||
                                          day === 6
                                        );
                                      }}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormDescription>
                                  Appointments available Monday through Friday.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="timeSlot"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Time *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  disabled={availableTimeSlots.length === 0}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a time" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {availableTimeSlots.length === 0 ? (
                                      <SelectItem value="none" disabled>
                                        Please select a date first
                                      </SelectItem>
                                    ) : (
                                      availableTimeSlots.map((slot) => (
                                        <SelectItem key={slot} value={slot}>
                                          {slot}
                                        </SelectItem>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Available time slots for the selected date.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Visit Information */}
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Visit Information</h3>
                        <FormField
                          control={form.control}
                          name="visitType"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Visit Type *</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="new" />
                                    </FormControl>
                                    <FormLabel className="font-normal">New Patient</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="followup" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Follow-up / Existing Patient
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="reason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reason for Visit *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please briefly describe the reason for your visit"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This helps us prepare for your appointment. Please include any
                                symptoms or concerns.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Terms and Conditions */}
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Terms & Conditions</h3>

                        <div className="bg-blue-50 rounded-md p-4 text-sm text-blue-800 mb-4">
                          <p>
                            By scheduling an appointment, you understand that this is a request
                            only. Our staff will contact you to confirm the availability of your
                            selected date and time. A 24-hour cancellation notice is required to
                            avoid a potential cancellation fee.
                          </p>
                        </div>

                        <FormField
                          control={form.control}
                          name="termsAccepted"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>I agree to the terms and conditions *</FormLabel>
                                <FormDescription>
                                  By checking this box, you agree to our{" "}
                                  <Link href="/terms" className="text-blue-600 hover:underline">
                                    terms of service
                                  </Link>{" "}
                                  and{" "}
                                  <Link href="/privacy" className="text-blue-600 hover:underline">
                                    privacy policy
                                  </Link>
                                  .
                                </FormDescription>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Submit Button */}
                      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Request Appointment"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
                  <p>Need help? Call us at (555) 123-4567 during our office hours.</p>
                </CardFooter>
              </Card>
            </div>

            {/* Right Column - Information */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      <span>Hours of Operation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium">Monday - Friday</dt>
                        <dd>9:00 AM - 5:00 PM</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Saturday</dt>
                        <dd>Closed</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Sunday</dt>
                        <dd>Closed</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      <span>Appointment Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">What to Bring</h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        <li>Photo ID</li>
                        <li>List of current medications</li>
                        <li>Medical records (if new patient)</li>
                        <li>Referral forms (if applicable)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1">Cancellation Policy</h4>
                      <p className="text-gray-600 text-sm">
                        Please provide at least 24 hours notice if you need to cancel or reschedule
                        your appointment.
                      </p>
                    </div>

                    <div className="pt-2">
                      <Link href="/faq">
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          View FAQs
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-blue-800 flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-blue-600" />
                      <span>Need Assistance?</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-blue-700">
                    <p className="mb-3">
                      Our staff is here to help with any questions about scheduling appointments.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>(555) 123-4567</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>appointments@Purna Chandra Diagnostic Center-example.com</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
