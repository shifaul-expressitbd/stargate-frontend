import { Skeleton } from '@/components/layout/skeleton';
import { Button } from '@/components/shared/buttons/button';
import { InputField } from '@/components/shared/forms/input-field';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/lib/features/profile/profileApi';
import TError from '@/types/TError.type';
import { mapValidationErrors, Validators } from '@/utils/validationUtils';
import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { FaCamera, FaEdit } from 'react-icons/fa';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
];

export type ProfileFormData = {
    name: string;
    userName: string;
    email: string;
    phoneNumber: string;
    address: string;
};

const ProfileForm = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageExisting, setImageExisting] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery();
    const [updateProfile] = useUpdateProfileMutation();

    const [formData, setFormData] = useState<ProfileFormData>({
        name: '',
        userName: '',
        email: '',
        phoneNumber: '',
        address: ''
    });

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
        setFormData((prev: ProfileFormData) => ({
            ...prev,
            [id]: value.replace(/</g, '<').replace(/>/g, '>')
        }));

        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const requiredFields: Array<keyof ProfileFormData> = ['name', 'phoneNumber', 'address'];
        const validationMapping: Record<keyof ProfileFormData, keyof typeof Validators> = {
            name: 'name',
            email: 'businessEmail',
            phoneNumber: 'phone',
            userName: 'username',
            address: 'location'
        };

        const newErrors: Record<string, string> = {};

        requiredFields.forEach(field => {
            const validator = validationMapping[field];
            const validationResult = Validators[validator]?.(formData[field]);

            if (validationResult?.error) {
                newErrors[field] = validationResult.error;
            }
        });

        setErrors(newErrors);
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
            <div className="backdrop-blur-md rounded-lg border border-cyan-400/50 p-6">
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
        );
    }

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
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-white font-orbitron mb-2">
                        {formData.name || 'Unknown User'}
                    </h2>
                    <p className="text-cyan-200 font-poppins">
                        {formData.email || 'No email set'}
                    </p>
                </div>

                <Button
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isSubmitting}
                    variant={isEditing ? 'cosmic-outline' : 'cosmic-primary'}
                    title={isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    className="font-poppins flex items-center justify-center"
                >
                    <FaEdit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        id="name"
                        label="Full Name"
                        value={formData.name}
                        onChange={handleFormChange}
                        disabled={!isEditing}
                        variant="cosmic"
                        error={errors.name}
                    />

                    <InputField
                        id="userName"
                        label="Username"
                        value={formData.userName}
                        onChange={handleFormChange}
                        disabled={!isEditing}
                        variant="cosmic"
                        error={errors.userName}
                    />

                    <InputField
                        id="email"
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        disabled={!isEditing}
                        variant="cosmic"
                        error={errors.email}
                    />

                    <InputField
                        id="phoneNumber"
                        label="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleFormChange}
                        disabled={!isEditing}
                        variant="cosmic"
                        error={errors.phoneNumber}
                    />

                    <InputField
                        id="address"
                        label="Address"
                        value={formData.address}
                        onChange={handleFormChange}
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
                            onClick={() => setIsEditing(false)}
                            variant="cosmic-outline"
                            title="Cancel"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
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

export default ProfileForm;