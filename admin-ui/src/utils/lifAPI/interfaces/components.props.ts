import {ICategory, IOrder, IProduct, IUser} from "../../../../../shared";

export interface ICategoriesTableProps {
    categories: ICategory[];
    setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
}

export interface IProductsTableProps {
    products: IProduct[];
    setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
}

export interface IOrdersTableProps {
    orders: IOrder[];
    setOrders: React.Dispatch<React.SetStateAction<IOrder[]>>;
}

export interface IUsersTableProps {
    users: IUser[];
    setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
}

export interface IModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    id: string;
    rerender?: boolean;
    setRerender?: React.Dispatch<React.SetStateAction<boolean>>;
    setCategories?: React.Dispatch<React.SetStateAction<ICategory[]>>;
    setProducts?: React.Dispatch<React.SetStateAction<IProduct[]>>;
    setOrders?: React.Dispatch<React.SetStateAction<IOrder[]>>;
    setUsers?: React.Dispatch<React.SetStateAction<IUser[]>>;
    menuToBeDeleted?: string;
    fetchData?: () => Promise<void>;
    scrollToTop?: () => void;
}