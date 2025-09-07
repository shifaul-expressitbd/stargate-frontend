import { Button } from '@/components/shared/buttons/button';
import { Card, CardContent } from '@/components/shared/cards/card';
import { FaExclamationTriangle } from 'react-icons/fa';

interface WarningCardProps {
    containerStatus: string;
}

export const WarningCard = ({ containerStatus }: WarningCardProps) => {
    if (containerStatus === 'RUNNING') {
        return null;
    }

    return (
        <Card variant="elevated" className="border-orange-500/30 bg-orange-500/10">
            <CardContent className="flex gap-4 p-4">
                <div className="flex-shrink-0">
                    <FaExclamationTriangle className="w-6 h-6 text-orange-400" />
                </div>
                <div className="flex-grow">
                    <h3 className="font-asimovian text-lg text-orange-300 mb-1">Warning</h3>
                    <p className="text-orange-200 text-sm">
                        Your container was disabled because it did not receive requests for more than two weeks.
                        Contact support if you have any questions.
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <Button variant="outline" size="sm" className="border-orange-500/30 text-orange-300 hover:border-orange-400 hover:text-orange-200" title="Activate Container">
                        Activate
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};