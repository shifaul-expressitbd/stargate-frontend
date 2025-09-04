import { InputField } from '@/components/shared/forms/input-field';
import Select from '@/components/shared/forms/select';
import Modal from '@/components/shared/modals/modal';
import { useCreateContainerMutation, useGetAllContainersWithSyncQuery } from '@/lib/features/sgtm-container/sgtmContainerApi';
import { useGetAllRegionsQuery } from '@/lib/features/sgtm-region/sgtmRegionApi';
import { useState } from 'react';
import { FaCog, FaGlobe, FaGoogle, FaPlus, FaServer } from 'react-icons/fa';
import { toast } from 'sonner';
interface AddContainerModalProps {
    isModalOpen: boolean;
    onClose: () => void;
    modalStep: 'select' | 'manual';
    setModalStep: (step: 'select' | 'manual') => void;
}

interface FormData {
    name: string
    subdomain: string
    config: string
    region?: string
}

const AddContainerModal = ({ isModalOpen, onClose, modalStep, setModalStep }: AddContainerModalProps) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        subdomain: '',
        config: '',
        region: ''
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    // const [warnings, setWarnings] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)

    const [createContainer] = useCreateContainerMutation()
    const { refetch: refetchContainers } = useGetAllContainersWithSyncQuery()
    const { data: regionsData } = useGetAllRegionsQuery()

    const regions = regionsData || []

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleRegionChange = (selected: { label: string; value: string | number }[]) => {
        const value = selected.length > 0 ? selected[0].value.toString() : ''
        setFormData(prev => ({ ...prev, region: value }))

        if (errors.region) {
            setErrors(prev => ({ ...prev, region: '' }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}
        const requiredFields: (keyof FormData)[] = ['name', 'subdomain', 'config']

        requiredFields.forEach(field => {
            if (!formData[field]?.trim()) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
            }
        })

        // Validate subdomain format (basic domain format check)
        if (formData.subdomain && !/^[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9]*$/.test(formData.subdomain)) {
            newErrors.subdomain = 'Subdomain must contain only letters, numbers, and hyphens'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        const toastId = toast.loading('Creating container...', { id: 'create-container' })

        try {
            const payload = {
                name: formData.name.trim(),
                subdomain: formData.subdomain.trim(),
                config: formData.config.trim(),
                region: formData.region || undefined
            }

            await createContainer(payload).unwrap()
            toast.success('Container created successfully!', { id: toastId })

            // Refresh containers list
            refetchContainers()

            // Reset form and close modal
            setFormData({ name: '', subdomain: '', config: '', region: '' })
            onClose()
        } catch (error: any) {
            toast.dismiss(toastId)
            const errorMessage = error?.data?.message || 'Failed to create container'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const regionOptions = regions.map((region: any) => ({
        label: region.name,
        value: region.key
    }))

    const selectedRegion = regionOptions.filter((option: any) => option.value === formData.region)

    return (
        <Modal
            isModalOpen={isModalOpen}
            onClose={onClose}
            variant="themed"
            title={modalStep === 'select' ? 'Choose Setup Method' : 'Manual Setup'}
            showHeader={false}
            showFooter={modalStep === 'manual'}
            // onConfirm={modalStep === 'manual' ? onSubmit : undefined}
            confirmText={loading ? "Creating..." : "Add Container"}
            isConfirming={loading}
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
                <form onSubmit={onSubmit} className="space-y-4">
                    <InputField variant='cosmic'
                        id="name"
                        name="name"
                        label="Container Name"
                        type="text"
                        placeholder="Enter container name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        icon={FaServer}
                        required
                    />

                    <InputField variant='cosmic'
                        id="subdomain"
                        name="subdomain"
                        label="Subdomain"
                        type="text"
                        placeholder="yoursubdomain"
                        value={formData.subdomain}
                        onChange={handleChange}
                        error={errors.subdomain}
                        icon={FaGlobe}
                        required
                    />

                    <InputField variant='cosmic'
                        id="config"
                        name="config"
                        label="Configuration"
                        placeholder="Enter container configuration (JSON or text)"
                        value={formData.config}
                        onChange={handleChange}
                        error={errors.config}
                        icon={FaCog}
                        required

                    />

                    <Select
                        id="region"
                        label="Region"
                        value={selectedRegion}
                        onChange={handleRegionChange}
                        options={regionOptions}
                        placeholder="Select region (optional)"
                        error={errors.region}
                        mode="single"
                    />
                </form>
            )}
        </Modal>
    );
};

export default AddContainerModal;