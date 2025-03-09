"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Mock data for nutritionists
const nutritionists = [
  {
    id: "1",
    name: "Dr. Vamsi Krishna",
    specialty: "Weight Management",
    experience: 8,
    pricePerHour: 85,
    rating: 4.8,
    image: "../img/doc.png",
    bio: "Dr. Vamsi Krishna is a certified nutritionist with 8 years of experience in weight management. He has guided numerous clients in achieving sustainable weight loss and metabolic health through customized diet plans.",
    education:
      "Ph.D. in Nutritional Sciences, All India Institute of Medical Sciences (AIIMS)",
    availability: ["Monday", "Tuesday", "Thursday", "Friday"],
  },
  {
    id: "2",
    name: "Harshil R",
    specialty: "Sports Nutrition",
    experience: 6,
    pricePerHour: 75,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=200",
    bio: "Harshil R is a sports nutrition expert who works with athletes to enhance performance and recovery through science-backed dietary strategies. His meal plans are designed to optimize energy and endurance.",
    education:
      "M.Sc. in Sports Nutrition, National Institute of Nutrition (NIN), Hyderabad",
    availability: ["Monday", "Wednesday", "Friday", "Saturday"],
  },
  {
    id: "3",
    name: "Dr. Praveen",
    specialty: "Digestive Health",
    experience: 10,
    pricePerHour: 90,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=200",
    bio: "Dr. Praveen specializes in gut health and digestive disorders. With a decade of experience, he helps patients manage conditions like IBS, acidity, and food intolerances through tailored nutrition plans.",
    education:
      "M.D. in Gastroenterology, Postgraduate Institute of Medical Education and Research (PGIMER), Chandigarh",
    availability: ["Tuesday", "Wednesday", "Thursday", "Saturday"],
  },
  {
    id: "4",
    name: "Sathwik",
    specialty: "Plant-Based Nutrition",
    experience: 5,
    pricePerHour: 70,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=200",
    bio: "Sathwik is a dedicated advocate of plant-based diets. He helps clients transition to a vegetarian or vegan lifestyle while ensuring they meet all essential nutrient requirements.",
    education: "B.Sc. in Nutrition, Manipal Academy of Higher Education (MAHE)",
    availability: ["Monday", "Tuesday", "Thursday", "Sunday"],
  },
  {
    id: "5",
    name: "Rohith",
    specialty: "Clinical Nutrition",
    experience: 7,
    pricePerHour: 80,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=200",
    bio: "Rohith specializes in clinical nutrition, working with patients managing chronic conditions like diabetes, hypertension, and heart disease. He focuses on medical nutrition therapy for better health outcomes.",
    education:
      "M.Sc. in Clinical Nutrition, Tamil Nadu Dr. M.G.R. Medical University",
    availability: ["Monday", "Wednesday", "Friday", "Saturday"],
  },
];

export default function NutritionistSection() {
  const [selectedNutritionist, setSelectedNutritionist] = useState(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const auth = getAuth();
  const db = getFirestore();

  const handleBookAppointment = async () => {
    if (!date || !timeSlot) {
      setBookingError("Please select both date and time");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        setBookingError("You must be logged in to book an appointment");
        return;
      }

      await addDoc(collection(db, "appointments"), {
        userId: user.uid,
        nutritionistId: selectedNutritionist.id,
        nutritionistName: selectedNutritionist.name,
        date: date,
        timeSlot: timeSlot,
        status: "upcoming",
        createdAt: serverTimestamp(),
        pricePerHour: selectedNutritionist.pricePerHour,
      });

      setBookingSuccess(true);
      setBookingError("");
      setDate(undefined);
      setTimeSlot("");
    } catch (error) {
      console.error("Error booking appointment:", error);
      setBookingError("Failed to book appointment. Please try again.");
    }
  };

  const resetBookingState = () => {
    setBookingSuccess(false);
    setBookingError("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Our Nutritionists</h2>
        <p className="text-muted-foreground">
          Browse our team of certified nutritionists and book an appointment
          with the expert that matches your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nutritionists.map((nutritionist) => (
          <Card key={nutritionist.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={nutritionist.image || "/placeholder.svg"}
                  alt={nutritionist.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{nutritionist.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {nutritionist.specialty}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  {nutritionist.rating}
                </Badge>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">
                    {nutritionist.experience} years
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">
                    &#8377;{nutritionist.pricePerHour}/hour
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedNutritionist(nutritionist);
                      resetBookingState();
                    }}
                  >
                    View Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  {selectedNutritionist && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="text-2xl">
                          {selectedNutritionist.name}
                        </DialogTitle>
                        <DialogDescription className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            {selectedNutritionist.rating}
                          </Badge>
                          <span>{selectedNutritionist.specialty}</span>
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 py-4">
                        <div className="flex flex-col items-center gap-4">
                          <Avatar className="h-24 w-24">
                            <AvatarImage
                              src={selectedNutritionist.image}
                              alt={selectedNutritionist.name}
                            />
                            <AvatarFallback>
                              {selectedNutritionist.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-center">
                            <p className="font-medium">
                              &#8377;{selectedNutritionist.pricePerHour}/hour
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {selectedNutritionist.experience} years experience
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">About</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedNutritionist.bio}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium">Education</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedNutritionist.education}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium">Available on</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedNutritionist.availability.map((day) => (
                                <Badge key={day} variant="secondary">
                                  {day}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {bookingSuccess ? (
                        <div className="bg-green-50 p-4 rounded-md text-green-800">
                          <p className="font-medium">
                            Appointment booked successfully!
                          </p>
                          <p className="text-sm mt-1">
                            You can view and manage your appointments in the
                            Appointments tab.
                          </p>
                          <Button
                            className="mt-4 w-full"
                            variant="outline"
                            onClick={resetBookingState}
                          >
                            Book Another Appointment
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="date">Select Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !date && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : "Pick a date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    disabled={(date) =>
                                      date < new Date() ||
                                      !selectedNutritionist.availability.includes(
                                        format(date, "EEEE")
                                      )
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="time">Select Time</Label>
                              <Select
                                onValueChange={setTimeSlot}
                                value={timeSlot}
                              >
                                <SelectTrigger id="time" className="w-full">
                                  <SelectValue placeholder="Select time slot" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="09:00 AM">
                                    09:00 AM
                                  </SelectItem>
                                  <SelectItem value="10:00 AM">
                                    10:00 AM
                                  </SelectItem>
                                  <SelectItem value="11:00 AM">
                                    11:00 AM
                                  </SelectItem>
                                  <SelectItem value="01:00 PM">
                                    01:00 PM
                                  </SelectItem>
                                  <SelectItem value="02:00 PM">
                                    02:00 PM
                                  </SelectItem>
                                  <SelectItem value="03:00 PM">
                                    03:00 PM
                                  </SelectItem>
                                  <SelectItem value="04:00 PM">
                                    04:00 PM
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {bookingError && (
                            <p className="text-sm text-red-500 mt-2">
                              {bookingError}
                            </p>
                          )}

                          <DialogFooter className="mt-4">
                            <Button
                              onClick={handleBookAppointment}
                              className="w-full"
                            >
                              Book Appointment
                            </Button>
                          </DialogFooter>
                        </>
                      )}
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
