import { Routes, Route, Navigate } from "react-router-dom";
import { lazy,Suspense } from "react";
import Home from "./pages/Home/Home.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AboutThePlatform from "./pages/About/AboutThePlatform/AboutThePlatform.jsx";
import Coaches from "./pages/About/Coaches/Coaches.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx"; 
import Blog from "./pages/More/Blog/Blog.jsx";
import DashboardMain from "./pages/More/Dashboard/DashboardMain.jsx";
import PlayerDetails from "./pages/More/Dashboard/PlayerDetails/PlayerDetails.jsx";
import NewsAndUpdates from "./pages/More/NewsAndUpdates/NewsAndUpdates.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import FieldTests from "./pages/Programs/FieldTests/FieldTests.jsx";
import PrizesAndCompetitions from "./pages/Programs/PrizesAndCompetitions/PrizesAndCompetitions.jsx";
import TrainingCamps from "./pages/Programs/TrainingCamps/TrainingCamps.jsx";
const Store = lazy(() => import("./pages/Store/Store.jsx"));
import Products from "./pages/Store/Products.jsx";
import ProductDetails from "./pages/Store/ProductDetails.jsx";
import Cart from "./pages/Store/Cart.jsx";
import Checkout from "./pages/Store/Checkout.jsx";
import MyOrder from "./pages/Store/MyOrder.jsx";
import SuccessStories from "./pages/SuccessStories/SuccessStories.jsx";
import SuccessStoriesCr from "./pages/SuccessStories/SuccessStoriesCr/SuccessStoriesCr.jsx";
import SuccessStoriesMo from "./pages/SuccessStories/SuccessStoriesMo/SuccessStoriesMo.jsx";
import SuccessStoriesLeo from "./pages/SuccessStories/SuccessStoriesLeo/SuccessStoriesLeo.jsx";
const AcceptableTalent = lazy(() => import("./pages/AcceptableTalent/AcceptableTalent.jsx"));
import DecisionMakingSkills from "./pages/More/Blog/DecisionMakingSkills/DecisionMakingSkills.jsx";
import Fitness from "./pages/More/Blog/Fitness/Fitness.jsx";
import InjuryPrevention from "./pages/More/Blog/InjuryPrevention/InjuryPrevention.jsx";
import ProfessionalismAndPersonalMarketing from "./pages/More/Blog/ProfessionalismAndPersonalMarketing/ProfessionalismAndPersonalMarketing.jsx";
import ProperNutrition from "./pages/More/Blog/ProperNutrition/ProperNutrition.jsx";
import SportsPsychology from "./pages/More/Blog/SportsPsychology/SportsPsychology.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import ContactUs from "./pages/ContactUs/ContactUs.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy.jsx";
import { ThemeProvider } from "./contexts/ThemeContext/ThemeContext.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext/AuthContext.jsx";
import {StoreProvider} from "./contexts/StoreContext/StoreContext.jsx"
import StoreLayout from "./components/StoreLayout/StoreLayout";

import NewsDetails from "./pages/More/NewsAndUpdates/NewsDetails.jsx";
import ProfilePrizes from "./pages/Programs/PrizesAndCompetitions/ProfilePrizes/ProfilePrizes.jsx";

const StoreLoader = () => (
  <div className="flex h-[60vh] w-full items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-gold-main)] border-t-transparent"></div>
  </div>
);


const ProtectedAdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[var(--color-gold-main)] font-black animate-pulse">VERIFYING...</div>
      </div>
    );
  }

  const allowedRoles = ['super_admin', 'technical_coach', 'camps_manager', 'marketing_admin', 'admin'];
  const hasAccess = currentUser && allowedRoles.includes(currentUser.role);

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <StoreProvider>
      <div className="app-container">
        <Header />
        <Suspense fallback={
          <div className="min-h-screen bg-black flex items-center justify-center text-[var(--color-gold-main)] animate-pulse font-bold">
            LOADING PAGE...
          </div>
        }>
          <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="/about-the-platform" element={<AboutThePlatform />} />
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blog" element={<Blog />} />
                        <Route 
              path="/dashboard" 
              element={
                <ProtectedAdminRoute>
                  <DashboardMain />
                </ProtectedAdminRoute>
              } 
            />
            
            <Route 
              path="/dashboard/player/:id" 
              element={
                <ProtectedAdminRoute>
                  <PlayerDetails />
                </ProtectedAdminRoute>
              } 
            />
            
            <Route path="/news-and-updates" element={<NewsAndUpdates />} />
            <Route path="/news/:id" element={<NewsDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/field-tests" element={<FieldTests />} />
            <Route path="/prizes-and-competitions" element={<PrizesAndCompetitions />} />
            <Route path="/training-camps" element={<TrainingCamps />} />

            <Route path="/dashboard/profile-prizes" element={<ProfilePrizes />} />
             <Route element={<StoreLayout />}>
    <Route path="/store" element={
      <Suspense fallback={<StoreLoader />}>
        <Store />
      </Suspense>
    } />
     <Route path="/products" element={<Products />} />
     <Route path="/productDetails/:id" element={<ProductDetails />} />
     <Route path="/cart" element={<Cart />} />
     <Route path="/checkout" element={<Checkout />} />
     <Route path="/myorder" element={<MyOrder />} />
   </Route>
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/success-stories-cr" element={<SuccessStoriesCr />} />
            <Route path="/success-stories-mo" element={<SuccessStoriesMo />} />
            <Route path="/success-stories-leo" element={<SuccessStoriesLeo />} />
            <Route path="/acceptable-talent" element={<AcceptableTalent />} />
            <Route path="/decision-making-skills" element={<DecisionMakingSkills />} />
            <Route path="/fitness" element={<Fitness />} />
            <Route path="/injury-prevention" element={<InjuryPrevention />} />
            <Route path="/professionalism-and-personal-marketing" element={<ProfessionalismAndPersonalMarketing />} />
            <Route path="/proper-nutrition" element={<ProperNutrition />} />
            <Route path="/sports-psychology" element={<SportsPsychology />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        

        <Footer />
      </div>
      </StoreProvider>
      </ThemeProvider>
    </AuthProvider>
    
  );
};

export default App;
