import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL, DEFAULT_FETCH_OPTIONS } from '../config/apiConfig';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: DEFAULT_FETCH_OPTIONS.credentials,
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({}),
});
