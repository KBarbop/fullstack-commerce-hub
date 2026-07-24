export interface IMongoResponse {
    status: number;
    errorCode?: string;
    errorDescription?: string;
    data?: any;
}