import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Mail, ArrowLeft } from 'lucide-react';
import { storeAPI } from '../../api/store.api';
import { ratingAPI } from '../../api/rating.api';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import type { Store } from '../../types';

export const StoreDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();

    const [store, setStore] = useState<Store | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchStoreDetails();
    }, [id]);

    const fetchStoreDetails = async () => {
        if (!id) return;

        setIsLoading(true);
        try {
            const response = await storeAPI.getStoreById(id);
            setStore(response.data || null);
            setSelectedRating(response.data?.userRating || 0);
        } catch (error: any) {
            toast.error('Failed to load store details');
            navigate('/stores');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRatingSubmit = async () => {
        if (!id || selectedRating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            if (store?.userRatingId) {
                // Update existing rating
                await ratingAPI.updateRating(store.userRatingId, selectedRating);
                toast.success('Rating updated successfully!');
            } else {
                // Submit new rating
                await ratingAPI.submitRating({ storeId: id, rating: selectedRating });
                toast.success('Rating submitted successfully!');
            }

            // Refresh store details
            await fetchStoreDetails();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit rating');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">Store not found</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate('/stores')}
                className="flex items-center text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Stores
            </button>

            {/* Store Details Card */}
            <div className="card">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{store.name}</h1>
                        <div className="space-y-2">
                            <div className="flex items-center text-gray-600">
                                <MapPin className="h-5 w-5 mr-2" />
                                {store.address}
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Mail className="h-5 w-5 mr-2" />
                                {store.email}
                            </div>
                        </div>
                    </div>

                    {/* Average Rating Display */}
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Star className="h-8 w-8 text-yellow-400 fill-current" />
                            <span className="text-4xl font-bold ml-2">
                                {store.averageRating || '0.00'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">
                            {store.totalRatings || 0} {store.totalRatings === 1 ? 'rating' : 'ratings'}
                        </p>
                    </div>
                </div>

                {/* Rating Submission Section */}
                <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        {store.userRating ? 'Update Your Rating' : 'Rate This Store'}
                    </h2>

                    <div className="flex items-center space-x-2 mb-4">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => setSelectedRating(rating)}
                                onMouseEnter={() => setHoverRating(rating)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`h-10 w-10 ${rating <= (hoverRating || selectedRating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                        }`}
                                />
                            </button>
                        ))}
                        <span className="ml-4 text-lg font-medium text-gray-700">
                            {selectedRating > 0 ? `${selectedRating} Star${selectedRating > 1 ? 's' : ''}` : 'Select rating'}
                        </span>
                    </div>

                    {store.userRating && (
                        <p className="text-sm text-gray-600 mb-4">
                            Your current rating: {store.userRating} ⭐
                        </p>
                    )}

                    <button
                        onClick={handleRatingSubmit}
                        disabled={isSubmitting || selectedRating === 0}
                        className="btn-primary disabled:opacity-50"
                    >
                        {isSubmitting
                            ? 'Submitting...'
                            : store.userRating
                                ? 'Update Rating'
                                : 'Submit Rating'}
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="card bg-blue-50 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Rating Guidelines</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>⭐ 1 Star - Poor experience</li>
                    <li>⭐⭐ 2 Stars - Below average</li>
                    <li>⭐⭐⭐ 3 Stars - Average</li>
                    <li>⭐⭐⭐⭐ 4 Stars - Good</li>
                    <li>⭐⭐⭐⭐⭐ 5 Stars - Excellent</li>
                </ul>
            </div>
        </div>
    );
};
