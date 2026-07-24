import {IUser, COMMERCE_HUB_SERVICES} from "../../../../../shared";
import {makeRequest} from "../lifRequest.ts";

const USERS_ENDPOINT_URL = COMMERCE_HUB_SERVICES + '/users/'

export async function loginUser(data: IUser) {
    return await makeRequest(
        'post',
        `${USERS_ENDPOINT_URL}/log-in`,
        data,
    );
}

export async function getUsers() {
    return await makeRequest(
        'get',
        `${USERS_ENDPOINT_URL}/get-users`,
    );
}

export async function getUserById(userId: string) {
    return await makeRequest(
        'get',
        `${USERS_ENDPOINT_URL}/get-user/${userId}`,
    );
}

export async function authorizeUserSession() {
    return await makeRequest(
        'post',
        `${USERS_ENDPOINT_URL}/authorize-session`,
    );
}

export async function logOutUser() {
    return await makeRequest(
        'post',
        `${USERS_ENDPOINT_URL}/log-out`,
        {},
        {},
        {},
    );
}

export async function deleteUser(userId: string) {
    return await makeRequest(
        'delete',
        `${USERS_ENDPOINT_URL}/delete-user/${userId}`,
    );
}
