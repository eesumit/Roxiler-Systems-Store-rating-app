import User from "../models/User.js";
import Store from "../models/Store.js";
import Rating from "../models/Rating.js";
import { Op } from "sequelize";

class UserService {

    async getAllusers(queryParams) {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc',
            search = '',
            role = ''
        } = queryParams;

        const where = {};


        //search filter
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { address: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Role filter
        if (role) {
            where.role = role;
        }


        // Calculate offset
        const offset = (page - 1) * limit;
        // Query database
        const { count, rows } = await User.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset,
            order: [[sortBy, order.toUpperCase()]],
            include: [
                {
                    model: Store,
                    as: 'ownedStore',
                    required: false,
                    include: [
                        {
                            model: Rating,
                            as: 'ratings',
                            required: false
                        }
                    ]
                }
            ]
        });

        // Calculate average rating for store owners
        const usersWithRatings = rows.map(user => {

            const userJson = user.toJSON();

            if (user.role === 'store_owner' && user.ownedStore) {
                const ratings = user.ownedStore.ratings || [];
                const avgRating = ratings.length > 0
                    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                    : 0;

                userJson.averageRating = avgRating.toFixed(2);
            }

            return userJson;
        });

        return {
            users: usersWithRatings,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        };

    }

    // Get user by ID
    async getUserById(userId) {
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: Store,
                    as: 'ownedStore',
                    required: false,
                    include: [
                        {
                            model: Rating,
                            as: 'ratings',
                            required: false
                        }
                    ]
                }
            ]
        });
        if (!user) {
            throw new Error('User not found');
        }
        const userJson = user.toJSON();
        // Calculate average rating for store owners
        if (user.role === 'store_owner' && user.ownedStore) {
            const ratings = user.ownedStore.ratings || [];
            const avgRating = ratings.length > 0
                ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                : 0;

            userJson.averageRating = avgRating.toFixed(2);
        }
        return userJson;
    }
    // Create user (admin only)
    async createUser(userData) {
        const existingUser = await User.findOne({
            where: { email: userData.email }
        });

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const user = await User.create(userData);

        return user;
    }
    // Update user
    async updateUser(userId, updateData) {

        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error('User not found');
        }
        // Check if email is being changed and already exists
        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await User.findOne({
                where: { email: updateData.email }
            });
            if (existingUser) {
                throw new Error('Email already in use');
            }
        }

        await user.update(updateData);

        return user;

    }
    // Delete user
    async deleteUser(userId) {

        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error('User not found');
        }

        await user.destroy();

        return { message: 'User deleted successfully' };

    }
}

export default new UserService();