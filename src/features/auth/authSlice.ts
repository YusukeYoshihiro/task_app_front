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
          "Content-Type": "application/json",
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
    `${process.env.REACT_APP_API_URL}/api/create/`,
      auth,{
        headers :{
          "Content-Type": "application/json",
        },
      }
    );
  return res.data;
  }
);

//  Login済みユーザー情報を取得するための非同期関数の定義
export const fetchAsyncGetMyProf = createAsyncThunk(
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

// Profileの一覧を取得する非同期関数の定義
export const fetchAsyncGetProfs = createAsyncThunk(
  "auth/getProfile",
  async()=>{
    const res = await axios.get<PROFILE[]>(
      `${process.env.REACT_APP_API_URL}/api/profile/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
     }
    );
    return res.data;
  }
)

// Profileのアップデートする非同期関数の定義
export const fetchAsyncUpdateProf = createAsyncThunk(
  "auth/updateProfile",
  async(profile: POST_PROFILE)=>{
    const uploadData = new FormData();
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    const res = await axios.put<PROFILE>(
    `${process.env.REACT_APP_API_URL}/api/profile/${profile.id}/`,
    uploadData,
      {
        headers: {
          "Content-Type": "application/json",
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
  reducers: {
    toggleMode(state){
      state.isLoginView = !state.isLoginView;
    }
  },
  extraReducers:(builder)=>{
    // ログインが成功した場合、access Token を取得し、それを元に"/tasks"に遷移する。
    builder.addCase(
      fetchAsyncLogin.fulfilled,
      (state, action: PayloadAction<JWT>)=>{
        localStorage.setItem("localJWT", action.payload.access);
        action.payload.access && (window.location.href = "/tasks")
      }
    );
  　　// ログインしているユーザーのprofileデータを取得したときの処理
    builder.addCase(
      fetchAsyncGetMyProf.fulfilled,
      (state, action: PayloadAction<LOGIN_USER>)=>{
        return {
          ...state,
          loginUser: action.payload,
        }
      }
    );
     // profileの一覧の情報を取得した後の処理
    builder.addCase(
      fetchAsyncGetProfs.fulfilled,
      (state, action: PayloadAction<PROFILE[]>) => {
        return {
          ...state,
          profiles: action.payload,
        }
      }
    );
    // profileの更新が完了した後の処理
    builder.addCase(
      fetchAsyncUpdateProf.fulfilled,
      (state, action: PayloadAction<PROFILE>) => {
        return {
          ...state,
          profiles: state.profiles.map((prof)=>
          prof.id=== action.payload.id ? action.payload: prof
         ),
        }
      }
    );
  }
});

export const { toggleMode} = authSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;

export const selectIsLoginView = (state: RootState)=> state.auth.isLoginView;
export const selectLoginUser = (state: RootState)=> state.auth.loginUser;
export const selectProfiles = (state: RootState)=> state.auth.profiles;

export default authSlice.reducer;
