import { Button } from '@/components/shared/buttons/button';
import { useGetContainerQuery, useHardDeleteContainerMutation, useRestartContainerMutation, useStopContainerMutation } from '@/lib/features/sgtm-container/sgtmContainerApi';
import { motion } from 'motion/react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { BackNavigation } from './_components/BackNavigation';
import { ContainerHeader } from './_components/ContainerHeader';
import { ErrorState } from './_components/ErrorState';
import { LoadingSkeleton } from './_components/LoadingSkeleton';
import { TabsSection } from './_components/TabsSection';
import { WarningCard } from './_components/WarningCard';
const ContainerDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    console.log('ContainerDetails rendered with id:', id);
    const { data, isLoading, error, refetch } = useGetContainerQuery(id!);
    console.log('API result:', { data, isLoading, error });

    const container = data?.success ? data.data : null;

    // Additional check for malformed API response
    if (data && data.success === true && !data.data) {
        console.log('API returned success but data is null:', data);
        return (
            <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-64"
            >
                <div className="text-center text-yellow-400">
                    <FaExclamationTriangle className="mx-auto text-4xl mb-4" />
                    <p className="text-lg font-semibold">Data Unavailable</p>
                    <p className="text-sm mb-4">Container data could not be loaded</p>
                    <Button title='Retry' onClick={() => refetch()} className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md">
                        Retry
                    </Button>
                </div>
            </motion.div>
        );
    }

    // Mutation hooks
    const [stopContainer, { isLoading: stopLoading }] = useStopContainerMutation();
    const [restartContainer, { isLoading: restartLoading }] = useRestartContainerMutation();
    const [deleteContainer, { isLoading: deleteLoading }] = useHardDeleteContainerMutation();


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    // Mutation handlers
    const handleStopContainer = async () => {
        try {
            await stopContainer(id!).unwrap();
            refetch(); // Refresh to show new status
        } catch (error) {
            console.error('Failed to stop container:', error);
        }
    };

    const handleRestartContainer = async () => {
        try {
            await restartContainer(id!).unwrap();
            refetch(); // Refresh to show new status
        } catch (error) {
            console.error('Failed to restart container:', error);
        }
    };

    const handleDeleteContainer = async () => {
        if (!confirm('Are you sure you want to permanently delete this container?')) return;
        try {
            await deleteContainer(id!).unwrap();
            navigate('/dashboard'); // Redirect to dashboard after deletion
        } catch (error) {
            console.error('Failed to delete container:', error);
        }
    };

    // Loading skeleton state
    if (isLoading) {
        console.log('Showing loading skeleton');
        return (
            <LoadingSkeleton
                formatDate={formatDate}
                container={container}
                handleRestartContainer={handleRestartContainer}
                handleStopContainer={handleStopContainer}
                handleDeleteContainer={handleDeleteContainer}
                restartLoading={restartLoading}
                stopLoading={stopLoading}
                deleteLoading={deleteLoading}
            />
        );
    }

    // Error state
    if (error || !data?.success) {
        console.log('Showing error state, error:', !!error, 'success:', data?.success);
        return <ErrorState refetch={refetch} />;
    }

    if (!container) {
        console.log('Returning null because no container, data.success:', data?.success, 'data.data:', data?.data);
        return null;
    }

    console.log('Rendering main component');
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative custom-scroll overflow-y-scroll p-6 pb-8"
        >
            <div className="relative z-10 space-y-6">
                {/* Back Navigation */}
                <BackNavigation />

                {/* Warning/Alert Card */}
                <WarningCard containerStatus={container.status} />

                {/* Main Container Header Card */}
                <ContainerHeader container={container} />

                {/* Navigation Tabs */}
                <TabsSection container={container} />
            </div>
        </motion.div>
    );
};

export default ContainerDetails;