import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { storeAPI } from '../../api/store.api';
import { useToast } from '../../hooks/useToast';
import type { Store } from '../../types';

export const StoresPage = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const fetchStores = async () => {
        setIsLoading(true);
        try {
            const params: { page: number; limit: number; search?: string } = {
                page,
                limit: 10
            };

            // Only add search parameter if it has a value
            if (search.trim()) {
                params.search = search;
            }

            const response = await storeAPI.getStores(params);
            setStores(response.data.stores);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error: any) {
            toast.error('Failed to load stores');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [page, search]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Stores</h1>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search stores..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field pl-10"
                />
            </div>

            {/* Stores Grid */}
            {isLoading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.map((store) => (
                        <Link
                            key={store.id}
                            to={`/stores/${store.id}`}
                            className="card hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{store.name}</h3>
                            <p className="text-gray-600 text-sm mb-4">{store.address}</p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                    <span className="ml-1 text-lg font-medium">
                                        {store.averageRating || '0.00'}
                                    </span>
                                    <span className="ml-1 text-sm text-gray-500">
                                        ({store.totalRatings || 0} ratings)
                                    </span>
                                </div>

                                {store.userRating && (
                                    <span className="text-sm text-blue-600">
                                        Your rating: {store.userRating}⭐
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="btn-secondary disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="py-2 px-4">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="btn-secondary disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};