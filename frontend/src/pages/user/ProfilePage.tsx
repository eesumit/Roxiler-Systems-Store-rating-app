import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { userAPI } from '../../api/user.api';
import { authAPI } from '../../api/auth.api';
import { ratingAPI } from '../../api/rating.api';
import type { Rating } from '../../types';

const profileSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(60),
    email: z.string().email('Invalid email address'),
    address: z.string().min(1, 'Address is required').max(400),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(16)
        .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'Password must contain at least one uppercase letter and one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export const ProfilePage = () => {
    const { user, login } = useAuth();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'ratings'>('profile');
    const [isUpdating, setIsUpdating] = useState(false);
    const [myRatings, setMyRatings] = useState<Rating[]>([]);
    const [isLoadingRatings, setIsLoadingRatings] = useState(false);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
        reset: resetProfile,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            address: user?.address || '',
        },
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPassword,
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    useEffect(() => {
        if (activeTab === 'ratings') {
            fetchMyRatings();
        }
    }, [activeTab]);

    const fetchMyRatings = async () => {
        setIsLoadingRatings(true);
        try {
            const response = await ratingAPI.getMyRating();
            setMyRatings(response.data || []);
        } catch (error: any) {
            toast.error('Failed to load ratings');
        } finally {
            setIsLoadingRatings(false);
        }
    };

    const onSubmitProfile = async (data: ProfileFormData) => {
        if (!user) return;

        setIsUpdating(true);
        try {
            const response = await userAPI.updateUser(user.id, data);

            // Update auth context with new user data
            if (response.data) {
                const token = localStorage.getItem('token');
                if (token) {
                    login(response.data, token);
                }
            }

            toast.success('Profile updated successfully!');
            resetProfile(data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    const onSubmitPassword = async (data: PasswordFormData) => {
        setIsUpdating(true);
        try {
            await authAPI.changePassword(data);
            toast.success('Password changed successfully!');
            resetPassword();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`${activeTab === 'profile'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`${activeTab === 'password'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                        <Lock className="h-4 w-4 mr-2" />
                        Password
                    </button>
                    <button
                        onClick={() => setActiveTab('ratings')}
                        className={`${activeTab === 'ratings'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                        <Star className="h-4 w-4 mr-2" />
                        My Ratings
                    </button>
                </nav>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h2>
                    <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                {...registerProfile('name')}
                                className="input-field mt-1"
                            />
                            {profileErrors.name && (
                                <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                {...registerProfile('email')}
                                type="email"
                                className="input-field mt-1"
                            />
                            {profileErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea
                                {...registerProfile('address')}
                                className="input-field mt-1"
                                rows={3}
                            />
                            {profileErrors.address && (
                                <p className="mt-1 text-sm text-red-600">{profileErrors.address.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <input
                                value={user?.role || ''}
                                disabled
                                className="input-field mt-1 bg-gray-100 cursor-not-allowed"
                            />
                            <p className="mt-1 text-sm text-gray-500">Role cannot be changed</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="btn-primary disabled:opacity-50"
                        >
                            {isUpdating ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>
                </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
                    <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Current Password</label>
                            <input
                                {...registerPassword('currentPassword')}
                                type="password"
                                className="input-field mt-1"
                            />
                            {passwordErrors.currentPassword && (
                                <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                {...registerPassword('newPassword')}
                                type="password"
                                className="input-field mt-1"
                            />
                            {passwordErrors.newPassword && (
                                <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input
                                {...registerPassword('confirmPassword')}
                                type="password"
                                className="input-field mt-1"
                            />
                            {passwordErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="btn-primary disabled:opacity-50"
                        >
                            {isUpdating ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            )}

            {/* Ratings Tab */}
            {activeTab === 'ratings' && (
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">My Ratings</h2>
                    {isLoadingRatings ? (
                        <div className="text-center py-8">Loading ratings...</div>
                    ) : myRatings.length > 0 ? (
                        <div className="space-y-4">
                            {myRatings.map((rating) => (
                                <div key={rating.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{rating.store?.name || 'Unknown Store'}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(rating.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                        <span className="ml-1 text-lg font-semibold text-gray-900">{rating.rating}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">You haven't rated any stores yet</p>
                    )}
                </div>
            )}
        </div>
    );
};
