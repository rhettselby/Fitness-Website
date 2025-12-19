import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";
import UCLA_Logo from "@/assets/UCLA_Logo.svg";
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
  
  // Check if we're on the profile page
  const isProfilePage = location.pathname === "/profile";

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
        /* Fixed makes the navbar stay at the top when scrolling,
           z-30 ensures it sits above other content,
           w-full gives full width,
           py-6 gives padding on top & bottom */
      >
        <div className={`${navbarBackground} ${flexBetween} mx-auto w-5/6`}>
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
                  alt="UCLA Logo" 
                  src={UCLA_Logo} 
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ 
                    height: '50px',
                    width: 'auto',
                    minWidth: '160px',
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
                  {!isProfilePage && (
                    <>
                      <Link
                        page="Home"
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                      />
                      <Link
                        page="Benefits"
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                      />
                      <Link
                        page="Leaderboard"
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                      />
                      {!isAuthenticated && (
                        <Link
                          page="Contact Us"
                          selectedPage={selectedPage}
                          setSelectedPage={setSelectedPage}
                        />
                      )}
                      
                      {isAuthenticated && (
                        <button
                          onClick={() => navigate("/add-workout")}
                          className={`font-bold transition duration-500 hover:text-primary-300 ${
                            location.pathname === "/add-workout" ? "text-primary-500" : ""
                          }`}
                        >
                          Add Workout
                        </button>
                      )}
                    </>
                  )}
                </div>
                <div className={`${flexBetween} gap-8`}>
                  {isAuthenticated ? (
                    <>
                      <span className="text-sm">Hello, {username}</span>
                      <button
                        onClick={() => navigate("/profile")}
                        className="text-sm hover:text-primary-500 transition duration-500 cursor-pointer"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="text-sm hover:text-primary-500 transition duration-500 cursor-pointer"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowLogin(true)}
                        className="text-sm hover:text-primary-500 transition duration-500 cursor-pointer"
                      >
                        Sign in
                      </button>
                      {!isProfilePage && (
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
                <Bars3Icon className="h-6 w-6 text-white" />
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
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="ml-[33%] flex flex-col gap-10 text-2xl">
            {!isProfilePage ? (
              <>
                <Link
                  page="Home"
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                />
                <Link
                  page="Benefits"
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                />
                <Link
                  page="Leaderboard"
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                />
                {!isAuthenticated && (
                  <Link
                    page="Contact Us"
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
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
              </>
            ) : (
              <button onClick={() => navigate("/")} className="text-left">Home</button>
            )}
            {isAuthenticated && (
              <button onClick={() => navigate("/profile")} className="text-left">Profile</button>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-left">Sign out</button>
            ) : (
              <button onClick={() => setShowLogin(true)} className="text-left">Sign in</button>
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