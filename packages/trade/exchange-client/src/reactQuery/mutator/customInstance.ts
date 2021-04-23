import Axios, { AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({ baseURL: '' }); // TODO: set to BACKEND_URL .env value

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
    const source = Axios.CancelToken.source();

    const promise: any = AXIOS_INSTANCE({
        ...config,
        cancelToken: source.token
    }).then(({ data }) => data);

    promise.cancel = () => source.cancel('Query was cancelled by React Query');

    return promise;
};

export default customInstance;
