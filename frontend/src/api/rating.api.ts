import axios from './axios';
import type { ApiResponse,Rating, RatingFormData } from '../types';

export const ratingAPI = {
    //submitting the rating
    submitRating:async(data:RatingFormData):Promise<ApiResponse<Rating>>=>{
        const response = await axios.post('/ratings',data);
        return response.data;
    },


    //updating the  rating
    updateRating:async(id:string,rating:number):Promise<ApiResponse<Rating>>=>{
        const response = await axios.put(`/ratings/${id}`,{rating});
        return response.data;
    },

    //getting the rating
    getMyRating:async():Promise<ApiResponse<Rating[]>>=>{
        const response = await axios.get('/ratings/my-ratings');
        return response.data;
    },
};