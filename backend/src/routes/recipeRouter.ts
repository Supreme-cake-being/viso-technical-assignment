import express from 'express';
import recipeController from 'controllers/recipeController';
import {
  isEmptyBody,
  isAuthenticated,
  isValidId,
  getRecipesValidation,
  createRecipeValidation,
  rateRecipeValidation,
} from 'middlewares';

const recipeRouter = express.Router();

recipeRouter.get(
  '/',
  isAuthenticated,
  getRecipesValidation,
  recipeController.getRecipes
);
recipeRouter.get(
  '/personal',
  isAuthenticated,
  getRecipesValidation,
  recipeController.getPersonalRecipes
);
recipeRouter.get(
  '/:recipeId',
  isAuthenticated,
  isValidId('recipeId'),
  recipeController.getRecipeById
);

recipeRouter.post(
  '/',
  isAuthenticated,
  isEmptyBody,
  createRecipeValidation,
  recipeController.createRecipe
);

recipeRouter.put(
  '/:recipeId',
  isAuthenticated,
  isValidId('recipeId'),
  rateRecipeValidation,
  recipeController.rateRecipe
);

export default recipeRouter;
