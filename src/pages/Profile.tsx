import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { FaCamera, FaEdit, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'sonner';

import { Skeleton } from '@/components/layout/skeleton';
import { Button } from '@/components/shared/buttons/button';
import { InputField } from '@/components/shared/forms/input-field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/navigation/tabs';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/lib/features/profile/profileApi';
import TError from '@/types/TError.type';
import { mapValidationErrors, Validators } from '@/utils/validationUtils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
];

type FormData = {
    name: string;
    userName: string;
    email: string;
    phoneNumber: string;
    address: string;
};

type ActivityLogItem = {
    id: string;
    action: string;
    ipAddress: string;
    device: string;
    location: string;
    timestamp: string;
};

interface ProfileFormProps {
    formData: FormData;
    isEditing: boolean;
    isSubmitting: boolean;
    imagePreview: string | null;
    imageExisting: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEditToggle: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    errors: Record<string, string>;
    warnings: Record<string, string>;
}

interface ActivityLogProps {
    activities: ActivityLogItem[];
}

export const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageExisting, setImageExisting] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [warnings, setWarnings] = useState<Record<string, string>>({});

    const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery();
    const [updateProfile] = useUpdateProfileMutation();

    const [formData, setFormData] = useState<FormData>({
        name: '',
        userName: '',
        email: '',
        phoneNumber: '',
        address: ''
    });

    // Sample activity log data
    const activities: ActivityLogItem[] = [
        {
            id: '1',
            action: 'Login',
            ipAddress: '192.168.1.1',
            device: 'Chrome on Windows',
            location: 'New York, US',
            timestamp: new Date().toLocaleString()
        },
        {
            id: '2',
            action: 'Password Changed',
            ipAddress: '192.168.1.1',
            device: 'Chrome on Windows',
            location: 'New York, US',
            timestamp: new Date(Date.now() - 86400000).toLocaleString()
        }
    ];

    useEffect(() => {
        if (profileData) {
            setFormData({
                name: profileData.name || '',
                userName: profileData.email?.split('@')[0] + '_' + profileData._id?.slice(-6) || '',
                email: profileData.email || '',
                phoneNumber: profileData.phone?.toString() || '',
                address: profileData.address?.toString() || ''
            });

            if (profileData?.alterImage?.secure_url) {
                setImageExisting(profileData.alterImage.secure_url);
            }
        }
    }, [profileData]);

    const validateFile = (file: File): string | null => {
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return 'Please upload an image file (JPEG, PNG, GIF, WEBP)';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'File size should be less than 5MB';
        }
        return null;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const errorMessage = validateFile(file);
        if (errorMessage) {
            toast.error(errorMessage);
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.onerror = () => toast.error('Failed to read image file');
        reader.readAsDataURL(file);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev: FormData) => ({
            ...prev,
            [id]: value.replace(/</g, '<').replace(/>/g, '>')
        }));

        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const requiredFields: Array<keyof FormData> = ['name', 'phoneNumber', 'address'];
        const validationMapping: Record<keyof FormData, keyof typeof Validators> = {
            name: 'name',
            email: 'businessEmail',
            phoneNumber: 'phone',
            userName: 'username',
            address: 'location'
        };

        const newErrors: Record<string, string> = {};
        const newWarnings: Record<string, string> = {};

        requiredFields.forEach(field => {
            const validator = validationMapping[field];
            const validationResult = Validators[validator]?.(formData[field]);

            if (validationResult?.error) {
                newErrors[field] = validationResult.error;
            }
            if (validationResult?.warning) {
                newWarnings[field] = validationResult.warning;
            }
        });

        setErrors(newErrors);
        setWarnings(newWarnings);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        const toastId = toast.loading('Updating profile...');

        try {
            const formattedData = {
                name: formData.name,
                phone: formData.phoneNumber,
                address: formData.address
            };

            const formDataToSend = new FormData();
            if (imageFile) formDataToSend.append('image', imageFile);
            formDataToSend.append('data', JSON.stringify(formattedData));

            await updateProfile(formDataToSend).unwrap();

            toast.success('Profile updated successfully!', {
                id: toastId,
                duration: 2000
            });
            setIsEditing(false);
        } catch (error) {
            if (error instanceof TError) {
                const errorMessage =
                    error?.message ||
                    error?.data?.message ||
                    error?.data?.error[0]?.message;
                const validationErrors = error?.data?.error || [];
                setErrors(mapValidationErrors(validationErrors));
                toast.error(errorMessage, { id: toastId, duration: 2000 });
            } else {
                toast.error('An error occurred.', { id: toastId, duration: 2000 });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isProfileLoading) {
        return (
            <div className="w-full p-6">
                <div className="bg-black rounded-lg border border-cyan-400/50 p-6">
                    <Skeleton variant="cosmic" className="h-10 w-48 mb-6" />
                    <div className="flex gap-2 mb-6">
                        <Skeleton variant="cosmic" className="h-10 w-28 rounded-md" />
                        <Skeleton variant="cosmic" className="h-10 w-32 rounded-md" />
                        <Skeleton variant="cosmic" className="h-10 w-28 rounded-md" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton variant="cosmic" className="h-32 w-full" />
                        <Skeleton variant="cosmic" className="h-32 w-full" />
                        <Skeleton variant="cosmic" className="h-32 w-full" />
                        <Skeleton variant="cosmic" className="h-32 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative custom-scroll overflow-y-scroll p-6 pb-8"
        >
            {/* Page Header */}
            <div className="mb-8 z-10">
                <h1 className="text-4xl font-bold mb-4 text-white font-asimovian text-shadow-white-strong tracking-[0.15em] uppercase">
                    Profile
                </h1>
                <p className="text-cyan-200 font-orbitron text-shadow-cyan-glow">
                    Manage your cosmic identity and account configuration
                </p>
            </div>

            <Tabs defaultValue="general" variant="cosmic" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="general" className="font-orbitron">
                        <FaEdit className="w-4 h-4 mr-2" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="security" className="font-orbitron">
                        <FaShieldAlt className="w-4 h-4 mr-2" />
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <ProfileForm
                        formData={formData}
                        isEditing={isEditing}
                        isSubmitting={isSubmitting}
                        imagePreview={imagePreview}
                        imageExisting={imageExisting}
                        onImageChange={handleImageChange}
                        onEditToggle={() => setIsEditing(!isEditing)}
                        onChange={handleFormChange}
                        onSubmit={handleSubmit}
                        errors={errors}
                        warnings={warnings}
                    />
                </TabsContent>

                <TabsContent value="security">
                    <ActivityLog activities={activities} />
                </TabsContent>
            </Tabs>
        </motion.div>

    );
};

// Profile Form Component
const ProfileForm: React.FC<ProfileFormProps> = ({
    formData,
    isEditing,
    isSubmitting,
    imagePreview,
    imageExisting,
    onImageChange,
    onEditToggle,
    onChange,
    onSubmit,
    errors,

}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="backdrop-blur-md rounded-lg border border-cyan-400/50 p-6"
        >
            {/* Avatar and Edit Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-2 border-cyan-400/60 overflow-hidden bg-gradient-to-br from-cyan-500/20 to-purple-600/20">
                        {imagePreview || imageExisting ? (
                            <img
                                src={imagePreview || imageExisting!}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-cyan-300">
                                <FaCamera className="w-8 h-8" />
                            </div>
                        )}
                    </div>

                    {isEditing && (
                        <label htmlFor="image-upload" className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer hover:bg-black/40 transition-colors group">
                            <FaCamera className="w-6 h-6 text-cyan-300" />
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={onImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-white font-asimovian mb-2">
                        {formData.name || 'Unknown User'}
                    </h2>
                    <p className="text-cyan-200 font-orbitron">
                        {formData.email || 'No email set'}
                    </p>
                </div>

                <Button
                    onClick={onEditToggle}
                    disabled={isSubmitting}
                    variant={isEditing ? 'cosmic-outline' : 'cosmic-primary'}
                    title={isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    className="font-orbitron flex items-center justify-center"
                >
                    <FaEdit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                </Button>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        id="name"
                        label="Full Name"
                        value={formData.name}
                        onChange={onChange}
                        disabled={!isEditing}
                        variant="cosmic"
                        error={errors.name}
                    />

                    <InputField
                        id="userName"
                        label="Username"
                        value={formData.userName}
                        onChange={onChange}
                        disabled={!isEditing}
                        variant="cosmic"
                        error={errors.userName}
                    />

                    <InputField
                        id="email"
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={onChange}
                        disabled={!isEditing}
                        variant="cosmic"
                        error={errors.email}
                    />

                    <InputField
                        id="phoneNumber"
                        label="Phone Number"
                        value={formData.phoneNumber}
                        onChange={onChange}
                        disabled={!isEditing}
                        variant="cosmic"
                        error={errors.phoneNumber}
                    />

                    <InputField
                        id="address"
                        label="Address"
                        value={formData.address}
                        onChange={onChange}
                        disabled={!isEditing}
                        variant="cosmic"
                        error={errors.address}
                        className="md:col-span-2"
                    />
                </div>

                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 justify-end"
                    >
                        <Button
                            type="button"
                            onClick={onEditToggle}
                            variant="cosmic-outline"
                            title="Cancel"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onSubmit}
                            disabled={isSubmitting}
                            variant="cosmic-primary"
                            title="Save Changes"
                            type="submit"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </motion.div>
                )}
            </form>
        </motion.div>
    );
};

// Activity Log Component
const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/40 backdrop-blur-md rounded-lg border border-yellow-400/50 p-6"
        >
            <h2 className="text-2xl font-bold text-white font-asimovian mb-6">
                Activity Log
            </h2>

            <div className="space-y-4">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-900/60 rounded-lg border border-yellow-400/30 hover:border-yellow-400/50 transition-colors"
                    >
                        <div className="flex-1 mb-2 sm:mb-0">
                            <div className="flex items-center gap-3 mb-2">
                                <FaShieldAlt className="w-5 h-5 text-yellow-400" />
                                <span className="font-semibold text-white font-orbitron">
                                    {activity.action}
                                </span>
                            </div>
                            <div className="text-sm text-cyan-200 font-orbitron">
                                {activity.device} • IP: {activity.ipAddress}
                            </div>
                            <div className="text-sm text-purple-200 font-orbitron">
                                {activity.location}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-green-400 font-orbitron">
                                {activity.timestamp}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};



export default ProfilePage;