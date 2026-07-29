import { createSlice } from '@reduxjs/toolkit'
//using this redux toolkit to make user state carried by teh browser instead of local file.
const initialState = {
  currentUser: null,
  error: null,
  loading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null
        },
        signInFailure: (state, action) =>{
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const {signInStart, signInSuccess, signInFailure} = userSlice.actions //hooks to be use

export default userSlice.reducer