import Modal from '@/components/shared/modals/modal';
import { FaGoogle, FaPlus } from 'react-icons/fa';

interface AddContainerModalProps {
    isModalOpen: boolean;
    onClose: () => void;
    modalStep: 'select' | 'manual';
    setModalStep: (step: 'select' | 'manual') => void;
}

const AddContainerModal = ({ isModalOpen, onClose, modalStep, setModalStep }: AddContainerModalProps) => {
    return (
        <Modal
            isModalOpen={isModalOpen}
            onClose={onClose}
            variant="themed"
            title={modalStep === 'select' ? 'Choose Setup Method' : 'Manual Setup'}
            showFooter={modalStep === 'manual'}
            confirmText="Add Container"
        >
            {modalStep === 'select' ? (
                <div className="space-y-4">
                    <button
                        onClick={() => {
                            // Handle automatic setup
                            onClose();
                            setModalStep('select');
                        }}
                        className="w-full flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
                    >
                        <FaGoogle className="h-6 w-6" />
                        <div className="text-left">
                            <div className="font-semibold">Automatic with Google</div>
                            <div className="text-sm opacity-90">Connect directly to your Google Account</div>
                        </div>
                    </button>
                    <button
                        onClick={() => setModalStep('manual')}
                        className="w-full flex items-center justify-center gap-4 p-6 bg-base dark:bg-primary-dark border-2 border-primary dark:border-primary-foreground text-primary dark:text-primary-foreground rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-all"
                    >
                        <FaPlus className="h-6 w-6" />
                        <div className="text-left">
                            <div className="font-semibold">Manual Setup</div>
                            <div className="text-sm opacity-90">Configure your container manually</div>
                        </div>
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-orbitron text-primary dark:text-primary-foreground mb-2">Container Name</label>
                            <input
                                type="text"
                                placeholder="Enter container name"
                                className="w-full p-3 bg-base dark:bg-primary-dark border border-primary/30 dark:border-primary-foreground/30 rounded-lg text-primary dark:text-primary-foreground placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-orbitron text-primary dark:text-primary-foreground mb-2">Container ID</label>
                            <input
                                type="text"
                                placeholder="GTM-XXXXXXX"
                                className="w-full p-3 bg-base dark:bg-primary-dark border border-primary/30 dark:border-primary-foreground/30 rounded-lg text-primary dark:text-primary-foreground placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-orbitron text-primary dark:text-primary-foreground mb-2">Domain</label>
                            <input
                                type="text"
                                placeholder="yourdomain.com"
                                className="w-full p-3 bg-base dark:bg-primary-dark border border-primary/30 dark:border-primary-foreground/30 rounded-lg text-primary dark:text-primary-foreground placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default AddContainerModal;