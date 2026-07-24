import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode'; 

export const getUserIdFromToken = (): string | null => {
  const token = Cookies.get('commerce_hub_token'); 

  if (!token) {
    return null;
  }

  try {
    const decodedToken: { id: string } = jwtDecode(token); 

    return decodedToken.id;
  } catch (error) {
    console.error('Failed to decode token', error);
    return null;
  }
};