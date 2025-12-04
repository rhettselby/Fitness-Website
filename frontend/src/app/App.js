import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ProfilePage from "@/components/ProfilePage";
import AddWorkoutPage from "@/components/Add_Workout/index";
import "./App.css";
function App() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "/add-workout", element: _jsx(AddWorkoutPage, {}) })] }) }));
}
export default App;
