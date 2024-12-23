"use server"
import axios from "axios";
import { SearchPayload } from "./typings/dto";
import axiosInstance from "./axiosInstance";

const currentDate = new Date().getTime();

export const getPublicApiResponse = async (endpoint: any) => {
    // await new Promise(resolve => setTimeout(resolve, 5000))
    try {
        const response = await axiosInstance.get(endpoint, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (err: any) {
        console.log(err)
        return err.response?.data || { error: 'An error occurred' };
    }
}

export const postRequestApi = async (endpoint: string, data: any) => {
    try {
        let bodyContent = JSON.stringify({
            "data": data
        });
        const response = await axiosInstance.post(endpoint, bodyContent, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (err: any) {
        console.log(err)
        return err.response?.data || { error: 'An error occurred' };
    }
}

export const putRequestApi = async (endpoint: string, payload: any, id: any) => {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    try {
        let bodyContent = JSON.stringify({
            "data": payload
        });
        const response = await axiosInstance.put(endpoint + '/' + id, bodyContent, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        console.log(response)
        return response.data;
    } catch (err: any) {
        console.log(err)
        return err.response?.data || { error: 'An error occurred' };
    }
}

export const uploadMediaFiles = async (data: any) => {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    const endpoint = '/upload';
    try {
        const response = await axiosInstance.post(endpoint, data, {
            headers: {
                Accept: "*/*",
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (err: any) {
        console.log(err)
        return err.response?.data || { error: 'An error occurred' };
    }
}

export const deleteMediaFiles = async (id: any) => {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    const endpoint = '/upload/files/' + id;
    try {
        const response = await axiosInstance.delete(endpoint, {
            headers: {
                Accept: "*/*",
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (err: any) {
        console.log(err)
        return err.response?.data || { error: 'An error occurred' };
    }
}

export const userAuthentication = async (payload: User.Login) => {
    const endpoint = "auth/local";
    try {
        const response = await axiosInstance.post(endpoint, payload, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (err: any) {
        console.log(err)
        return err.response?.data || { error: 'An error occurred' };
    }
}

export const userRegistration = async (payload: User.Register) => {
    const endpoint = "auth/local/register";
    try {
        const response = await axiosInstance.post(endpoint, payload, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (err: any) {
        console.log(err)
        return err.response?.data || { error: 'An error occurred' };
    }
}

export const userEmailConfirmation = async (email: string) => {
    const endpoint = "auth/send-email-confirmation";
    let bodyContent = JSON.stringify({
        "data": {
            "email": email
        }
    });
    try {
        const response = await axiosInstance.post(endpoint, bodyContent, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (err: any) {
        console.log(err)
        return err.response?.data || { error: 'An error occurred' };
    }
}

const searchHost: any = process.env.NEXT_PUBLIC_MEILISEARCH_URL
export const getPublicSingleSearchResponse = async (payload: SearchPayload | undefined) => {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    let headersList = {
        Accept: "application/json",
        'Access-Control-Allow-Origin': '*',
        Authorization: "Bearer " + process.env.MEILISEARCH_TOKEN,
        "Content-Type": "application/json"
    }
    let filters = payload?.noExpFilter ?
        ["publish_status = true"] :
        ["publish_status = true", `payment_details.expiry_date_timestamp > ${currentDate}`, 'payment_details.isPaymentSuccess = true'];
    if (payload?.filter) filters.push(payload.filter);
    let bodyContent = JSON.stringify({
        "queries": [
            {
                "indexUid": payload?.indexUid,
                "q": payload?.q,
                "filter": filters
            }
        ]
    });
    let reqOptions = {
        url: searchHost + 'multi-search',
        method: "POST",
        headers: headersList,
        data: bodyContent,
    }
    let response = await axios.request(reqOptions).catch(err => err.response);
    return response.data;
}

// const paymentHost: any = process.env.NEXT_PUBLIC_MEILISEARCH_URL
export const createOrderId = async (amount: any, receiptId: string) => {
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL}api/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: Math.round(parseFloat(amount) * 100),
                currency: "INR",
                receipt: receiptId
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.orderId;

    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
};

export const getScreenSize = async () => {
    await new Promise(resolve => setTimeout(resolve, 3000))
    // const screenParameters = {
    //     sm: false,
    //     md: false,
    //     lg: false,
    //     xl: false,
    //     xxl: false,
    //     width: typeof window !== 'undefined' ? window.innerWidth : null,
    //     height: typeof window !== 'undefined' ? window.innerHeight : null,
    // }
    // const width = typeof window !== 'undefined' && window.innerWidth;
    // if (width <= GobalConfig.sm) setWidthAttributes('sm', width);
    // else if (width <= GobalConfig.md && width > GobalConfig.sm) setWidthAttributes('md', width);
    // else if (width <= GobalConfig.lg && width > GobalConfig.md) setWidthAttributes('lg', width);
    // else if (width <= GobalConfig.xl && width > GobalConfig.lg) setWidthAttributes('xl', width);
    // else if (width > GobalConfig.xl) setWidthAttributes('xxl', width);

    let width = 0;
    console.log(window)
    if (typeof window !== 'undefined') {
        width = window.innerWidth;
    }
    return width;
}