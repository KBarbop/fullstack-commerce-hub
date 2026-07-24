import { useState } from 'react';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router';
import {deleteCategory, getCategories, IModalProps} from "../../utils";

function DeleteCategoryModal({ id, open, setOpen, setCategories }: IModalProps) {
  const navigate = useNavigate();
  /* Modal Data */
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(
    'Are you sure you want to delete this category? All data will be completely lost.',
  );

  const fetchCategories = async () => {
    try {
        const categoriesRes = await getCategories();
        if (categoriesRes.status === 200) {
            if (setCategories) {
                setCategories(categoriesRes.data.data.categories);
            }
        }
    } catch (e) {
        console.error(e);
    }
  }

  const handleOk = async () => {
    try {
      setModalText('Deleting Category. Please wait...');
      setConfirmLoading(true);
      await deleteCategory(id);
      await fetchCategories();
      setOpen(false);
      setConfirmLoading(false);
      navigate('/categories');
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };
  /* Modal Data */
  return (
    <>
      <Modal
        title="Delete Category"
        open={open}
        confirmLoading={confirmLoading}
        footer={[
          <Button type="text" onClick={handleCancel} key={`Cancel Button`}>
            Cancel
          </Button>,
          <Button
            danger
            onClick={() => {
              handleOk().catch((e) => {
                console.error(e);
              });
            }}
            key={`Delete Button`}
          >
            Delete
          </Button>,
        ]}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
}

export default DeleteCategoryModal;
