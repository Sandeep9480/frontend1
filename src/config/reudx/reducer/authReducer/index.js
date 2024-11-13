import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUsers,
  getConnectionRequest,
  getMyConnectionRequest,
  userlogin,
  userRegistration,
} from "../../action/authAction/index.js";
const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoding: false,
  loggedIn: false,
  message: "",
  tokenThere: false,
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_users: [],
  all_users_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = " ";
    },
    setTokenThere: (state) => {
      state.tokenThere = true;
    },
    setTokenNotThere: (state) => {
      state.tokenThere = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userlogin.pending, (state) => {
        (state.isLoding = true), (state.message = "knocking the door...");
      })
      .addCase(userlogin.fulfilled, (state, action) => {
        state.isLoding = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Login Is Successfull";
      })
      .addCase(userlogin.rejected, (state, action) => {
        state.isLoding = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(userRegistration.pending, (state) => {
        (state.isLoding = true), (state.message = "Registring User ...");
      })
      .addCase(userRegistration.fulfilled, (state, action) => {
        state.isLoding = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = {
          message: "Registratin Is Successfull Please Login ",
        };
      })
      .addCase(userRegistration.rejected, (state, action) => {
        state.isLoding = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoding = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload.userProfile;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoding = false;
        state.isError = false;
        state.all_users_fetched = true;
        state.all_users = action.payload.allProfile;
      })
      .addCase(getConnectionRequest.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(getConnectionRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyConnectionRequest.fulfilled, (state, action) => {
        state.connectionRequest = action.payload;
      })
      .addCase(getMyConnectionRequest.rejected, (state, action) => {
        state.message = action.payload;
      });
  },
});

export const { reset, emptyMessage, setTokenThere, setTokenNotThere } =
  authSlice.actions;

export default authSlice.reducer;
