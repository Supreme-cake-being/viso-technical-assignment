import axios from "axios";

interface ISignup {
  name: string;
  email: string;
  password: string;
  onSuccess: () => void;
}

export const useSignup = ({ name, email, password, onSuccess }: ISignup) => {
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API + `/users/signup`,
        { name, email, password }
      );

      onSuccess();

      return { data: response.data, error: null };
    } catch (error) {
      console.log(error);
    }
  };

  return { handleSubmit };
};
