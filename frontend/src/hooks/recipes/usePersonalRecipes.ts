import axios from "axios";

export const usePersonalRecipes = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API + `/recipes/personal`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
