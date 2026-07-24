import * as yup from 'yup';

const addressSchema = yup.object().shape({
  fullAddress: yup.string().required('Full address is required'),
  bellName: yup.string().required("Doorbell Name is required"),
});
