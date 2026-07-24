import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '@/store/auth-slice/auth-slice';
import { setAddresses } from '@/store/addreses-slice/addresses-slice'; 
import { getUserIdFromToken } from '@/util/auth/getId';

const useAuth = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkAuth = async () => {
      const userId = getUserIdFromToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (userId) {
        try {
          const response = await axios.get(`${apiUrl}/users/get-user/${userId}`);
          
          if (response.status === 200) {
            const user = response.data.data.user;
            dispatch(setUser(user)); 
            if (user.addresses) {
              dispatch(setAddresses(user.addresses)); 
            }
          }
        } catch (error) {
          console.error('Failed to fetch user data', error);
        }
      } else {
        dispatch(setUser(null));
      }

      setLoading(false);
    };

    checkAuth();
  }, [dispatch]);

  return loading; 
};

export default useAuth;
