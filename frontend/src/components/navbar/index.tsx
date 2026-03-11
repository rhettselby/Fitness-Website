import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SelectedPage } from "@/shared/types";
import Link from "./link";
import useMediaQuery from "@/hooks/useMediaQuery";
import ActionButton from "@/shared/ActionButton";
import Login from "@/components/Login";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";

type Props = {
  isTopOfPage: boolean;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
};

const Navbar = ({ isTopOfPage, selectedPage, setSelectedPage }: Props) => {
  const flexBetween = "flex items-center justify-between";
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  const navbarBackground = isTopOfPage ? "" : "bg-primary-100 drop-shadow";
  const navigate = useNavigate();
  const location = useLocation();

  const isProfilePage = location.pathname === "/profile";
  const isConnectPage = location.pathname === "/connect";

  const checkAuth = async () => {
    const token = TokenService.getAccessToken();
    if (!token) {
      setIsAuthenticated(false);
      setUsername("");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/users/api/check-auth-jwt/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        setIsAuthenticated(false);
        setUsername("");
        TokenService.removeTokens();
        return;
      }
      const data = await response.json();
      if (data.authenticated && data.user) {
        setIsAuthenticated(true);
        setUsername(data.user.username);
        TokenService.setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUsername("");
        TokenService.removeTokens();
      }
    } catch {
      setIsAuthenticated(false);
      setUsername("");
      TokenService.removeTokens();
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuToggled(false);
  }, [location.pathname]);

  const handleLoginSuccess = () => checkAuth();

  const handleLogout = () => {
    TokenService.removeTokens();
    setIsAuthenticated(false);
    setUsername("");
    navigate("/");
  };

  return (
    <nav>
      <div className={`${flexBetween} fixed top-0 z-30 w-full py-6`}>
        <div className={`${navbarBackground} ${flexBetween} mx-auto w-5/6 pr-8`}>
          <div className={`${flexBetween} w-full gap-16`}>

            {/* ── Logo / Brand ── */}
            <button
              onClick={() => navigate("/")}
              className="flex flex-col leading-none text-left bg-transparent border-none cursor-pointer p-0 shrink-0"
            >
              <span
                className={`font-extrabold tracking-tight ${
                  isTopOfPage ? "text-white" : "text-gray-900"
                }`}
                style={{ fontSize: "1.25rem" }}
              >
                Rhett's
              </span>
              <span
                className={`font-bold tracking-wide ${
                  isTopOfPage ? "text-primary-300" : "text-primary-500"
                }`}
                style={{ fontSize: "1rem" }}
              >
                Fitness
              </span>
            </button>

            {/* ── Desktop Nav ── */}
            {isAboveMediumScreens ? (
              <div className={`${flexBetween} w-full`}>
                <div className={`${flexBetween} gap-8 text-sm`}>
                  <Link page="Home" selectedPage={selectedPage} isTopOfPage={isTopOfPage} setSelectedPage={setSelectedPage} />
                  <Link page="Leaderboard" selectedPage={selectedPage} isTopOfPage={isTopOfPage} setSelectedPage={setSelectedPage} />
                  {!isAuthenticated && (
                    <Link page="Contact Us" selectedPage={selectedPage} isTopOfPage={isTopOfPage} setSelectedPage={setSelectedPage} />
                  )}
                  {isAuthenticated && (
                    <button
                      onClick={() => navigate("/add-workout")}
                      className={`font-bold transition duration-500 hover:text-primary-300 ${
                        location.pathname === "/add-workout"
                          ? "text-primary-500"
                          : isTopOfPage ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Add Workout
                    </button>
                  )}
                  {isAuthenticated && (
                    <Link page="Connect" selectedPage={selectedPage} isTopOfPage={isTopOfPage} setSelectedPage={setSelectedPage} />
                  )}
                </div>

                <div className={`${flexBetween} gap-8`}>
                  {isAuthenticated ? (
                    <>
                      <span className={`text-sm font-bold ${isTopOfPage ? "text-white" : "text-gray-900"}`}>
                        Hello, {username}
                      </span>
                      <button
                        onClick={() => navigate("/profile")}
                        className={`text-sm font-bold transition duration-500 cursor-pointer ${
                          isTopOfPage ? "text-white hover:text-primary-300" : "text-gray-900 hover:text-primary-500"
                        }`}
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className={`text-sm font-bold transition duration-500 cursor-pointer ${
                          isTopOfPage ? "text-white hover:text-primary-300" : "text-gray-900 hover:text-primary-500"
                        }`}
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowLogin(true)}
                        className={`text-sm font-bold transition duration-500 cursor-pointer ${
                          isTopOfPage ? "text-white hover:text-primary-300" : "text-gray-900 hover:text-primary-500"
                        }`}
                      >
                        Sign in
                      </button>
                      {!isProfilePage && !isConnectPage && (
                        <ActionButton setSelectedPage={setSelectedPage}>
                          Become a Member
                        </ActionButton>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* ── Hamburger Button (mobile) ── */
              <div className="ml-auto">
                <button
                  aria-label="Open menu"
                  className={`p-2 rounded-md transition ${
                    isTopOfPage ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMenuToggled(true)}
                >
                  {/* Hamburger icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Slide-Out Menu ── */}
      {!isAboveMediumScreens && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
              isMenuToggled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsMenuToggled(false)}
          />

          {/* Drawer */}
          <div
            className={`fixed right-0 top-0 z-50 h-full w-[300px] bg-primary-100 drop-shadow-xl
              transform transition-transform duration-300 ease-in-out
              ${isMenuToggled ? "translate-x-0" : "translate-x-full"}`}
          >
            {/* Close button */}
            <div className="flex justify-end p-5">
              <button
                aria-label="Close menu"
                className="p-2 rounded-md text-gray-900 hover:bg-gray-200 transition"
                onClick={() => setIsMenuToggled(false)}
              >
                {/* X icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Greeting (if logged in) */}
            {isAuthenticated && (
              <div className="px-8 pb-4 text-sm font-bold text-gray-700">
                Hello, {username}
              </div>
            )}

            {/* Menu Items */}
            <div className="flex flex-col gap-6 px-8 text-xl font-bold text-gray-900">
              <Link page="Home" selectedPage={selectedPage} setSelectedPage={setSelectedPage} isTopOfPage={false} />
              <Link page="Leaderboard" selectedPage={selectedPage} setSelectedPage={setSelectedPage} isTopOfPage={false} />
              {!isAuthenticated && (
                <Link page="Contact Us" selectedPage={selectedPage} setSelectedPage={setSelectedPage} isTopOfPage={false} />
              )}
              {isAuthenticated && (
                <button
                  onClick={() => { navigate("/add-workout"); setIsMenuToggled(false); }}
                  className="text-left hover:text-primary-500 transition"
                >
                  Add Workout
                </button>
              )}
              {isAuthenticated && (
                <Link page="Connect" selectedPage={selectedPage} setSelectedPage={setSelectedPage} isTopOfPage={false} />
              )}
              {isAuthenticated && (
                <button
                  onClick={() => { navigate("/profile"); setIsMenuToggled(false); }}
                  className="text-left hover:text-primary-500 transition"
                >
                  Profile
                </button>
              )}

              <div className="border-t border-gray-300 pt-4">
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="text-left hover:text-primary-500 transition">
                    Sign out
                  </button>
                ) : (
                  <div className="flex flex-col gap-4">
                    <button onClick={() => { setShowLogin(true); setIsMenuToggled(false); }} className="text-left hover:text-primary-500 transition">
                      Sign in
                    </button>
                    {!isProfilePage && !isConnectPage && (
                      <ActionButton setSelectedPage={setSelectedPage}>
                        Become a Member
                      </ActionButton>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {showLogin && (
        <Login onLoginSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />
      )}
    </nav>
  );
};

export default Navbar;