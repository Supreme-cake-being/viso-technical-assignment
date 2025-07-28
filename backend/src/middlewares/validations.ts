import { validateBody, validateQuery } from 'decorators';
import { CuisineTypes } from 'helpers';
import Joi from 'joi';

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;

export const signupSchema = Joi.object({
  name: Joi.string().min(3).max(64).required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().pattern(passwordRegex).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().pattern(passwordRegex).required(),
});

export const signupValidation = validateBody(signupSchema);
export const loginValidation = validateBody(loginSchema);

const cuisineValues = Object.values(CuisineTypes);

export const getRecipesSchema = Joi.object({
  name: Joi.string(),
  ingredients: Joi.string(),
  cuisine: Joi.string().valid(...cuisineValues),
});

export const createRecipeSchema = Joi.object({
  name: Joi.string().required(),
  ingredients: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        quantity: Joi.number().required(),
        unit: Joi.string().required(),
      })
    )
    .required(),
  cuisine: Joi.string()
    .valid(...cuisineValues)
    .required(),
  cookingInstructions: Joi.string().required(),
  details: Joi.string().required(),
});

export const rateRecipeSchema = Joi.object({
  rating: Joi.number().required(),
});

export const getRecipesValidation = validateQuery(getRecipesSchema);
export const createRecipeValidation = validateBody(createRecipeSchema);
export const rateRecipeValidation = validateBody(rateRecipeSchema);
