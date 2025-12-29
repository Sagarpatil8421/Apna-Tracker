import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL, DEFAULT_FETCH_OPTIONS } from '../config/apiConfig';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: DEFAULT_FETCH_OPTIONS.credentials,
  prepareHeaders: (headers, { getState }) => {
    // Get token from localStorage for Bearer auth
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({}),
});
