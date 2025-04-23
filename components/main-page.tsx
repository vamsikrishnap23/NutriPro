"use client";

import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NutritionistSection from "@/components/nutritionist-section";
import AppointmentsSection from "@/components/appointments-section";
import UserProfileSection from "@/components/user-profile-section";
import { LogOut } from "lucide-react";

import logoimg from "@/img/logo2.png";

//changes
import { getFirebaseAuth } from "../../my-app/lib/firebase";

export default function MainPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //changes
  const auth = getFirebaseAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          {/* <Avatar>
            <AvatarImage src="../../my-app/img/logo2.png" alt="Logo"></AvatarImage>
          </Avatar> */}

          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={logoimg} />
              <AvatarFallback>logo</AvatarFallback>
            </Avatar>

            <h1 className="text-2xl font-bold text-[#408001
            ]">NutriPro</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={user.photoURL || ""}
                  alt={user.displayName || "User"}
                />
                <AvatarFallback>
                  {user.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">
                  {user.displayName || user.email}
                </p>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="container px-4 py-6 md:px-6 md:py-8">
        <Tabs defaultValue="nutritionists" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nutritionists">Nutritionists</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="nutritionists" className="space-y-4">
            <NutritionistSection />
          </TabsContent>
          <TabsContent value="appointments" className="space-y-4">
            <AppointmentsSection userId={user.uid} />
          </TabsContent>
          <TabsContent value="profile" className="space-y-4">
            {/* <UserProfileSection user={user} /> */}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
