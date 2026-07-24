import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space, Table, Tooltip } from 'antd';
import { DeleteFilled, EditFilled, EyeFilled } from '@ant-design/icons';
import {ICategory, IUser} from '../../../../shared';
import {useAppSelector, userSelector} from "../../store";
import DeleteCategoryModal from "../modals/deleteCategory.modal.component.tsx";
import {ICategoriesTableProps, getCategoriesFilters} from "../../utils";

function CategoriesTable({ categories, setCategories }: ICategoriesTableProps) {
    /* Modal Data */
    const [open, setOpen] = useState(false);
    const [categoryToBeDeleted, setCategoryToBeDeleted] = useState('');
    const setOpenModal = (open: boolean, categoryID: string) => {
        setOpen(open);
        setCategoryToBeDeleted(categoryID);
    };
    /* Modal Data */
    const navigate = useNavigate();
    const user: IUser = useAppSelector(userSelector);
    const categoriesFilters = getCategoriesFilters(categories);

    const columns = [
        {
            title: 'Τίτλος',
            dataIndex: 'title_el',
            key: 'title',
            sorter: categoriesFilters.sorters.titleSorter,
            filters: categoriesFilters.filters.titleFilters,
            onFilter: categoriesFilters.filterFunctions.onTitleFilter,

        },
        {
            title: 'Περιγραφή',
            dataIndex: 'description_el',
            key: 'description',
        },
        {
            title: 'Επιλογές',
            key: 'actions',
            render: (_, record: ICategory) => (
                <Space size="middle">
                    <Tooltip title="Preview">
                        <Button
                            type="text"
                            icon={<EyeFilled />}
                            onClick={() => {
                                navigate(`/categories/${record._id}`);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditFilled />}
                            onClick={() => {
                                navigate(`/edit-category/${record._id}`);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            danger
                            type="text"
                            icon={<DeleteFilled />}
                            onClick={() => {
                                setOpenModal(true, record._id || '');
                            }}
                        />
                    </Tooltip>
                    <DeleteCategoryModal
                        id={categoryToBeDeleted}
                        open={open}
                        setOpen={setOpen}
                        setCategories={setCategories}
                    />
                </Space>
            ),

        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={categories} />
    </>
);
}

export default CategoriesTable;
