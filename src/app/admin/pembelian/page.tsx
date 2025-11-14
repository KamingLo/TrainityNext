"use client";

import AdminHistoryForm from "@/components/joe/pembelian/admin/AdminHistoryForm";
import Section from "@/components/sections";
import "@/styles/joe/pembelian.css";

export default function AdminHistoryPage() {
  return (
    <Section>
      <div className="admin-dashboard">
        <AdminHistoryForm />
      </div>
    </Section>
  );
}
