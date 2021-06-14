import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';
import {
  AUTH_STATE,
  CRED,
  LOGIN_USER,
  POST_PROFILE,
  PROFILE,
  JWT,
  USER,
} from "../types"

// Loginの非同期関数の定義
export const fetchAsyncLogin = createAsyncThunk (
  "auth/login",
  async (auth: CRED) =>{
    const res = await axios.post<JWT>(
      `${process.env.REACT_APP_API_URL}/authen/jwt/create`,
      auth,{
        headers :{
          "Content-Type": "application-json",
        },
      }
    );
  return res.data;
  }
);

//  Registerの非同期関数の定義
export const fetchAsyncRegister = createAsyncThunk (
  "auth/register",
  async (auth: CRED) =>{
    const res = await axios.post<USER>(
      `${process.env.REACT_APP_API_URL}/api/create`,
      auth,{
        headers :{
          "Content-Type": "application-json",
        },
      }
    );
  return res.data;
  }
);

//  Login済みユーザー情報を取得するための非同期関数の定義
export const fetchAsyncGetProf = createAsyncThunk(
  "auth/loginuser",
  async()=>{
    const res = await axios.get<LOGIN_USER>(
      `${process.env.REACT_APP_API_URL}/api/loginuser/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
     }
    );
    return res.data;
  }
)

//  Profileを新規で作成するための非同期関数の定義
export const fetchAsyncCreateProf = createAsyncThunk(
  "auth/createProfile",
  async()=>{
    const res = await axios.post<PROFILE>(
      `${process.env.REACT_APP_API_URL}/api/profile/`,
       {img: null},
      {
        headers: {
          "Content-Type": "application-json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
     }
    );
    return res.data;
  }
)



const initialState: AUTH_STATE = {
  isLoginView: true,
  loginUser: {
    id: 0,
    username: '',
  },
  profiles: [{ id: 0, user_profile: 0, img:null }],
};


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
});

export const {  } = authSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;

export default authSlice.reducer;
