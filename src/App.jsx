import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Academics from "./pages/Academics";
import Admission from "./pages/Admission";
import Contact from "./pages/Contact";
import Portal from "./pages/Portal";
import TeacherLogin from "./pages/TeacherLogin";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherAdmin from "./pages/TeacherAdmin";
import BackToTop from './components/BAckToTop';



import './App.css'

function App() {

  return (
    <BrowserRouter>
    <Navbar />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/academics" element={<Academics />} />
      <Route path="/admission" element={<Admission />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/portal" element={<Portal />} />
      <Route path="/teacher-login" element={<TeacherLogin />} />
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/teacher-admin" element={<TeacherAdmin />} />
      <Route path="/admission" element={<Admission />} />
    </Routes>

    <Footer />
    <BackToTop />
    </BrowserRouter>
  )
}

export default App
