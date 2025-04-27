import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Hero } from "./components/Hero";
import { PhotoAlbum } from "./components/PhotoAlbum";
import { Timeline } from "./components/Timeline";
import { SupabaseAuth } from "./components/SupabaseAuth";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./lib/supabase";

export default function App() {
  const [isSupabaseAuthenticated, setIsSupabaseAuthenticated] = useState(false);
  
  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      setIsSupabaseAuthenticated(!!user);
    }
    
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center">
        <h2 className="text-xl font-serif text-rose-600">Para Amin ❤️</h2>
        <SignOutButton />
      </header>
      <main className="flex-1">
        <Content isSupabaseAuthenticated={isSupabaseAuthenticated} />
      </main>
      <Toaster />
    </div>
  );
}

function Content({ isSupabaseAuthenticated }: { isSupabaseAuthenticated: boolean }) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  // Se o usuário não está autenticado no Supabase, mostrar tela de autenticação Supabase
  if (!isSupabaseAuthenticated) {
    return (
      <div className="p-8">
        <SupabaseAuth />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Unauthenticated>
        <div className="p-8">
          <SignInForm />
        </div>
      </Unauthenticated>
      <Authenticated>
        <Hero />
        <PhotoAlbum />
        <Timeline />
      </Authenticated>
    </div>
  );
}
