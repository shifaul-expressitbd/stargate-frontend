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
    return (
        <>
            <HologramStyle />
            <section className="relative px-4 py-24 text-center min-h-[70vh] flex flex-col justify-center overflow-hidden">

                <div className="max-w-4xl mx-auto space-y-8 pt-20 relative z-10">
                    <Heading
                        as="h1"
                        variant="h1"
                        className="text-5xl md:text-7xl font-bold text-white animate-fade-in animate-hologram font-asimovian text-shadow-hologram bg-gradient-to-br from-white via-slate-200 to-white bg-clip-text text-transparent tracking-[0.1em] uppercase"
                    >
                        Journey Through the Stargate
                    </Heading>

                    <Paragraph
                        size="lg"
                        className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200 font-orbitron text-shadow-blue-glow "
                    >
                        Seamlessly connect across dimensions with our cutting-edge portal technology.
                        Experience instant navigation, infinite possibilities, and pathways to endless opportunities.
                    </Paragraph>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-fade-in-up delay-300">
                        <Button
                            variant="default"
                            size="lg"
                            title="Get Started Free"
                            className="text-lg px-10 py-5 font-semibold font-poppins shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            Activate Portal
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            title="Watch Demo"
                            className="text-lg px-10 py-5 font-semibold font-poppins border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
                        >
                            Explore Portal
                        </Button>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Hero;