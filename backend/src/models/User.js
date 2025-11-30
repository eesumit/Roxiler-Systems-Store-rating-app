import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import bcryptjs from "bcryptjs";

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            len: {
                args: [3, 60],
                msg: 'Name must be atleast 3 and atmost 60 characters long.'
            }
        }
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Must be a valid email address.'
            }
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: {
                args: [6, 255],
                msg: 'Password must be atleast 6 and atmost 255 characters long.'
            }
        }
    },
    address: {
        type: DataTypes.STRING(400),
        allowNull: false,
        validate: {
            len: {
                args: [1, 400],
                msg: 'Address must be up to 400 characters long.'
            }
        }
    },
    role: {
        type: DataTypes.ENUM('admin', 'user', 'store_owner'),
        defaultValue: 'user',
        allowNull: false
    },
    storeId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'store_id'
    },
    resetToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'reset_token'
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'reset_token_expiry'
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcryptjs.hash(user.password, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcryptjs.hash(user.password, 10);
            }
        }
    }
});

User.prototype.comparePassword = async function (candidatePassword) {
    return await bcryptjs.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    delete values.resetToken;
    delete values.resetTokenExpiry;
    return values;
};

export default User;