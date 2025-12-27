import AnchorLink from "react-anchor-link-smooth-scroll";
import { useNavigate, useLocation } from "react-router-dom";
import { SelectedPage } from "@/shared/types";

type Props = {
  page: string;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
  isTopOfPage: boolean;
};

const Link = ({ page, selectedPage, setSelectedPage, isTopOfPage }: Props) => {
  const lowerCasePage = page.toLowerCase().replace(/ /g, "") as SelectedPage;
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Determine text color based on scroll position and selection
  const textColor = selectedPage === lowerCasePage 
    ? "text-primary-500" 
    : (isTopOfPage ? "text-white" : "text-gray-900");

  // Special handling for "Connect" page - it's a route, not an anchor
  if (lowerCasePage === SelectedPage.Connect) {
    return (
      <button
        className={`${textColor} font-bold transition duration-500 hover:text-primary-300 cursor-pointer`}
        onClick={() => {
          setSelectedPage(lowerCasePage);
          navigate("/connect");
        }}
      >
        {page}
      </button>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    setSelectedPage(lowerCasePage);
    
    // If we're not on the home page, navigate to home with hash, then scroll
    if (!isHomePage) {
      e.preventDefault();
      navigate(`/#${lowerCasePage}`);
      // Scroll after navigation completes
      setTimeout(() => {
        const element = document.getElementById(lowerCasePage);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  // If on home page, use AnchorLink for smooth scrolling
  if (isHomePage) {
    return (
      <AnchorLink
        className={`${textColor} font-bold transition duration-500 hover:text-primary-300`}
        href={`#${lowerCasePage}`}
        onClick={() => setSelectedPage(lowerCasePage)}
      >
        {page}
      </AnchorLink>
    );
  }

  // If on other pages, use a button that navigates to home page
  return (
    <button
      className={`${textColor} font-bold transition duration-500 hover:text-primary-300 cursor-pointer`}
      onClick={handleClick}
    >
      {page}
    </button>
  );
};

export default Link;