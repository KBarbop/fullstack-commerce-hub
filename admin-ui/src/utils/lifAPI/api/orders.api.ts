import {COMMERCE_HUB_SERVICES} from "../../../../../shared";
import {makeRequest} from "../lifRequest.ts";

const ORDERS_ENDPOINT_URL = COMMERCE_HUB_SERVICES + '/orders'


export async function getOrders() {
    return await makeRequest(
        'get',
        `${ORDERS_ENDPOINT_URL}/get-orders`,
    );
}

export async function getOrdersByUser(userId: string) {
    return await makeRequest(
        'get',
        `${ORDERS_ENDPOINT_URL}/get-orders-by-user/${userId}`,
    );
}

export async function getOrderById(orderId: string) {
    return await makeRequest(
        'get',
        `${ORDERS_ENDPOINT_URL}/get-order/${orderId}`,
    );
}

export async function completeOrder(orderId: string) {
    return await makeRequest(
        'patch',
        `${ORDERS_ENDPOINT_URL}/complete-order/${orderId}`,
    );
}

export async function setOrderEstimatedTime(orderId: string, data: any) {
    return await makeRequest(
        'patch',
        `${ORDERS_ENDPOINT_URL}/set-estimated-time/${orderId}`,
        data,
    );
}

export async function cancelOrder(orderId: string) {
    return await makeRequest(
        'patch',
        `${ORDERS_ENDPOINT_URL}/cancel-order/${orderId}`,
    );
}

export async function deleteOrder(orderId: string) {
    return await makeRequest(
        'delete',
        `${ORDERS_ENDPOINT_URL}/delete-order/${orderId}`,
    );
}


