import {IProduct} from "../../../../shared";
import {ColumnFilterItem} from "antd/es/table/interface";
import {getCategories} from "../lifAPI/api/categories.api.ts";

const categoriesRes = await getCategories();
const categories = categoriesRes.data.data.categories;
export const getProductsFilters = (products: IProduct[]) =>  {
    return  {
        filters: {
            titleFilters: products.map((category) => {
                return {
                    text: category.title,
                    value: category.title,
                } as ColumnFilterItem;
            }),
            categoriesFilters: categories.map((category) => {
                return {
                    text: category.title,
                    value: category._id,
                } as ColumnFilterItem;
            }),
        },
        filterFunctions: {
            onTitleFilter: (value: any, record: IProduct) => record.title?.indexOf(value) === 0,
            onCategoryFilter: (value: any, record: IProduct) => record.category?.indexOf(value) === 0,
        },
        sorters: {
            titleSorter: (a: IProduct, b: IProduct) => {
                return (a.title || '').localeCompare(b.title || '');
            },
            categorySorter: (a: IProduct, b: IProduct) => {
                return (a.category || '').localeCompare(b.category || '');
            },
            priceSorter: (a: IProduct, b: IProduct) => {
                return (a.price || '').localeCompare(b.price || '');
            },
        },
    }

}