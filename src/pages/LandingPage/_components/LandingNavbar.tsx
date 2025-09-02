import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AppLogo from '../../../components/app/AppLogo';
import { Button } from '../../../components/shared/buttons/button';
import { Icon } from '../../../components/shared/icons/icon';

const LandingNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigation = [
        { name: 'Features', href: '#features' },
        { name: 'About', href: '#about' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'FAQ', href: '#faq' },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const scrollToSection = (href: string) => {
        const sectionId = href.replace('#', '');
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        closeMenu();
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 dark:bg-black/70 backdrop-blur-md border-b border-blue-500/30 shadow-lg shadow-blue-500/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <AppLogo variant="landing" size="md" />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navigation.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => scrollToSection(item.href)}
                                    className="text-cyan-300 hover:text-blue-400 hover:bg-blue-500/20 px-3 py-2 rounded-md text-sm font-medium font-orbitron transition-all duration-200"
                                    style={{
                                        textShadow: '0 0 5px rgba(34, 211, 238, 0.5)'
                                    }}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Right Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Button
                            variant="alien-outline"
                            size="sm"
                            title="Login"
                            onClick={closeMenu}
                        >
                            <Link to="/login" className="block w-full h-full text-center no-underline">
                                Login
                            </Link>
                        </Button>
                        <Button
                            variant="alien-primary"
                            size="sm"
                            title="Get Started"
                            onClick={closeMenu}
                        >
                            <Link to="/register" className="block w-full h-full text-center no-underline">
                                Get Started
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Icon
                                icon={isMenuOpen ? FaTimes : FaBars}
                                size={20}
                            />
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 dark:bg-gray-900/50 rounded-b-md">
                        {navigation.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => scrollToSection(item.href)}
                                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200 font-orbitron"
                            >
                                {item.name}
                            </button>
                        ))}

                        <div className="pt-4 space-y-2">
                            <Button
                                variant="alien-outline"
                                size="sm"
                                title="Login"
                                className="w-full"
                                onClick={closeMenu}
                            >
                                <Link to="/login" className="block w-full h-full text-center no-underline">
                                    Login
                                </Link>
                            </Button>
                            <Button
                                variant="alien-primary"
                                size="sm"
                                title="Get Started"
                                className="w-full"
                                onClick={closeMenu}
                            >
                                <Link to="/register" className="block w-full h-full text-center no-underline">
                                    Get Started
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default LandingNavbar;