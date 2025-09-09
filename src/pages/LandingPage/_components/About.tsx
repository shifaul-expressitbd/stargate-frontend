
const About = () => {
    return (
        <div id="about">
            <div className="py-16 px-4 bg-background">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2
                            className="text-3xl font-bold mb-4 text-white animate-hologram font-orbitron text-shadow-white-strong tracking-[0.15em] uppercase"
                        >
                            How It Works
                        </h2>
                        <p className="text-purple-200 max-w-2xl mx-auto font-poppins text-shadow-purple-glow">
                            Journey through dimensions with our simple portal activation process.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="relative mx-auto mb-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 border-2 border-cyan-400/60 flex items-center justify-center group-hover:border-cyan-300 transition-all duration-500 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-400/50">
                                    <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-cyan-400/40">
                                        <span className="text-2xl font-bold text-cyan-300 font-poppins text-shadow-cyan-glow">1</span>
                                    </div>
                                </div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-cyan-300 font-orbitron">Activate Portal</h3>
                            <p className="text-purple-200 leading-relaxed font-poppins">Initialize your interdimensional connection with our secure activation process.</p>
                        </div>
                        <div className="text-center group">
                            <div className="relative mx-auto mb-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-600/30 border-2 border-purple-400/60 flex items-center justify-center group-hover:border-purple-300 transition-all duration-500 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-400/50">
                                    <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-purple-400/40">
                                        <span className="text-2xl font-bold text-purple-300 font-poppins text-shadow-purple-strong-glow">2</span>
                                    </div>
                                </div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-purple-300 font-orbitron">Navigate Dimensions</h3>
                            <p className="text-purple-200 leading-relaxed font-poppins">Use intuitive controls to navigate through different reality layers seamlessly.</p>
                        </div>
                        <div className="text-center group">
                            <div className="relative mx-auto mb-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border-2 border-blue-400/60 flex items-center justify-center group-hover:border-blue-300 transition-all duration-500 shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50">
                                    <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-blue-400/40">
                                        <span className="text-2xl font-bold text-blue-300 font-poppins text-shadow-blue-glow-strong">3</span>
                                    </div>
                                </div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-blue-300 font-orbitron">Expand Horizons</h3>
                            <p className="text-purple-200 leading-relaxed font-poppins">Discover infinite possibilities as you explore new realms of connectivity.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;