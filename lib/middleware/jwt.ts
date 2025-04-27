import {jwtDecode} from 'jwt-decode';

const isTokenExpired = (token: string) => {
  if (!token) return true;

  const decodedToken: any = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000);

  return decodedToken.exp < currentTime;
};

export default isTokenExpired;