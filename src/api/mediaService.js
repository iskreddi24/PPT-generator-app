export const getMedia = async (company, mediaType, query, page = 0, size = 50, signal) => {
  const params = { page, size };

  if (company) params.company = company;
  if (mediaType && mediaType !== 'All') params.mediaType = mediaType;
  if (query) params.query = query;

  const response = await apiClient.get('/api/media', { params, signal });
  return response.data;
};

export const generatePpt = async (ids) => {
  return apiClient.post('/api/media/generate-ppt', ids, {
    responseType: 'blob',
  });
};

export const generatePptByCodes = async (codes) => {
  return apiClient.post('/api/media/generate-ppt-by-codes', codes, {
    responseType: 'blob',
  });
};

export const addMedia = async (formData) => {
  return (await apiClient.post('/api/media', formData)).data;
};

export const updateMedia = async (id, formData) => {
  return (await apiClient.put(`/api/media/${id}`, formData)).data;
};
