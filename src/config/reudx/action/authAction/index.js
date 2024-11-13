import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const userlogin = createAsyncThunk(
  "user/login",
  async (user, thunkApi) => {
    try {
      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkApi.rejectWithValue({
          message: "token not found",
        });
      }
      return thunkApi.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const userRegistration = createAsyncThunk(
  "user/register",
  async (user, thunkApi) => {
    try {
      const response = await clientServer.post("/register", {
        name: user.name,
        email: user.email,
        password: user.password,
        username: user.username,
      });
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkApi) => {
    try {
      const response = await clientServer.get("/get_user_profile", {
        params: {
          token: user.token,
        },
      });
      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkApi) => {
    try {
      const response = await clientServer.get("/get_allUser_profile");
      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkApi) => {
    try {
      const reponse = await clientServer.post("/send_connection", {
        token: user.token,
        connectionId: user.user_id,
      });

      thunkApi.dispatch(getConnectionRequest({ token: user.token }));
      return thunkApi.fulfillWithValue(reponse.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const getConnectionRequest = createAsyncThunk(
  "user/getConnectionRequest",
  async (user, thunkApi) => {
    try {
      const reponse = await clientServer.get("/getmy_connection", {
        params: {
          token: user.token,
        },
      });
      return thunkApi.fulfillWithValue(reponse.data.connections);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const getMyConnectionRequest = createAsyncThunk(
  "user/getMyConnectionRequest",
  async (user, thunkApi) => {
    try {
      const reponse = await clientServer.get("/allmy_connection", {
        params: {
          token: user.token,
        },
      });
      return thunkApi.fulfillWithValue(reponse.data.connections);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const acceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async (user, thunkApi) => {
    try {
      const reponse = await clientServer.get("/accept_connection", {
        params: {
          token: user.token,
          requestId: user.connectionId,
          actionType: user.action,
        },
      });

      dispatch(getConnectionRequest({ token: localStorage.getItem("token") }));
      dispatch(
        getMyConnectionRequest({ token: localStorage.getItem("token") })
      );
      return thunkApi.fulfillWithValue(reponse.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);
