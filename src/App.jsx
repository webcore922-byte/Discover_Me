import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import { ThemeProvider } from "./contexts/ThemeContext/ThemeContext.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext/AuthContext.jsx";
import { StoreProvider } from "./contexts/StoreContext/StoreContext.jsx";
import StoreLayout from "./components/StoreLayout/StoreLayout";
const Home = lazy(() => import("./pages/Home/Home.jsx"));
const AboutThePlatform = lazy(() => import("./pages/About/AboutThePlatform/AboutThePlatform.jsx"));
const Coaches = lazy(() => import("./pages/About/Coaches/Coaches.jsx"));
const Login = lazy(() => import("./pages/Login/Login.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword/ForgotPassword.jsx"));
const Register = lazy(() => import("./pages/Register/Register.jsx"));
const Blog = lazy(() => import("./pages/More/Blog/Blog.jsx"));
const DashboardMain = lazy(() => import("./pages/More/Dashboard/DashboardMain.jsx"));
const PlayerDetails = lazy(() => import("./pages/More/Dashboard/PlayerDetails/PlayerDetails.jsx"));
const NewsAndUpdates = lazy(() => import("./pages/More/NewsAndUpdates/NewsAndUpdates.jsx"));
const Profile = lazy(() => import("./pages/Profile/Profile.jsx"));
const FieldTests = lazy(() => import("./pages/Programs/FieldTests/FieldTests.jsx"));
const PrizesAndCompetitions = lazy(() => import("./pages/Programs/PrizesAndCompetitions/PrizesAndCompetitions.jsx"));
const TrainingCamps = lazy(() => import("./pages/Programs/TrainingCamps/TrainingCamps.jsx"));
const Store = lazy(() => import("./pages/Store/Store.jsx"));
const Products = lazy(() => import("./pages/Store/Products.jsx"));
const ProductDetails = lazy(() => import("./pages/Store/ProductDetails.jsx"));
const Cart = lazy(() => import("./pages/Store/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Store/Checkout.jsx"));
const MyOrder = lazy(() => import("./pages/Store/MyOrder.jsx"));
const SuccessStories = lazy(() => import("./pages/SuccessStories/SuccessStories.jsx"));
const SuccessStoriesCr = lazy(() => import("./pages/SuccessStories/SuccessStoriesCr/SuccessStoriesCr.jsx"));
const SuccessStoriesMo = lazy(() => import("./pages/SuccessStories/SuccessStoriesMo/SuccessStoriesMo.jsx"));
const SuccessStoriesLeo = lazy(() => import("./pages/SuccessStories/SuccessStoriesLeo/SuccessStoriesLeo.jsx"));
const AcceptableTalent = lazy(() => import("./pages/AcceptableTalent/AcceptableTalent.jsx"));
const DecisionMakingSkills = lazy(() => import("./pages/More/Blog/DecisionMakingSkills/DecisionMakingSkills.jsx"));
const Fitness = lazy(() => import("./pages/More/Blog/Fitness/Fitness.jsx"));
const InjuryPrevention = lazy(() => import("./pages/More/Blog/InjuryPrevention/InjuryPrevention.jsx"));
const ProfessionalismAndPersonalMarketing = lazy(() => import("./pages/More/Blog/ProfessionalismAndPersonalMarketing/ProfessionalismAndPersonalMarketing.jsx"));
const ProperNutrition = lazy(() => import("./pages/More/Blog/ProperNutrition/ProperNutrition.jsx"));
const SportsPsychology = lazy(() => import("./pages/More/Blog/SportsPsychology/SportsPsychology.jsx"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound.jsx"));
const ContactUs = lazy(() => import("./pages/ContactUs/ContactUs.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy/PrivacyPolicy.jsx"));
const NewsDetails = lazy(() => import("./pages/More/NewsAndUpdates/NewsDetails.jsx"));
const ProfilePrizes = lazy(() => import("./pages/Programs/PrizesAndCompetitions/ProfilePrizes/ProfilePrizes.jsx"));
const StoreLoader = () => <div className="flex h-[60vh] w-full items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-gold-main)] border-t-transparent"></div>
  </div>;
const ProtectedAdminRoute = ({
  children
}) => {
  const {
    currentUser,
    loading
  } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-[var(--color-bg-card)] flex items-center justify-center">
        <div className="text-[var(--color-gold-main)] font-black animate-pulse">VERIFYING...</div>
      </div>;
  }
  const allowedRoles = ['super_admin', 'technical_coach', 'camps_manager', 'marketing_admin', 'admin'];
  const hasAccess = currentUser && allowedRoles.includes(currentUser.role);
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }
  return children;
};
const App = () => {
  return <AuthProvider>
      <ThemeProvider>
        <StoreProvider>
      <div className="app-container">
        <Header />
        <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg-card)] flex items-center justify-center text-[var(--color-gold-main)] animate-pulse font-bold">
            LOADING PAGE...
          </div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-the-platform" element={<AboutThePlatform />} />
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blog" element={<Blog />} />
                        <Route path="/dashboard" element={<ProtectedAdminRoute>
                  <DashboardMain />
                </ProtectedAdminRoute>} />
            
            <Route path="/dashboard/player/:id" element={<ProtectedAdminRoute>
                  <PlayerDetails />
                </ProtectedAdminRoute>} />
            
            <Route path="/news-and-updates" element={<NewsAndUpdates />} />
            <Route path="/news/:id" element={<NewsDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/field-tests" element={<FieldTests />} />
            <Route path="/prizes-and-competitions" element={<PrizesAndCompetitions />} />
            <Route path="/training-camps" element={<TrainingCamps />} />

            <Route path="/dashboard/profile-prizes" element={<ProfilePrizes />} />
             <Route element={<StoreLayout />}>
    <Route path="/store" element={<Suspense fallback={<StoreLoader />}>
        <Store />
      </Suspense>} />
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
    </AuthProvider>;
};
export default App;
