import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { octokit } from "../../api/octokit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserRepoState {
  loadingRepo: boolean;
  errorRepo: string | null;
  userRepos: {
    [username: string]: GitHubRepo[];
  };
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  default_branch: string;
  owner: GitHubOwner;
}

export interface GitHubOwner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
}

const initialState: UserRepoState = {
  loadingRepo: false,
  errorRepo: null,
  userRepos: {},
};

export const fetchUserRepos = createAsyncThunk(
  "repo/fetchUserRepos",
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await octokit.request("GET /users/{username}/repos", {
        username,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
        per_page: 30,
        sort: "updated",
        direction: "desc",
      });

      return {
        username,
        repos: response.data as GitHubRepo[],
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      if (typeof error === "object" && error !== null && "response" in error) {
        const apiError = error as {
          response: { status: number; data: { message: string } };
        };
        if (apiError.response?.status === 404) {
          return rejectWithValue(`User "${username}" not found`);
        }
        if (apiError.response?.status === 403) {
          return rejectWithValue("API rate limit exceeded");
        }
        return rejectWithValue(
          apiError.response?.data?.message || "API request failed"
        );
      }

      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const userRepoReducer = createSlice({
  name: "repo",
  initialState,
  reducers: {
    clearRepoError: (state) => {
      state.errorRepo = null;
    },
    clearUserRepos: (state, action: PayloadAction<string>) => {
      delete state.userRepos[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRepos.pending, (state) => {
        state.loadingRepo = true;
        state.errorRepo = null;
      })
      .addCase(
        fetchUserRepos.fulfilled,
        (
          state,
          action: PayloadAction<{ username: string; repos: GitHubRepo[] }>
        ) => {
          state.loadingRepo = false;
          state.errorRepo = null;
          state.userRepos[action.payload.username] = action.payload.repos;
        }
      )
      .addCase(fetchUserRepos.rejected, (state, action) => {
        state.loadingRepo = false;
        state.errorRepo = action.payload as string;
      });
  },
});

export const { clearRepoError, clearUserRepos } = userRepoReducer.actions;
export default userRepoReducer.reducer;
