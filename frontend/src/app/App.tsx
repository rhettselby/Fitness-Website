import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import "./App.css";
import Home from "@/components/Home";
import { SelectedPage } from "@/shared/types";
import Benefits from "@/components/Benefits";
import OurClasses from "@/components/OurClasses";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/footer";

function App() {
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
  }, []); // empty dependency array: runs only on mount and cleanup on unmount

  return (
    <div className="app bg-gray-50">
      <Navbar
        isTopOfPage={isTopOfPage}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        /* you might also want to pass isTopOfPage if the Navbar changes appearance when not at top */
      />
      <Home setSelectedPage={setSelectedPage}/>
      <Benefits setSelectedPage={setSelectedPage}/>
      <OurClasses setSelectedPage={setSelectedPage}/>
      <ContactUs setSelectedPage={setSelectedPage} />
      <Footer />
    </div>
  );
}

export default App;