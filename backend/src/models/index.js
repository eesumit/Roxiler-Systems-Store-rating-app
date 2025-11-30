import { sequelize } from "../config/database.js";
import User from "./User.js";
import Store from "./Store.js";
import Rating from "./Rating.js";

// User to Store relationship (one-to-one for store owners)
User.belongsTo(Store, { foreignKey: 'storeId', as: 'ownedStore' });
Store.hasOne(User, { foreignKey: 'storeId', as: 'owner' });

// Store to User relationship (owner)
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'storeOwner' });

// User to Rating relationship (one-to-many)
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Store to Rating relationship (one-to-many)
Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced successfully');
    } catch (error) {
        console.error('❌ Failed to sync database:', error);
    }
};

export {
    sequelize,
    syncDatabase,
    User,
    Store,
    Rating
};