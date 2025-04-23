"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import {
  getFirestore,
  collection,
  query,
  where,
  updateDoc,
  doc,
  onSnapshot,
  type Timestamp,
} from "firebase/firestore";

interface Appointment {
  id: string;
  nutritionistId: string;
  nutritionistName: string;
  date: Timestamp;
  timeSlot: string;
  status: string;
  pricePerHour: number;
}

export default function AppointmentsSection({ userId }: { userId: string }) {
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const db = getFirestore();

  useEffect(() => {
    if (!userId) return;

    const appointmentsRef = collection(db, "appointments");
    const q = query(appointmentsRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const upcoming: Appointment[] = [];
      const past: Appointment[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const appointment = {
          id: doc.id,
          nutritionistId: data.nutritionistId,
          nutritionistName: data.nutritionistName,
          date: data.date,
          timeSlot: data.timeSlot,
          status: data.status,
          pricePerHour: data.pricePerHour,
        };

        const appointmentDate = data.date.toDate();
        const now = new Date();

        if (appointmentDate > now && data.status !== "cancelled") {
          upcoming.push(appointment);
        } else {
          past.push(appointment);
        }
      });

      // Sort upcoming appointments by date (closest first)
      upcoming.sort(
        (a, b) => a.date.toDate().getTime() - b.date.toDate().getTime()
      );

      // Sort past appointments by date (most recent first)
      past.sort(
        (a, b) => b.date.toDate().getTime() - a.date.toDate().getTime()
      );

      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, db]);

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      const appointmentRef = doc(db, "appointments", selectedAppointment.id);
      await updateDoc(appointmentRef, {
        status: "cancelled",
      });

      setCancelConfirmOpen(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const renderAppointmentCard = (
    appointment: Appointment,
    isUpcoming: boolean
  ) => {
    const appointmentDate = appointment.date.toDate();
    const formattedDate = format(appointmentDate, "EEEE, MMMM d, yyyy");

    return (
      <Card key={appointment.id} className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{appointment.nutritionistName}</CardTitle>
              <CardDescription className="mt-1">
                {appointment.status === "cancelled" ? (
                  <Badge variant="destructive">Cancelled</Badge>
                ) : isUpcoming ? (
                  <Badge variant="outline">Upcoming</Badge>
                ) : (
                  <Badge variant="secondary">Completed</Badge>
                )}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="font-medium">&#8377;{appointment.pricePerHour}</p>
              <p className="text-sm text-muted-foreground">per hour</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.timeSlot}</span>
            </div>
          </div>
        </CardContent>
        {isUpcoming && appointment.status !== "cancelled" && (
          <CardFooter className="pt-2">
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
              onClick={() => {
                setSelectedAppointment(appointment);
                setCancelConfirmOpen(true);
              }}
            >
              Cancel Appointment
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Your Appointments</h2>
        <p className="text-muted-foreground">
          View and manage your upcoming and past appointments.
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingAppointments.map((appointment) =>
                renderAppointmentCard(appointment, true)
              )}
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-background p-3 mb-4">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No upcoming appointments
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  You don't have any upcoming appointments scheduled. Browse our
                  nutritionists and book your first appointment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : pastAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastAppointments.map((appointment) =>
                renderAppointmentCard(appointment, false)
              )}
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-background p-3 mb-4">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No past appointments
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  You don't have any past appointments. Once you complete
                  appointments, they will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your appointment with{" "}
              {selectedAppointment?.nutritionistName} on{" "}
              {selectedAppointment?.date &&
                format(
                  selectedAppointment.date.toDate(),
                  "EEEE, MMMM d, yyyy"
                )}{" "}
              at {selectedAppointment?.timeSlot}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">
              Cancellations made less than 24 hours before the appointment may
              incur a fee.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelConfirmOpen(false)}
            >
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={handleCancelAppointment}>
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
