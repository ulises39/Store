import axios, { AxiosError, AxiosResponse } from "axios";
import { BASE_URL, BUGGY_ENDPOINTS, PRODUCTS_ENDPOINTS } from "../modules/constants/endpoints";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../modules/interfaces/Pagination";

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(async (response) => {
    await sleep();

    const pagination = response.headers['pagination'];
    if(pagination) {
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        return response;
    }

    return response;
}, (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status){
        case 400:
            if (data.errors){
                const modelStateErrors: string[] = [];
                for(const key in data.errors){
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key]);
                    }
                }

                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
        case 404:
            toast.error(data.title);
            break;
        case 500:
            router.navigate('/server-error', {state: {error: data}});
            break;            
        default: 
            break;
    }

    return Promise.reject(error.response);
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, { params } ).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Catalog = {
    list: (params: URLSearchParams) => requests.get(PRODUCTS_ENDPOINTS.PRODUCTS, params),
    details: (id: number) => requests.get(`${PRODUCTS_ENDPOINTS.PRODUCTS}/${id}`),
    fetchFilters: () => requests.get(`${PRODUCTS_ENDPOINTS.PRODUCTS}/${PRODUCTS_ENDPOINTS.FILTERS}`),
}

const TestErrors = {
    get400Error: () => requests.get(`${BUGGY_ENDPOINTS.BUGGY}/${BUGGY_ENDPOINTS.BAD_REQUEST}`),
    get401Error: () => requests.get(`${BUGGY_ENDPOINTS.BUGGY}/${BUGGY_ENDPOINTS.UNAUTHORIZED}`),
    get404Error: () => requests.get(`${BUGGY_ENDPOINTS.BUGGY}/${BUGGY_ENDPOINTS.NOT_FOUND}`),
    get500Error: () => requests.get(`${BUGGY_ENDPOINTS.BUGGY}/${BUGGY_ENDPOINTS.SERVER_ERROR}`),
    getValidationError: () => requests.get(`${BUGGY_ENDPOINTS.BUGGY}/${BUGGY_ENDPOINTS.VALIDATION_ERROR}`),
}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
}

const agent = {
    Catalog,
    TestErrors,
    Basket
}

export default agent;