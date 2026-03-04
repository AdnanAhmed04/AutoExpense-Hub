import { client as api } from './client';

export const documentApi = {
    // Upload a document
    uploadDocument: async (carId, type, file) => {
        const formData = new FormData();
        formData.append('document', file);
        const response = await api.post(`/documents/${carId}/${type}`, formData);
        return response.data;
    },

    // Delete a document
    deleteDocument: async (carId, type) => {
        const response = await api.delete(`/documents/${carId}/${type}`);
        return response.data;
    }
};
