import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";


import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AboutThePlatform from "./pages/About/AboutThePlatform/AboutThePlatform.jsx";
import Coaches from "./pages/About/Coaches/Coaches.jsx";
import Login from "./pages/Login/Login.jsx";
import Blog from "./pages/More/Blog/Blog.jsx";
import Dashboard from './pages/More/Dashboard/Dashboard.jsx';
import NewsAndUpdates from './pages/More/NewsAndUpdates/NewsAndUpdates.jsx';
import Profile from './pages/Profile/Profile.jsx';
import FieldTests from './pages/Programs/FieldTests/FieldTests.jsx';
import PrizesAndCompetitions from './pages/Programs/PrizesAndCompetitions/PrizesAndCompetitions.jsx';
import TrainingCamps from './pages/Programs/TrainingCamps/TrainingCamps.jsx';
import Store from './pages/Store/Store.jsx';
import SuccessStories from './pages/SuccessStories/SuccessStories.jsx';
import SuccessStoriesCr from './pages/SuccessStories/SuccessStoriesCr/SuccessStoriesCr.jsx';
import SuccessStoriesMo from './pages/SuccessStories/SuccessStoriesMo/SuccessStoriesMo.jsx';
import SuccessStoriesLeo from './pages/SuccessStories/SuccessStoriesLeo/SuccessStoriesLeo.jsx';
import AcceptableTalent from './pages/Talents/AcceptableTalent/AcceptableTalent';
import AcceptedVideos from './pages/Talents/AcceptedVideos/AcceptedVideos.jsx'
import DecisionMakingSkills from './pages/More/Blog/DecisionMakingSkills/DecisionMakingSkills.jsx';
import Fitness from './pages/More/Blog/Fitness/Fitness.jsx';
import InjuryPrevention from './pages/More/Blog/InjuryPrevention/InjuryPrevention.jsx';
import ProfessionalismAndPersonalMarketing from './pages/More/Blog/ProfessionalismAndPersonalMarketing/ProfessionalismAndPersonalMarketing.jsx';
import ProperNutrition from './pages/More/Blog/ProperNutrition/ProperNutrition.jsx';
import SportsPsychology from './pages/More/Blog/SportsPsychology/SportsPsychology.jsx';
import NotFound from "./pages/NotFound/NotFound.jsx";
import ContactUs from './pages/ContactUs/ContactUs.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy.jsx';


const App = () => {
  return (
    <div>

      <Header />
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about-the-platform" element={<AboutThePlatform />} />
    <Route path="/coaches" element={<Coaches />} />
    <Route path="/login" element={<Login />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/news-and-updates" element={<NewsAndUpdates />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/field-tests" element={<FieldTests />} />
    <Route path="/prizes-and-competitions" element={<PrizesAndCompetitions />} />
    <Route path="/training-camps" element={<TrainingCamps />} />
    <Route path="/store" element={<Store />} />
    <Route path="/success-stories" element={<SuccessStories />} />
    <Route path="/success-stories-cr" element={<SuccessStoriesCr />} />
    <Route path="/success-stories-mo" element={<SuccessStoriesMo />} />
    <Route path="/success-stories-leo" element={<SuccessStoriesLeo />} />
    <Route path="/acceptable-talent" element={<AcceptableTalent />} />
    <Route path="/accepted-videos" element={<AcceptedVideos />} />
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
  
      <Footer />
      
  </div>
  )
}

export default App
