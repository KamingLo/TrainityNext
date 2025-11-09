"use client";

import Section from "@/components/sections";
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  if (status === "loading") return <p>Loading...</p>;
  
  if (!isLoggedIn) return <p>Anda belum login.</p>;

  const user = session.user;

  return (
    <Section>
      <h1>Halo, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {(user as any)?.role}</p>
      <p>ID: {(user as any)?.id}</p>
    </Section>
  );
}
