import { useState } from "react";
import Navbar from "@/components/navbar";
import { SelectedPage } from "@/shared/types";
import WearablesSettings from "@/components/WearablesSettings/WearablesSettings";

const ConnectionsPage = () => {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Connect);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isTopOfPage={false}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
      <div className="pt-20 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-500 mb-6 md:mb-8">
            Connect Your Devices
          </h1>

          <WearablesSettings />
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPage;