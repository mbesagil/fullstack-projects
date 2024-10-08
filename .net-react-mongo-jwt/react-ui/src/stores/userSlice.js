import { createSlice } from '@reduxjs/toolkit';
import ApiService from '../core/services/ApiService';
import JwtService from '../core/services/JwtService';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: "",
        isActive: false,
        preference: {}
    },
});


export default userSlice.reducer;

export const login = async (logData) => {
    console.log("login methoduna geldi", logData);
    return await ApiService
        .post('Auth/login', logData)
        .then((response) => {
            console.log("response", response)
            if(response.data.token){
                JwtService.saveToken(response.data.token) //tokeni locale stroge a kaydeder
                ApiService.setHeader() // jwt tokeni hearea yazar
            }
            return 
        }).catch((err) => {
            console.log("err", err);
            return null
        })
}

export const register = async (regData) => {
    return await ApiService
        .post('auth/register', regData)
        .then((response) => {
            console.log("response", response)
            return response
        }).catch((err) => {
            console.log("err", err);
            return null
        })
}

