import {ICategory, COMMERCE_HUB_SERVICES} from "../../../../../shared";
import {makeRequest} from "../lifRequest.ts";

const CATEGORIES_ENDPOINT_URL = COMMERCE_HUB_SERVICES + '/categories'

export async function createNewCategory(data: ICategory) {
    return await makeRequest(
        'post',
        `${CATEGORIES_ENDPOINT_URL}/create-new-category`,
        data,
    );
}

export async function getCategories() {
    return await makeRequest(
        'get',
        `${CATEGORIES_ENDPOINT_URL}/get-categories`,
    );
}

export async function getCategoryById(categoryId: string) {
    return await makeRequest(
        'get',
        `${CATEGORIES_ENDPOINT_URL}/get-category/${categoryId}`,
    );
}

export async function editCategory(categoryId: string, data: ICategory) {
    return await makeRequest(
        'patch',
        `${CATEGORIES_ENDPOINT_URL}/edit-category/${categoryId}`,
        data,
    );
}


export async function deleteCategory(categoryId: string) {
    return await makeRequest(
        'delete',
        `${CATEGORIES_ENDPOINT_URL}/delete-category/${categoryId}`,
    );
}
