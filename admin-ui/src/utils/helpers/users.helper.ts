import {IUser} from "../../../../shared";
import {ColumnFilterItem} from "antd/es/table/interface";

export const getUsersFilters = (users: IUser[]) =>  {
    return  {
        filters: {
            usernameFilters: users.map((user) => {
                return {
                    text: user.username,
                    value: user.username,
                } as ColumnFilterItem;
            }),
            firstNameFilters: users.map((user) => {
                return {
                    text: user.firstName,
                    value: user.firstName,
                } as ColumnFilterItem;
            }),
            lastNameFilters: users.map((user) => {
                return {
                    text: user.lastName,
                    value: user.lastName,
                } as ColumnFilterItem;
            }),
            emailFilters: users.map((user) => {
                return {
                    text: user.email,
                    value: user.email,
                } as ColumnFilterItem;
            }),
            typeFilters: [
                {
                    text: 'Admin',
                    value: 'Admin',
                },
                {
                    text: 'Customer',
                    value: 'Customer',
                }
            ],
        },
        filterFunctions: {
            onUsernameFilter: (value: any, record: IUser) => record.username?.indexOf(value) === 0,
            onFirstNameFilter: (value: any, record: IUser) => record.firstName?.indexOf(value) === 0,
            onLastNameFilter: (value: any, record: IUser) => record.lastName?.indexOf(value) === 0,
            onEmailFilter: (value: any, record: IUser) => record.email?.indexOf(value) === 0,
            onTypeFilter: (value: any, record: IUser) => record.__t?.indexOf(value) === 0,
        },
        sorters: {
            usernameSorter: (a: IUser, b: IUser) => {
                return (a.username || '').localeCompare(b.username || '');
            },
            firstNameSorter: (a: IUser, b: IUser) => {
                return (a.firstName || '').localeCompare(b.firstName || '');
            },
            lastNameSorter: (a: IUser, b: IUser) => {
                return (a.lastName || '').localeCompare(b.lastName || '');
            },
            emailSorter: (a: IUser, b: IUser) => {
                return (a.email || '').localeCompare(b.email || '');
            },
            typeSorter: (a: IUser, b: IUser) => {
                return (a.__t || '').localeCompare(b.__t || '');
            },
        },
    }

}