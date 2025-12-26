import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Home from "@/components/Home";
import { SelectedPage } from "@/shared/types";
import Benefits from "@/components/Benefits";
import Leaderboard from "@/components/Leaderboard";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/footer";
import "@/app/App.css";
import RecentWorkouts from "@/components/RecentWorkouts";

const HomePage = () => {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home);
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
        setSelectedPage(SelectedPage.Home);
      } else {
        setIsTopOfPage(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle hash navigation when coming from other pages
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    if (hash) {
      // Wait for page to render, then scroll to section
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          const hashAsSelectedPage = hash as SelectedPage;
          if (Object.values(SelectedPage).includes(hashAsSelectedPage)) {
            setSelectedPage(hashAsSelectedPage);
          }
        }
      }, 100);
    }
  }, []);

  return (
    <div className="app bg-gray-50">
      <Navbar
        isTopOfPage={isTopOfPage}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
      <Home setSelectedPage={setSelectedPage}/>
      <Leaderboard setSelectedPage={setSelectedPage}/>
      <RecentWorkouts setSelectedPage={setSelectedPage}/>
      <Benefits setSelectedPage={setSelectedPage}/>
      <ContactUs setSelectedPage={setSelectedPage} />
      <Footer />
    </div>
  );
};

export default HomePage;

