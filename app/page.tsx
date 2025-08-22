"use client"
import Chatbot from "@/components/Chatbot";
import { BackgroundBeamsWithCollision } from "@/components/ui/BackgroundBeams";
import { FloatingDockDemo } from "@/components/FloatingDock";

export default function Home() {
  return (
    <div>
      <BackgroundBeamsWithCollision className="h-screen w-screen">
        <FloatingDockDemo />
        <Chatbot />
      </BackgroundBeamsWithCollision>
    </div>
  );
}
