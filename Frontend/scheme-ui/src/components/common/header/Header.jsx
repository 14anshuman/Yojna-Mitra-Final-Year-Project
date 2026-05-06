import React, { useState, useContext, useRef, useEffect } from "react";
import { Menu, X, Home, Info, FileText, LogIn, ShieldCheck, User, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import userAuthenticatedAxiosInstance from "../../../services/users/userAuthenticatedAxiosInstance";
import lionlogo from "/assets/lionsymbol.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { logout, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const profileRef = useRef(null);


  const userAxios = userAuthenticatedAxiosInstance("/api/v1/users");

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await userAxios.post("/logout");
    } catch (error) {
      console.error("Logout error:", error.message);
    } finally {
      logout();
      setIsProfileOpen(false);
      navigate("/");
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#74B83E] to-green-500 bg-opacity-30 backdrop-blur-3xl  h-20  flex items-center justify-between  md:pr-8 w-full relative shadow-md z-50">
      {/* Logo Section */}
      <Logo />

      {/* Desktop Navigation */}
      <DesktopNav isAuthenticated={isAuthenticated} />

      {/* Right Section */}
      <RightControls
        userState={{ isAuthenticated, isProfileOpen, setIsProfileOpen }}
        profileRef={profileRef}
        handleLogout={handleLogout}
        menuState={{ isMenuOpen, setIsMenuOpen }}
      />

      {/* Mobile Menu */}
      {isMenuOpen && (
        <MobileMenu isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      )}
    </header>
  );
};

// ---------------------- Subcomponents ---------------------- //

const Logo = () => (
  <Link to="/" className="flex items-center pt-1 ml-4 md:ml-10">
    <img src={lionlogo} alt="Scheme Setu logo" className="w-12 md:w-16 " />
    <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wide">
      Yojna Mitra
    </h1>
  </Link>
);

const DesktopNav = ({ isAuthenticated }) => (
  <nav className="hidden md:flex items-center gap-8">
    <NavItem to="/" icon={<Home className="w-6 h-6" />} label="Home" />
    <NavItem to="/about" icon={<Info className="w-6 h-6" />} label="About" />
    <NavItem to="/schemes" icon={<FileText className="w-6 h-6" />} label="Schemes" />
    <NavItem to="/recommendations" icon={<ShieldCheck className="w-6 h-6" />} label="Suggests" />
     {isAuthenticated && <NavItem to="/my-favorites" icon={<Heart className="w-6 h-6" />} label="My Favorites" />}
  </nav>
);

const RightControls = ({ userState, profileRef, handleLogout, menuState }) => {
  const { isAuthenticated, isProfileOpen, setIsProfileOpen } = userState;
  const { isMenuOpen, setIsMenuOpen } = menuState;

  return (
    <div className="flex items-center gap-4 md:gap-6">
      {isAuthenticated ? (
        <ProfileDropdown
          isOpen={isProfileOpen}
          setIsOpen={setIsProfileOpen}
          profileRef={profileRef}
          handleLogout={handleLogout}
        />
      ) : (
        <LoginLink />
      )}

      {/* Mobile menu button */}
      <button
        aria-label="Toggle menu"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="md:hidden text-white p-2 rounded-full bg-green-700 hover:scale-105 hover:shadow-lg transition"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
};

const ProfileDropdown = ({ isOpen, setIsOpen, profileRef, handleLogout }) => (
  <div ref={profileRef} className="relative">
    <button
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Profile menu"
      className="
        bg-white text-black rounded-full p-2.5
        shadow-sm hover:shadow-md
        hover:bg-gray-50 active:scale-95
        transition-all duration-200
      "
    >
      <User size={22} className="text-[#74B83E]" />
    </button>

   {isOpen && (
  <div
    className="
      fixed right-4 top-16 w-60
      bg-green-50/80 backdrop-blur-lg
      rounded-2xl shadow-2xl
      border border-white/40
      py-2 z-[9999]

      animate-in fade-in zoom-in-95 duration-150
    "
  >
    <Link
      to="/profile"
      onClick={() => setIsOpen(false)}
      className="
        flex items-center gap-3
        px-4 py-3 text-sm font-medium text-gray-700
        hover:bg-gray-100
        transition-colors rounded-xl mx-2
      "
    >
      <User size={16} className="text-gray-500" />
      My Profile
    </Link>

    <div className="my-2 border-t border-gray-500" />

    <div className="px-2 pb-1">
      <button
        onClick={handleLogout}
        className="
          flex items-center justify-center gap-2
          w-full
     
          bg-[#74B83E] text-white text-sm font-semibold
          rounded-xl py-2.5 cursor-pointer

          hover:bg-[#5d9b2b]
          active:scale-[0.98]
           
          
          transition-all duration-150
          shadow-md hover:shadow-lg
        "
      >
        Logout
      </button>
    </div>
  </div>
)}
  </div>
);

// ✅ Updated Login button with guaranteed right spacing
const LoginLink = () => (
  <Link
    to="/login"
    className="bg-white text-gray-800 rounded-full hover:bg-gray-100 py-3 px-8 md:py-3 md:px-3 flex items-center gap-3 text-lg md:text-xl font-semibold   mr-6 md:mr-2"
    style={{ marginRight: "1 rem" }}
  >
    <LogIn size={26} />
    Login
  </Link>
);


const MobileMenu = ({ isAuthenticated, handleLogout }) => (
  <div className="absolute top-20 left-0 right-0 bg-gradient-to-r from-[#74B83E] via-green-200 to-emerald-200 md:hidden z-50 px-6 py-8 flex flex-col gap-5 min-h-screen">
    <MobileNavItem to="/" icon={<Home size={20} />} label="Home" />
    <MobileNavItem to="/about" icon={<Info size={20} />} label="About" />
    <MobileNavItem to="/schemes" icon={<FileText size={20} />} label="Schemes" />
    <MobileNavItem to="/recommendations" icon={<ShieldCheck size={20} />} label="Suggests" />
    <MobileNavItem to="/my-favorites" icon={<Heart size={20} />} label="My Favorites" />

    {!isAuthenticated ? (
      <MobileNavItem
        to="/login"
        icon={<LogIn size={20} />}
        label="Login"
        isPrimary
      />
    ) : (
      <button
        onClick={handleLogout}
        className="w-full bg-white text-green-700 font-bold rounded-full py-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
      >
        Logout
      </button>
    )}
  </div>
);

// ---------------------- Utility Components ---------------------- //

const NavItem = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex flex-col items-center text-white hover:text-green-200 transition"
  >
    {icon}
    <span className="font-semibold mt-1">{label}</span>
  </Link>
);

const MobileNavItem = ({ to, icon, label, isPrimary }) => (
  <Link
    to={to}
    className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-lg transition ${
      isPrimary
        ? "bg-white text-green-700 hover:bg-gray-100"
        : "bg-green-700 text-white hover:bg-green-800"
    }`}
  >
    {icon}
    {label}
  </Link>
);

export default Header;
