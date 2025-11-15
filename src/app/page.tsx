"use client";

import React from 'react';
import { useSession } from 'next-auth/react'; 

import HeroSection from '@/components/charless/HeroSection';
import VideoFeature from '@/components/charless/VideoFeatureSection';
import WhyChooseUs from '@/components/charless/WhyChooseUsSection';
import PartnershipSection from '@/components/charless/PartnershipSection';
import Categories from '@/components/charless/CategoriesSection';
import FeaturedCourses from '@/components/charless/FeaturedCoursesSection';
import Testimonials from '@/components/charless/TestimoniSection';
import CTASection from '@/components/charless/CTASection';

export default function HomePage() {
  const { status } = useSession();

  return (
    <>
      <HeroSection />
      <VideoFeature />
      <WhyChooseUs />
      <PartnershipSection />
      <Categories />
      <FeaturedCourses />
      <Testimonials />
      
      {status === "unauthenticated" && (
        <CTASection />
      )}
    </>
  );
}