import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (_, thunkApi) => {
    try {
      const response = await clientServer.get("/getAll_post");
      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkApi) => {
    const { file, body } = userData;
    try {
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("body", body);
      formData.append("media", file);

      const reponse = await clientServer.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (reponse.status === 200) {
        return thunkApi.fulfillWithValue("post Uploaded");
      } else {
        return thunkApi.rejectWithValue("Post is not created");
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, thunkApi) => {
    try {
      const response = await clientServer.delete("/delete_post", {
        data: {
          token: localStorage.getItem("token"),
          post_id: post_id.post_id,
        },
      });
      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const incrementLike = createAsyncThunk(
  "post/increamentLike",
  async (post, thunkApi) => {
    try {
      const response = await clientServer.post("/like_Increament", {
        post_id: post.post_id,
      });
      thunkApi.dispatch({
        type: "post/updateLikeCount",
        payload: { postId: post.post_id },
      });
      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkApi) => {
    try {
      const response = await clientServer.get("/get_comment_post", {
        params: {
          post_id: postData.post_id,
        },
      });
      return thunkApi.fulfillWithValue({
        comments: response.data,
        post_id: postData.post_id,
      });
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkApi) => {
    try {
      const response = await clientServer.post("/add_comment", {
        token: localStorage.getItem("token"),
        post_id: commentData.post_id,
        commentBody: commentData.body,
      });

      return thunkApi.fulfillWithValue(response.data);
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);
