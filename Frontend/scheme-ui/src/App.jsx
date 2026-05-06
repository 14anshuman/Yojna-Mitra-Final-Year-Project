
// import './App.css'
import './App.css'
import { Route,Routes } from 'react-router-dom';


import Header from './components/common/header/Header';
import Home from './components/pages/home/Home';
import Footer from './components/common/footer/Footer'
import Schemes from './components/pages/schemes/Schemes';
import SchemeDetails from './components/pages/schemeDetails/SchemeDetails'
import Unauthenticated from './routes/Unauthenticated'
import ProtectedRoutes from './routes/ProtectedRoutes'
import Login from './components/pages/auth/Login'
import SignUp from './components/pages/auth/SignUp';
import Profile from './components/pages/profile/Profile'
import Recommendations from './components/pages/recommendations/Recommendations'
import AboutUs from './components/pages/home/components/AboutUs';
import  Favorites  from './components/pages/favorites/Favorites';
import LatestNews from './components/pages/News/LatestNews';








function App() {


  return (
    <>
      
            
                <Header />
                <div className="App">
                   

                    {/* HEADER-NAVBAR-SIDEBAR */}
                    <div className="fixed z-40 w-full">
                        {/* <div
                            className={`${isSidebarActive ? "active" : ""
                                } sidebar-parent z-50`}
                            ref={sidebarRef}>
                            <Sidebar />
                        </div> */}
                        {/* <Header /> */}
                        {/* <NavBar />
                        <div className="min-h-12 md:hidden block">
                            <SearchBar size={"medium"} />
                        </div> */}
                    </div>
                    


                    {/* CONTENT */}
                    <div className="content-wrapper">
                        <Routes>
                            {/* Public Routes - No Auth Needed */}
                            
                            <Route path="/" element={<Home/>} />
                            
                            {/* Unauthenticated Routes - Only Accessible When Logged Out */}
                            <Route element={<Unauthenticated />}>
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<SignUp />} />
                                <Route path="/about" element={<AboutUs/>}/>
                            </Route>

                            {/* Protected Routes - Only Accessible When Logged In */}
                            <Route element={<ProtectedRoutes />}>
                            
                            <Route path="/schemes" element={<Schemes />} />
                            <Route path="/scheme/:id" element={<SchemeDetails />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/recommendations" element={<Recommendations />} />
                                <Route 
          path="/my-favorites" 
          element={
              <Favorites />
          } 
        />

        <Route path="/latest-news" element={<LatestNews />} />

        
                            </Route>

                        </Routes>
                    </div>

                    {/* FOOTER */}
                    
                </div>
            
        
          
    </>
  )
}

export default App
