import axios from "axios";

export const useRecipes = async () => {
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_API + `/recipes`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
