import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducer/authReducer/index";
import postSclice from "./reducer/postReducer/index";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postSclice,
  },
});
