"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { type User, updateProfile } from "firebase/auth"
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface UserProfile {
  displayName: string
  email: string
  phoneNumber: string
  address: string
  dateOfBirth: string
  gender: string
  height: string
  weight: string
  dietaryPreferences: string
  allergies: string
  medicalConditions: string
  goals: string
}

export default function UserProfileSection({ user }: { user: User }) {
  const [profile, setProfile] = useState<UserProfile>({
    displayName: user.displayName || "",
    email: user.email || "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    height: "",
    weight: "",
    dietaryPreferences: "",
    allergies: "",
    medicalConditions: "",
    goals: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const db = getFirestore()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDocRef = doc(db, "userProfiles", user.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          const userData = userDoc.data() as Partial<UserProfile>
          setProfile((prev) => ({
            ...prev,
            ...userData,
            displayName: user.displayName || userData.displayName || "",
            email: user.email || userData.email || "",
          }))
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [user, db])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      setSuccessMessage("")

      // Update Firebase Auth profile (display name)
      if (user.displayName !== profile.displayName) {
        await updateProfile(user, {
          displayName: profile.displayName,
        })
      }

      // Update Firestore profile
      const userDocRef = doc(db, "userProfiles", user.uid)
      await setDoc(
        userDocRef,
        {
          ...profile,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      setSuccessMessage("Profile updated successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Your Profile</h2>
        <p className="text-muted-foreground">Manage your personal information and health details.</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="health">Health Information</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Update your personal information and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.photoURL || ""} alt={profile.displayName} />
                  <AvatarFallback>
                    {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{profile.displayName || "User"}</h3>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input id="displayName" name="displayName" value={profile.displayName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" value={profile.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" name="phoneNumber" value={profile.phoneNumber} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={profile.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" name="address" value={profile.address} onChange={handleInputChange} rows={3} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
              <CardDescription>
                Provide your health details to help nutritionists create personalized plans.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" name="height" type="number" value={profile.height} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" name="weight" type="number" value={profile.weight} onChange={handleInputChange} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="dietaryPreferences">Dietary Preferences</Label>
                  <Textarea
                    id="dietaryPreferences"
                    name="dietaryPreferences"
                    value={profile.dietaryPreferences}
                    onChange={handleInputChange}
                    placeholder="E.g., vegetarian, vegan, gluten-free, etc."
                    rows={2}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    name="allergies"
                    value={profile.allergies}
                    onChange={handleInputChange}
                    placeholder="List any food allergies or intolerances"
                    rows={2}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="medicalConditions">Medical Conditions</Label>
                  <Textarea
                    id="medicalConditions"
                    name="medicalConditions"
                    value={profile.medicalConditions}
                    onChange={handleInputChange}
                    placeholder="List any relevant medical conditions"
                    rows={2}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="goals">Nutrition Goals</Label>
                  <Textarea
                    id="goals"
                    name="goals"
                    value={profile.goals}
                    onChange={handleInputChange}
                    placeholder="What are your nutrition and health goals?"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        {successMessage && <div className="mr-4 text-green-600 flex items-center">{successMessage}</div>}
        <Button onClick={handleSaveProfile} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  )
}

