
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ProfilePage from "@/components/ProfilePage";
import AddWorkoutPage from "@/components/Add_Workout/index";
import "./App.css";
import WearablesCallback from "@/pages/WearablesCallback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-workout" element={<AddWorkoutPage/>} />
        <Route path="/wearables/callback" element={<WearablesCallback/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;