import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Store = sequelize.define('Store',{
    id:{
        type:DataTypes.UUID,
        toDefaultValue:DataTypes.UUIDV4,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING(60),
        allowNull:false,
        validate:{
            len:{
                args:[3,60],
                msg:'store name must be at least 3 characters long and at most 60 characters long.'
            }
        }
    },
    email:{
        type:DataTypes.STRING(255),
        allowNull:false,
        unique:true,
        validate:{
            isEmail:{
                msg:'Must be a valid email address.'
            }
        }
    },
    address:{
        type:DataTypes.STRING(400),
        allowNull:false,
        validate:{
            len:{
                args:[1,400],
                msg:'Address must be up to 400 characters long.'
            }
        }
    },
    ownerId:{
        type:DataTypes.UUID,
        allowNull:true,
        field:'owner_id'
    }
},{
    tableName:'stores',
    timestamps:true,
    userscored:true,
});

export default Store;