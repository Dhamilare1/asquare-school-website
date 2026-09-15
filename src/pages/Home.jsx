import Hero from "../components/Hero";
import NewsTicker from "../components/NewsTicker";
import Welcome from "../components/Welcome";
import Academics from "../pages/Academics";
import QuickAccess from "../components/QuickAccess";
import Extracurricular from "../components/Extracurricular";
import WhyChooseUs from "../components/whyChooseUs";
import Testimonial from "../components/Testimonial";

function Home() {
    return (
       <>
       <Hero />
       <NewsTicker />
       < Welcome/>
       <Academics />
       <Extracurricular />
       <WhyChooseUs />
        <QuickAccess />
        < Testimonial />
       </>
    )
}
export default Home;