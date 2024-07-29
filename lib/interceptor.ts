import axios from "axios";
import { SearchPayload } from "./typings/dto";

const apiHost: any = process.env.NEXT_PUBLIC_STRAPI_API_URL
export const getPublicApiResponse = async (endpoint: any) => {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    const response = await axios.get(apiHost + '/' + endpoint, {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
        },
    }).catch(err => err.response);
    return response.data;
}

export const postRequestApi = async (endpoint: string, data: any) => {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    let bodyContent = JSON.stringify({
        "data": data
    });
    let reqOptions = {
        url: apiHost + '/' + endpoint,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
        },
        data: bodyContent,
    }
    const response = await axios.request(reqOptions).catch(err => err.response);
    return response.data;
}

export const putRequestApi = async (endpoint: string, payload: any, id: any) => {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    let bodyContent = JSON.stringify({
        "data": payload
    });
    let reqOptions = {
        url: apiHost + '/' + endpoint + '/' + id,
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
        },
        data: bodyContent,
    }
    const response = await axios.request(reqOptions).catch(err => err.response);
    return response.data;
}

export const uploadMediaFiles = async (data: any) => {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    let reqOptions = {
        url: apiHost + '/upload',
        method: "POST",
        headers: {
            Accept: "*/*",
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
        },
        data: data,
    }
    const response = await axios.request(reqOptions).catch(err => err.response);
    return response.data;
}

export const deleteMediaFiles = async (id: any) => {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    let reqOptions = {
        url: apiHost + '/upload/files/' + id,
        method: "DELETE",
        headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
        }
    }
    const response = await axios.request(reqOptions).catch(err => err.response);
    return response.data;
}

export const userAuthentication = async (payload: User.Login) => {
    const endpoint = "auth/local";
    const reqOptions = {
        url: apiHost + '/' + endpoint,
        method: 'POST',
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
        },
        data: payload
    }
    let response = await axios.request(reqOptions).catch(err => err.response);
    return response.data;
}

const searchHost: any = process.env.NEXT_PUBLIC_MEILISEARCH_URL
export const getPublicSingleSearchResponse = async (payload: SearchPayload | undefined) => {
    // await new Promise(resolve => setTimeout(resolve, 3000))
    let headersList = {
        Accept: "application/json",
        'Access-Control-Allow-Origin': '*',
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_MEILISEARCH_TOKEN,
        "Content-Type": "application/json"
    }
    let bodyContent = JSON.stringify({
        "queries": [
            {
                "indexUid": payload?.indexUid,
                "q": payload?.q
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