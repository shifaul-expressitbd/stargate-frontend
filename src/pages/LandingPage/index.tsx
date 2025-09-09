import useTheme from '../../hooks/useTheme';
import About from './_components/About';
import BackgroundAnimation from './_components/BackgroundAnimation';
import FAQ from './_components/FAQ';
import Features from './_components/Features';
import Footer from './_components/Footer';
import Hero from './_components/Hero';
import LandingNavbar from './_components/LandingNavbar';
import Testimonials from './_components/Testimonials';

const LandingPage = () => {
    const { color } = useTheme();

    // Define cursor styles based on theme
    const getCursorStyles = () => {
        if (color === 'cosmic') {
            return 'alien-cursor';
        }
        // Default cursor for other themes
        return 'default';
    };

    return (
        <div className={`min-h-screen w-full relative bg-black ${getCursorStyles()}`}>
            <BackgroundAnimation />
            <LandingNavbar />
            <Hero />
            <div id="features">
                <Features />
            </div>
            <About />
            <div id="testimonials">
                <Testimonials />
            </div>
            <div id="faq">
                <FAQ />
            </div>
            <Footer />
        </div>
    );
};

export default LandingPage;
