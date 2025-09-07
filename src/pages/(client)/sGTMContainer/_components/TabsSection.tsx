import { Button } from '@/components/shared/buttons/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/cards/card';
import { Badge } from '@/components/shared/data-display/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/data-display/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/navigation/tabs';
import { FaCogs, FaRocket } from 'react-icons/fa';

interface Container {
    id: string;
    name: string;
    status: string;
    config?: string;
    region?: string;
}

interface TabsSectionProps {
    container: Container;
}

export const TabsSection = ({ container }: TabsSectionProps) => {
    return (

        <Tabs variant='cosmic' defaultValue="settings">
            <TabsList className="bg-black/20 border border-cyan-400/20">
                <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
                    <FaCogs />
                    Settings
                </TabsTrigger>
                <TabsTrigger value="power-ups" className="flex items-center gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
                    Power-Ups
                    <span className="w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
                    Analytics
                </TabsTrigger>
                <TabsTrigger value="subscription" className="flex items-center gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
                    Subscription
                </TabsTrigger>
                <TabsTrigger value="logs" className="flex items-center gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
                    Logs
                </TabsTrigger>
                <TabsTrigger value="monitoring" className="flex items-center gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
                    Monitoring
                </TabsTrigger>
                <TabsTrigger value="store" className="flex items-center gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
                    Store
                </TabsTrigger>
                <TabsTrigger value="connections" className="flex items-center gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
                    Connections
                </TabsTrigger>
            </TabsList>

            {/* Settings Tab Content */}
            <TabsContent value="settings">
                {/* Cosmic Support Card */}
                <Card variant="elevated" className="mb-6 border-cyan-400/30 bg-gradient-to-br from-slate-800/50 to-cyan-900/20">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-magenta-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-magenta-500/50 animate-pulse">
                                    <FaRocket className="text-2xl text-white" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-orbitron text-2xl bg-gradient-to-r from-magenta-400 to-cyan-400 bg-clip-text text-transparent mb-2 animate-pulse text-white">Interstellar Support</h3>
                                <p className="text-gray-300 mb-4">Navigate the cosmos of data with expert guidance. Our engineers pilot through any technological challenges.</p>
                                <div className="flex gap-4">
                                    <Button variant="cosmic-primary" className="bg-gradient-to-r from-magenta-600 to-cyan-600 hover:from-magenta-500 hover:to-cyan-500 shadow-lg shadow-magenta-500/25 animate-pulse p-1" title="Launch Interstellar Support">
                                        Launch Support
                                    </Button>
                                    <Button variant="cosmic-outline" className="border-cyan-400/50 hover:border-cyan-300 hover:shadow-md p-1" title="Learn more about support">
                                        Learn more
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Container Settings */}
                <Card variant="elevated" className="mb-6 border-cyan-400/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl text-white">
                            <FaCogs />
                            Container settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Container Name */}
                        <div className="p-4 bg-black/20 rounded-lg border border-gray-600/50">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 font-orbitron uppercase text-xs tracking-wider">Name:</span>
                                <span className="text-white font-mono">{container.name}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 font-orbitron uppercase text-xs tracking-wider">Container config:</span>
                                <span className="text-cyan-300 font-mono text-sm">{container.config?.slice(0, 50)}...</span>
                            </div>


                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 font-orbitron uppercase text-xs tracking-wider">sGTM container ID:</span>
                                <span className="text-cyan-300 font-mono">GTM-{container.id?.slice(-7)}</span>
                            </div>



                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 font-orbitron uppercase text-xs tracking-wider">Container identifier:</span>
                                <span className="text-cyan-300 font-mono">{container.id}</span>
                            </div>


                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 font-orbitron uppercase text-xs tracking-wider">Container API Key:</span>
                                <span className="text-cyan-300 font-mono">apd:{container.id}:4d4c237339924a2600e83fe84988e744ef5948edfbnjnfqx</span>
                            </div>

                            {/* Server Location */}

                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 font-orbitron uppercase text-xs tracking-wider">Server location:</span>
                                <span className="text-cyan-300 font-mono">{container.region || 'AP East (Singapore)'}</span>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Domains & Tagging Server URLs */}
                <Card variant="elevated" className="border-cyan-400/30">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-xl text-white">
                                🚀 Launch Pads (Tagging Server URLs)
                            </span>
                            <Badge variant="gray" className="text-sm">1/1 (for Free)</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-white font-mono">https://server.ezicalc.cfd</span>
                                <Badge variant="green">Ready</Badge>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-white font-orbitron uppercase text-sm tracking-wider mb-2">Navigation Records</h4>
                            <Table variant='cosmic' className='cosmic'>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-1/4 font-orbitron">Protocol</TableHead>
                                        <TableHead className="w-1/3 font-orbitron">Launch Pad</TableHead>
                                        <TableHead className="w-1/3 font-orbitron">Valid Destination</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-mono bg-gradient-to-r from-purple-900/20 to-cyan-900/20">CNAME</TableCell>
                                        <TableCell className="font-mono bg-gradient-to-r from-magenta-900/20 to-purple-900/20">server.ezicalc.cfd</TableCell>
                                        <TableCell className="font-mono text-magenta-300 bg-gradient-to-r from-cyan-900/20 to-magenta-900/20">cdn.interstellaforge.net</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        <div className="border-t border-gray-600 pt-4">
                            <Button variant="cosmic-primary" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 p-1" title="Upgrade to add another domain">
                                Upgrade to add another domain
                            </Button>
                            <p className="text-gray-400 text-sm mt-2 font-orbitron">
                                With Elite and Quantum plans you can unlock multiple launch pads
                            </p>
                            <p className="text-gray-400 text-xs mt-2">
                                We recommend deploying custom launch pads to ensure optimal hyperdrive navigation and quantum cookie processing.
                                Use the default interstellar subdomain only for temporal testing.
                                <span className="text-magenta-300 hover:text-magenta-200 cursor-pointer ml-1 animate-pulse">Explore more</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Other tabs placeholder content */}
            <TabsContent value="power-ups" className="p-6">
                <Card>
                    <CardContent className="p-4 text-center text-gray-400">
                        Power-Ups content coming soon...
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="analytics" className="p-6">
                <Card>
                    <CardContent className="p-4 text-center text-gray-400">
                        Analytics content coming soon...
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="subscription" className="p-6">
                <Card>
                    <CardContent className="p-4 text-center text-gray-400">
                        Subscription content coming soon...
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="logs" className="p-6">
                <Card>
                    <CardContent className="p-4 text-center text-gray-400">
                        Logs content coming soon...
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="monitoring" className="p-6">
                <Card>
                    <CardContent className="p-4 text-center text-gray-400">
                        Monitoring content coming soon...
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="store" className="p-6">
                <Card>
                    <CardContent className="p-4 text-center text-gray-400">
                        Store content coming soon...
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="connections" className="p-6">
                <Card>
                    <CardContent className="p-4 text-center text-gray-400">
                        Connections content coming soon...
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

    );
};