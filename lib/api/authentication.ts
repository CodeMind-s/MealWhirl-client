import { api } from "../middleware/api";

export async function Login(data:{ email: string; password: string }) {
  try {
      const response = await api.post(`http://localhost:5001/mealwhirl_server/api/v1/auth/login`, data)
      return response.data;
  } catch (error) {
      console.log('Login failed:');
      throw error;
  }
}

export async function signUp(data: any) {
  try {
      const response = await api.post(`/auth/register`,data)
      return response.data;
  } catch (error) {
      console.log('Login failed:');
      throw error;
  }
}

// export async function checkUserAvailability(email: string) {
//   try {
//       const response = await api.get(`/auth/check-user-availability/${email}`)
//       return response;
//   } catch (error) {
//       console.log('Login failed:');
//       throw error;
//   }
// }


// export async function verifyUserEmail(token: string) {
//   try {
//       const response = await api.get(`/auth/verify-email/${token}`)
//       return response;
//   } catch (error) {
//       console.log('Login failed:');
//       throw error;
//   }
// }


// export async function providerRegistration(userdata: any) {
//   try {
//       const response = await api.post(`/auth/provider-register`,userdata)
//       return response.data;
//   } catch (error) {
//       console.log('Login failed:');
//       throw error;
//   }
// }