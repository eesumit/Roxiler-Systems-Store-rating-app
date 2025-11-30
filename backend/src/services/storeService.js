import User from "../models/User.js";
import Store from "../models/Store.js";
import Rating from "../models/Rating.js";
import { Op } from "sequelize";

class StoreService {

    //getting all stores with filters/sorting.pagination
    async getAllStores(queryParams, currentUser = null) {
        const { page = 1, limit = 10, search = "" } = queryParams;

        const where = {};

        // Search filter
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { address: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Calculate offset
        const offset = (page - 1) * limit;


        // Query database
        const { count, rows } = await Store.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Rating,
                    as: 'ratings',
                    required: false
                }
            ]
        });

        // Calculate average rating and user's rating for each store
        const storesWithRatings = rows.map(store => {

            const storeJson = store.toJSON();
            const ratings = store.ratings || [];

            // Calculate average rating
            const avgRating = ratings.length > 0
                ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                : 0;
            storeJson.averageRating = avgRating.toFixed(2);
            storeJson.totalRatings = ratings.length;
            // Find current user's rating if logged in
            if (currentUser) {
                const userRating = ratings.find(r => r.userId === currentUser.id);
                storeJson.userRating = userRating ? userRating.rating : null;
                storeJson.userRatingId = userRating ? userRating.id : null;
            }
            // Remove ratings array from response
            delete storeJson.ratings;
            return storeJson;
        });

        return {
            stores: storesWithRatings,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        };
    }
    // Get store by ID
    async getStoreById(storeId, currentUser = null) {

        const store = await Store.findByPk(storeId, {
            include: [
                {
                    model: Rating,
                    as: 'ratings',
                    required: false,
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });


        if (!store) {
            throw new Error('Store not found');
        }


        const storeJson = store.toJSON();
        const ratings = store.ratings || [];


        // Calculate average rating
        const avgRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;
        storeJson.averageRating = avgRating.toFixed(2);
        storeJson.totalRatings = ratings.length;


        // Find current user's rating
        if (currentUser) {
            const userRating = ratings.find(r => r.userId === currentUser.id);
            storeJson.userRating = userRating ? userRating.rating : null;
            storeJson.userRatingId = userRating ? userRating.id : null;
        }

        return storeJson;

    }
    // Create store (admin only)
    async createStore(storeData) {

        const existingStore = await Store.findOne({
            where: { email: storeData.email }
        });


        if (existingStore) {
            throw new Error('Store with this email already exists');
        }

        const store = await Store.create(storeData);

        return store;

    }
    // Update store
    async updateStore(storeId, updateData) {

        const store = await Store.findByPk(storeId);

        if (!store) {
            throw new Error('Store not found');
        }

        // Check if email is being changed and already exists
        if (updateData.email && updateData.email !== store.email) {
            const existingStore = await Store.findOne({
                where: { email: updateData.email }
            });
            if (existingStore) {
                throw new Error('Email already in use');
            }
        }

        await store.update(updateData);

        return store;
    }
    // Delete store
    async deleteStore(storeId) {

        const store = await Store.findByPk(storeId);

        if (!store) {
            throw new Error('Store not found');
        }

        await store.destroy();

        return { message: 'Store deleted successfully' };

    }
}

export default new StoreService();