import {ICategory, IProduct, COMMERCE_HUB_SERVICES} from "../../../../../shared";
import {makeRequest} from "../lifRequest.ts";

const PRODUCTS_ENDPOINT_URL = COMMERCE_HUB_SERVICES + '/products'

export async function createNewProduct(data: IProduct) {
    return await makeRequest(
        'post',
        `${PRODUCTS_ENDPOINT_URL}/create-new-product`,
        data,
    );
}

export async function getProducts() {
    return await makeRequest(
        'get',
        `${PRODUCTS_ENDPOINT_URL}/get-products`,
    );
}

export async function getProductById(productId: string) {
    return await makeRequest(
        'get',
        `${PRODUCTS_ENDPOINT_URL}/get-product/${productId}`,
    );
}

export async function getProductsByCategory(categoryId: string) {
    return await makeRequest(
        'get',
        `${PRODUCTS_ENDPOINT_URL}/get-products-by-category/${categoryId}`,
    );
}

export async function editProduct(productId: string, data: IProduct) {
    return await makeRequest(
        'patch',
        `${PRODUCTS_ENDPOINT_URL}/edit-product/${productId}`,
        data,
    );
}


export async function deleteProduct(productId: string) {
    return await makeRequest(
        'delete',
        `${PRODUCTS_ENDPOINT_URL}/delete-product/${productId}`,
    );
}
