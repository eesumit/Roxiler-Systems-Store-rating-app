export interface User{
    id:string;
    name:string;
    email:string;
    role:'admin'|'user'|'store_owner';
    address:string;
    storeId?:string;
    createdAt:string;
    updatedAt:string;
}
export interface AuthResponse{
    success:boolean;
    message:string;
    data:{
        user:User;
        token:string;
    };
}
export interface Store{
    id:string;
    name:string;
    email:string;
    address:string;
    ownerId?:string;
    averageRating?:string;
    totalRatings?:number;
    userRating?:number | null;
    userRatingId?:string | null;
    createdAt:string;
    updatedAt:string;
}
export interface StoresResponse{
    success:boolean;
    data:{
        stores:Store[];
        pagination:{
            total:number;
            page:number;
            limit:number;
            totalPages:number;
        };
    };
}
export interface Rating{
    id:string;
    userId:string;
    storeId:string;
    rating:number;
    createdAt:string;
    updatedAt:string;
    store?:Store;
    user?:User;
}
export interface LoginFormData{
    email:string;
    password:string;
}
export interface SignupFormData{
    name:string;
    email:string;
    password:string;
    address:string;
}
export interface StoreFormData{
    name:string;
    email:string;
    address:string;
}
export interface RatingFormData{
    storeId:string;
    rating:number;
}
export interface ApiResponse<T=any>{
    success:boolean;
    message:string;
    data?:T;
    errors?:Array<{
        field:string;
        message:string;
    }>;
}