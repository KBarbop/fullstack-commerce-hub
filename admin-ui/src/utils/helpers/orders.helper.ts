import {IOrder, IProduct} from "../../../../shared";
import {ColumnFilterItem} from "antd/es/table/interface";

export const getOrdersFilters = (orders: IOrder[]) =>  {
    return  {
        filters: {
            userFilters: orders.map((order) => {
                return {
                    text: order._user,
                    value: order._user,
                } as ColumnFilterItem;
            }),
            statusFilters: orders.map((order) => {
                return {
                    text: order.status,
                    value: order.status,
                } as ColumnFilterItem;
            }),
        },
        filterFunctions: {
            onUserFilter: (value: any, record: IOrder) => record._user?.indexOf(value) === 0,
            onStatusFilter: (value: any, record: IOrder) => record.status?.indexOf(value) === 0,
        },
        sorters: {
            userSorter: (a: IOrder, b: IOrder) => {
                return (a._user || '').localeCompare(b._user || '');
            },
            statusSorter: (a: IOrder, b: IOrder) => {
                return (a.status || '').localeCompare(b.status || '');
            },
            totalPriceSorter: (a: IOrder, b: IOrder) => {
                return (a.totalPrice || '').localeCompare(b.totalPrice || '');
            },
        },
    }

}

export const extractTime = (dateString: string): string => {
    if (!dateString) {
        return 'Invalid date';
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

export const extractDate = (dateString: string): string => {
    if (!dateString) {
        return 'Invalid date';
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

export const extractFullAddress = (order: IOrder): string => {
    const address = order.address;

    return `${address.street} ${address.streetNumber}, ${address.city}, ${address.zipCode}`;
}
