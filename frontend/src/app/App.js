import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ProfilePage from "@/components/ProfilePage";
import AddWorkoutPage from "@/components/Add_Workout/index";
import "./App.css";
import WearablesCallback from "@/pages/WearablesCallback";
import ConnectionsPage from "@/components/Connections";
import Groups from "@/components/Groups/groups";
import GroupLeaderboard from "@/components/Groups/groupLeaderboard";
function App() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "/add-workout", element: _jsx(AddWorkoutPage, {}) }), _jsx(Route, { path: "/wearables/callback", element: _jsx(WearablesCallback, {}) }), _jsx(Route, { path: "/connect", element: _jsx(ConnectionsPage, {}) }), _jsx(Route, { path: "/groups", element: _jsx(Groups, {}) }), _jsx(Route, { path: "/groups/:id/leaderboard", element: _jsx(GroupLeaderboard, {}) })] }) }));
}
export default App;
