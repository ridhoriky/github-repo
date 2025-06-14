import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { octokit } from "../../api/octokit";

export interface UserState {
  loading: boolean;
  error: string | null;
  userSearch: string;
  data: GitHubSearchUserResponse;
}

export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
  score: number;
}

export interface GitHubSearchUserResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUser[];
}

const initialState: UserState = {
  loading: false,
  error: null,
  userSearch: "",
  data: {
    total_count: 0,
    incomplete_results: false,
    items: [],
  },
};

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (q: string, thunkAPI) => {
    try {
      const response = await octokit.request("GET /search/users", {
        q: `${q}`,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      return response.data as GitHubSearchUserResponse;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserSearch: (state, action: PayloadAction<string>) => {
      state.userSearch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<GitHubSearchUserResponse>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUserSearch } = userReducer.actions;
export default userReducer.reducer;
