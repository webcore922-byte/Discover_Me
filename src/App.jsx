
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import AcceptableTalent from "./pages/AcceptableTalent/AcceptableTalent.jsx";
import SuccessStoriesMo from "./pages/SuccessStoriesMo/SuccessStoriesMo.jsx";
import SuccessStoriesCr from "./pages/SuccessStoriesCr/SuccessStoriesCr.jsx";
import SuccessStoriesLeo from "./pages/SuccessStoriesLeo/SuccessStoriesLeo.jsx";
import Blog from "./pages/Blog/Blog.jsx";
import Footer from "./components/Footer/Footer.jsx";



const App = () => {
  return (
    <div>
   
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/AcceptableTalent" element={<AcceptableTalent />} />
    <Route path="/SuccessStoriesMo" element={<SuccessStoriesMo />} />
    <Route path="/SuccessStoriesCr" element={<SuccessStoriesCr />} />
    <Route path="/SuccessStoriesLeo" element={<SuccessStoriesLeo />} />
    <Route path="/Blog" element={<Blog />} />
  </Routes>
  <Footer />
  </div>
  )
}

export default App
