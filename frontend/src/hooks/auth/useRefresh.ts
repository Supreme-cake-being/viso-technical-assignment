import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const useRefresh = async (token: RequestCookie | undefined) => {
  try {
    if (!token) {
      return console.log("No token");
    }

    axios.defaults.headers.common.Authorization = `Bearer ${token.value}`;

    const response = await axios.get(
      process.env.NEXT_PUBLIC_API + `/users/current`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        withCredentials: true,
      }
    );
    
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
