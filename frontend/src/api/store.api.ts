import axios from './axios';
import  type { StoresResponse,Store, ApiResponse,StoreFormData } from '../types';

export const storeAPI = {

    //getting all stores
    getStores:async (params?:{
        page?:number;
        limit?:number;
        search?:string;
        
    }):Promise<StoresResponse>=>{
        const response = await axios.get('/stores', { params });
        return response.data;
    },

    //getting store be its ID
    getStoreById:async(id:string):Promise<ApiResponse<Store>>=>{
        const response = await axios.get(`/stores/${id}`);
        return response.data;
    },

    //creating store
    createStore:async(data:StoreFormData):Promise<ApiResponse<Store>>=>{
        const response = await axios.post('/stores', data);
        return response.data;
    },

    //updating store
    updateStore:async(id:string,data:Partial<StoreFormData>):Promise<ApiResponse<Store>>=>{
        const response = await axios.put(`/stores/${id}`, data);
        return response.data;
    },

    //deleting store
    deleteStore:async(id:string):Promise<ApiResponse>=>{
        const response = await axios.delete(`/stores/${id}`);
        return response.data;
    },
};