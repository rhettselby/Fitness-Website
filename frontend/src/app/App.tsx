
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ProfilePage from "@/components/ProfilePage";
import AddWorkoutPage from "@/components/Add_Workout/index";
import "./App.css";
import WearablesCallback from "@/pages/WearablesCallback";
import ConnectionsPage from "@/components/Connections";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-workout" element={<AddWorkoutPage/>} />
        <Route path="/wearables/callback" element={<WearablesCallback/>} />
        <Route path="/connect" element={<ConnectionsPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;