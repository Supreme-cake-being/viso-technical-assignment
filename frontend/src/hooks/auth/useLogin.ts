import axios from "axios";

interface ILogin {
  email: string;
  password: string;
  onSuccess: () => void;
}

export const useLogin = ({ email, password, onSuccess }: ILogin) => {
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API + `/users/login`,
        { email, password },
        { withCredentials: true }
      );

      axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;

      onSuccess();

      return { data: response.data, error: null };
    } catch (error) {
      console.log(error);
    }
  };

  return { handleSubmit };
};
