import { ctrlWrapper } from 'decorators';
import { RequestHandler } from 'express';
import { CuisineTypes } from 'generated/prisma';
import { HttpError } from 'helpers';
import prisma from 'prisma/prismaClient';

const getRecipes: RequestHandler = async (req, res) => {
  const { name, ingredients, cuisine } = req.query;

  const ingredientList =
    typeof ingredients === 'string'
      ? ingredients.split(',').map(i => i.trim().toLowerCase())
      : [];

  const searchedRecipes = await prisma.recipe.findMany({
    where: {
      AND: [
        name
          ? { name: { contains: name.toString(), mode: 'insensitive' } }
          : {},
        cuisine
          ? { cuisine: cuisine.toString().toUpperCase() as CuisineTypes }
          : {},
        ingredientList?.length > 0
          ? {
              ingredients: {
                some: {
                  ingredient: {
                    name: {
                      in: ingredientList,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            }
          : {},
      ],
    },
  });

  res.json(searchedRecipes);
};

const getPersonalRecipes: RequestHandler = async (req, res) => {
  const { name, ingredients, cuisine } = req.query;
  const user = req.user;

  const ingredientList =
    typeof ingredients === 'string'
      ? ingredients.split(',').map(i => i.trim().toLowerCase())
      : [];

  const searchedRecipes = await prisma.recipe.findMany({
    where: {
      AND: [
        { userId: user?.id },
        name
          ? { name: { contains: name.toString(), mode: 'insensitive' } }
          : {},
        cuisine
          ? { cuisine: cuisine.toString().toUpperCase() as CuisineTypes }
          : {},
        ingredientList?.length > 0
          ? {
              ingredients: {
                some: {
                  ingredient: {
                    name: {
                      in: ingredientList,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            }
          : {},
      ],
    },
  });

  res.json(searchedRecipes);
};

const getRecipeById: RequestHandler = async (req, res) => {
  const { recipeId } = req.params;

  const recipeById = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });
  if (!recipeById) {
    throw HttpError(404, 'Not found');
  }

  res.json({ ...recipeById });
};

const createRecipe: RequestHandler = async (req, res) => {
  const { name, cuisine, cookingInstructions, details, ingredients } = req.body;
  const user = req.user;

  const recipe = await prisma.recipe.create({
    data: {
      name,
      cuisine,
      cookingInstructions,
      details,
      userId: user?.id,
      ingredients: {
        create: ingredients.map((ingredient: any) => ({
          ingredient: {
            connect: { id: ingredient.id },
          },
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        })),
      },
    },
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });
  res.json(recipe);
};

const rateRecipe: RequestHandler = async (req, res) => {
  const { recipeId } = req.params;
  const { rating } = req.body;

  const updatedRecipe = await prisma.recipe.update({
    where: { id: recipeId },
    data: { rating },
  });

  res.json({ updatedRecipe });
};

export default {
  getRecipes: ctrlWrapper(getRecipes),
  getPersonalRecipes: ctrlWrapper(getPersonalRecipes),
  getRecipeById: ctrlWrapper(getRecipeById),
  createRecipe: ctrlWrapper(createRecipe),
  rateRecipe: ctrlWrapper(rateRecipe),
};
