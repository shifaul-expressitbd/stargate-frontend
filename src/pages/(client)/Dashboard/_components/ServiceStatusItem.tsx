const ServiceStatusItem = ({ name, status }: { name: string; status: 'operational' | 'degraded' | 'down' }) => {
    const getStatusClasses = (currentStatus: 'operational' | 'degraded' | 'down') => {
        switch (currentStatus) {
            case 'operational': return 'bg-green-400';
            case 'degraded': return 'bg-yellow-400';
            case 'down': return 'bg-red-400';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${getStatusClasses(status)}`}></div>
            <span className="font-orbitron text-cyan-200 truncate">{name}</span>
        </div>
    );
};

export default ServiceStatusItem;