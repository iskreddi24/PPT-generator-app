import apiClient from './apiClient';

/**
 * Fetches a paginated list of media from the backend with optional filters.
 * All requests made with `apiClient` will automatically include the auth token.
 * @param {string} company - The company to filter by (e.g., "SBA").
 * @param {string} mediaType - The category to filter by (e.g., "Unipole").
 * @param {string} query - The search term for the media code.
 * @param {number} page - The page number to fetch (0-indexed).
 * @param {number} size - The number of items per page.
 * @param {AbortSignal} signal - The signal from an AbortController to cancel the request.
 * @returns {Promise<Object>} A promise that resolves to the Page object from the backend.
 */
export const getMedia = async (company, mediaType, query, page = 0, size = 50, signal) => {
  try {
    const params = {
      page,
      size,
    };

    if (company) {
      params.company = company;
    }
    if (mediaType && mediaType !== 'All') {
      params.mediaType = mediaType;
    }
    if (query) {
      params.query = query;
    }

    // Pass the signal to the Axios request configuration.
    // If the signal is aborted, Axios will automatically cancel the request.
    const response = await apiClient.get('/media', { params, signal });
    
    return response.data;
  } catch (error) {
    // Don't log CanceledError to the console, as it's an expected behavior.
    if (error.name !== 'CanceledError') {
      console.error('Error fetching filtered media:', error);
    }
    // Re-throw the error so the calling component (DashboardPage) can handle it.
    // This is crucial for the reducer to transition to the 'error' state.
    throw error;
  }
};

/**
 * Requests a PowerPoint presentation from the backend.
 * @param {Array<number>} ids An array of media IDs.
 * @returns {Promise<Object>} A promise that resolves to the Axios response object.
 */
export const generatePpt = async (ids) => {
  const response = await apiClient.post('/media/generate-ppt', ids, {
    responseType: 'blob',
  });
  return response;
};

/**
 * Requests a PowerPoint presentation from the backend based on a list of media codes.
 * @param {Array<string>} codes - An array of media code strings.
 * @returns {Promise<Object>} A promise that resolves to the Axios response object.
 */
export const generatePptByCodes = async (codes) => {
  // The backend expects a JSON array of strings in the request body
  const response = await apiClient.post('/media/generate-ppt-by-codes', codes, {
    responseType: 'blob', // We expect a file back
  });
  return response;
};

/**
 * Adds a new media item by sending multipart/form-data.
 * The FormData object is built in the component and passed here.
 * @param {FormData} formData The form data object containing media details and the image file.
 * @returns {Promise<Object>} A promise that resolves to the newly created media object.
 */
export const addMedia = async (formData) => {
  const response = await apiClient.post('/media', formData, {});
  return response.data;
};

/**
 * Updates an existing media item.
 * @param {number} id The ID of the media item to update.
 * @param {FormData} formData The form data containing the updated details.
 * @returns {Promise<Object>} A promise that resolves to the updated media object.
 */
export const updateMedia = async (id, formData) => {
  const response = await apiClient.put(`/media/${id}`, formData, {});
  return response.data;
};