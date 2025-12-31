import { useState, useEffect } from "react";
//import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";
import RhettLogo from "@/assets/RhettLogo.png";
import Logo_Placeholder from "@/assets/Logo.png";
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
  const [logoError, setLogoError] = useState<boolean>(false);
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  const navbarBackground = isTopOfPage ? "" : "bg-primary-100 drop-shadow";
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the profile or connect page
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
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Auth check failed:", response.status);
        setIsAuthenticated(false);
        setUsername("");
        TokenService.removeTokens();
        return;
      }

      const data = await response.json();
      console.log("Auth check response:", data);
      
      if (data.authenticated && data.user) {
        setIsAuthenticated(true);
        setUsername(data.user.username);
        TokenService.setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUsername("");
        TokenService.removeTokens();
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsAuthenticated(false);
      setUsername("");
      TokenService.removeTokens();
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoginSuccess = () => {
    checkAuth(); // Refresh auth status
  };

  const handleLogout = () => {
    TokenService.removeTokens();
    setIsAuthenticated(false);
    setUsername("");
    navigate("/");
  };

  return (
    <nav>
      <div
        className={`${flexBetween} fixed top-0 z-30 w-full py-6`}
      >
        <div className={`${navbarBackground} ${flexBetween} mx-auto w-5/6 pr-8`}>
          <div className={`${flexBetween} w-full gap-16`}>
            {/* Left Side */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center bg-transparent border-none cursor-pointer p-0"
            >
              {logoError ? (
                <img 
                  alt="Logo Placeholder" 
                  src={Logo_Placeholder} 
                  className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: 'transparent' }}
                />
              ) : (
                <img 
                  alt="Logo" 
                  src={RhettLogo} 
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ 
                    height: '50px',
                    width: '130px',
                    minWidth: '130px',
                    backgroundColor: 'transparent',
                    display: 'block',
                    border: 'none',
                    outline: 'none'
                  }}
                  onError={() => setLogoError(true)}
                />
              )}
            </button>

            {/* Right Side */}
            {isAboveMediumScreens ? (
              <div className={`${flexBetween} w-full`}>
                <div className={`${flexBetween} gap-8 text-sm`}>
                  <Link
                    page="Home"
                    selectedPage={selectedPage}
                    isTopOfPage={isTopOfPage}
                    setSelectedPage={setSelectedPage}
                  />
                  <Link
                    page="Leaderboard"
                    selectedPage={selectedPage}
                    isTopOfPage={isTopOfPage}
                    setSelectedPage={setSelectedPage}
                  />
                  {!isAuthenticated && (
                    <Link
                      page="Contact Us"
                      selectedPage={selectedPage}
                      isTopOfPage={isTopOfPage}
                      setSelectedPage={setSelectedPage}
                    />
                  )}
                  
                  {isAuthenticated && (
                    <button
                      onClick={() => navigate("/add-workout")}
                      className={`font-bold transition duration-500 hover:text-primary-300 ${
                        location.pathname === "/add-workout" 
                          ? "text-primary-500" 
                          : (isTopOfPage ? "text-white" : "text-gray-900")
                      }`}
                    >
                      Add Workout
                    </button>
                  )}

                  {isAuthenticated && (
                    <Link
                      page="Connect"
                      selectedPage={selectedPage}
                      isTopOfPage={isTopOfPage}
                      setSelectedPage={setSelectedPage}
                    />
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
              <button
                className="rounded-full bg-secondary-500 p-2"
                onClick={() => setIsMenuToggled(!isMenuToggled)}
              >
                click
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Modal */}
      {!isAboveMediumScreens && isMenuToggled && (
        <div className="fixed right-0 bottom-0 z-40 h-full w-[300px] bg-primary-100 drop-shadow-xl">
          {/*Close Icon */}
          <div className="flex justify-end p-12">
            <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
              click
            </button>
          </div>

          {/* Menu Items */}
          <div className="ml-[33%] flex flex-col gap-10 text-2xl">
            <Link
              page="Home"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              isTopOfPage={isTopOfPage}
            />
            <Link
              page="Leaderboard"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              isTopOfPage={isTopOfPage}
            />
            {!isAuthenticated && (
              <Link
                page="Contact Us"
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
                isTopOfPage={isTopOfPage}
              />
            )}
            {isAuthenticated && (
              <button 
                onClick={() => {
                  navigate("/add-workout");
                  setIsMenuToggled(false);
                }} 
                className="text-left font-bold"
              >
                Add Workout
              </button>
            )}
            {isAuthenticated && (
              <Link
                page="Connect"
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
                isTopOfPage={isTopOfPage}
              />
            )}
            {isAuthenticated && (
              <button 
                onClick={() => {
                  navigate("/profile");
                  setIsMenuToggled(false);
                }} 
                className="text-left font-bold"
              >
                Profile
              </button>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-left font-bold">Sign out</button>
            ) : (
              <button onClick={() => setShowLogin(true)} className="text-left font-bold">Sign in</button>
            )}
          </div>
        </div>
      )}

      {showLogin && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;