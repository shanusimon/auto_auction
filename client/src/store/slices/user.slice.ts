import { createSlice,PayloadAction,createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types/auth";
import { userAxiosInstance } from "@/api/clientAxios";


interface UserState {
    user: User | null;
    loading:boolean;
    error:string|null;
}

const initialState:UserState = {
    user:null,
    loading:false,
    error:null
}

export interface UpdateProfilePayLoad {
    name:string,
    bio:string,
    phone:string,
    profileImage:string,
}

export const updateUserProfile = createAsyncThunk<User,UpdateProfilePayLoad,{rejectValue:string}>(
    "user/updateProfile",
    async(profileData,{rejectWithValue})=>{
        try {
            const response = await userAxiosInstance.patch("/_us/user/edit-profile",profileData);
            console.log("haiii",response.data);
            return response.data.data;
        } catch (error:any) {
            return rejectWithValue(error.response?.data || "Something went wrong")
        }
    }
)



const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        userLogin:(state,action:PayloadAction<User>)=>{
            state.user = action.payload
        },
        userLogout:(state)=>{
            state.user = null
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(updateUserProfile.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(updateUserProfile.fulfilled,(state,action:PayloadAction<User>)=>{
            state.loading =false;
            state.user = action.payload || null
        })
        .addCase(updateUserProfile.rejected,(state,action)=>{
            state.loading = false;
            state.error =  action.payload || "Failed to update profile"
        })
    }
})

export const {userLogin,userLogout} = userSlice.actions;
export default userSlice.reducer;