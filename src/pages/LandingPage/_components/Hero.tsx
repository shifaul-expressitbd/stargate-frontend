import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/shared/buttons/button';
import { Heading } from '../../../components/shared/typography/heading';
import { Paragraph } from '../../../components/shared/typography/paragraph';

const styles = `
@keyframes hologram-flicker {
  0%, 100% { opacity: 1; }
  10% { opacity: 0.9; }
  15% { opacity: 1; }
  70% { opacity: 0.95; }
  85% { opacity: 1; }
}

.animate-hologram {
  animation: hologram-flicker 4s ease-in-out infinite;
}
`;

const HologramStyle = () => <style dangerouslySetInnerHTML={{ __html: styles }} />;

const Hero = () => {
    const navigate = useNavigate();
    return (
        <>
            <HologramStyle />
            <section className="relative px-4 py-24 text-center min-h-[70vh] flex flex-col justify-center overflow-hidden">

                <div className="max-w-4xl mx-auto space-y-8 pt-20 relative z-10">
                    <Heading
                        as="h1"
                        variant="h1"
                        className="text-5xl md:text-7xl font-bold text-white animate-fade-in animate-hologram font-orbitron text-shadow-hologram bg-gradient-to-br from-white via-slate-200 to-white bg-clip-text text-transparent tracking-[0.1em] uppercase"
                    >
                        Journey Through the Stargate
                    </Heading>

                    <Paragraph
                        size="lg"
                        className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200 font-poppins text-shadow-blue-glow "
                    >
                        Seamlessly connect across dimensions with our cutting-edge portal technology.
                        Experience instant navigation, infinite possibilities, and pathways to endless opportunities.
                    </Paragraph>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-fade-in-up delay-300">
                        <Button
                            variant="alien-primary"
                            size="lg"
                            title="Get Started Free"
                            className="text-lg px-10 py-5 font-bold shadow-xl"
                            onClick={() => navigate('/register')}
                        >
                            Activate Portal
                        </Button>

                        <Button
                            variant="alien-outline"
                            size="lg"
                            title="Watch Demo"
                            className="text-lg px-10 py-5 font-bold border-2 shadow-xl"
                        >
                            Explore Portal
                        </Button>
                    </div>
                </div>

            </section >
        </>
    );
};

export default Hero;