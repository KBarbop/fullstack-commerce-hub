import {ICategory} from "../../../../shared";
import {ColumnFilterItem} from "antd/es/table/interface";

export const getCategoriesFilters = (categories: ICategory[]) =>  {
    return  {
        filters: {
            titleFilters: categories.map((category) => {
                return {
                    text: category.title,
                    value: category.title,
                } as ColumnFilterItem;
            }),
        },
        filterFunctions: {
            onTitleFilter: (value: any, record: ICategory) => record.title?.indexOf(value) === 0,
        },
        sorters: {
            titleSorter: (a: ICategory, b: ICategory) => {
                return (a.title || '').localeCompare(b.title || '');
            },
        },
    }

}