import { redirect } from "next/navigation";

export default function Home() {
  // Immediately redirect anyone hitting the root URL to the registration page.
  // Note: If the user is already logged in (has an AX_SESSION cookie), 
  // your middleware.ts will automatically intercept this and redirect 
  // them to /onboarding/setup instead.
  redirect("/register");
}