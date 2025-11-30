import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Rating = sequelize.define('Rating',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
    },
    userId:{
        type:DataTypes.UUID,
        allowNull:false,
        field:'user_id'
    },
    storeId:{
        type:DataTypes.UUID,
        allowNull:false,
        field:'store_id'
    },
    rating:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            min:{
                args:[1],
                msg:'Rating must be at least 1.'
            },
            max:{
                args:[5],
                msg:'Rating must be at most 5.'
            }
        }
    },
    
},{
    tableName:'ratings',
    timestamps:true,
    userscored:true,
    indexes:[{
        unique:true,
        fields:['user_id','store_id'],
        name:'unique_user_store_rating'
    }]
});

export default Rating;