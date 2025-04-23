import { initFirebase } from "@/lib/firebase";
import MainPage from "@/components/main-page";
import WelcomePage from "@/components/welcome-page";
import { Main } from "next/document";

initFirebase();

export default function Home() {
  // return <WelcomePage/>
  return <MainPage />;
}
