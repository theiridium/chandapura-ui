'use client'

import { AxiosProgressEvent } from 'axios';
import axiosInstance from './axiosInstance.client';

export const uploadMediaFiles = async (data: any, token: string, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    const endpoint = '/upload';
    try {
        const response = await axiosInstance.post(endpoint, data, {
            headers: {
                Accept: "*/*",
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
            onUploadProgress
        });
        return response.data;
    } catch (err: any) {
        console.log(err)
        return err.response?.data || { error: 'An error occurred' };
    }
}
