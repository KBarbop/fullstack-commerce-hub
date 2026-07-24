"use client";

import { useState, useEffect } from "react";
import { Ingredient } from "@/types";
import styles from "./ingredients.module.css";

interface IngredientsProps {
  ingredients_en: Ingredient[];
  ingredients_el: Ingredient[];
  currentLocale: string;
  onIngredientsChange: (
    selectedIngredients: Array<{
      option: string;
      index: number;
      en: string;
      el: string;
    }>
  ) => void;
}

const Ingredients: React.FC<IngredientsProps> = ({
  ingredients_en,
  ingredients_el,
  currentLocale,
  onIngredientsChange,
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<
    Array<{
      option: string;
      index: number;
      en: string;
      el: string;
    }>
  >([]);

  useEffect(() => {
    const initialSelection: Array<{
      option: string;
      index: number;
      en: string;
      el: string;
    }> = [];
    ingredients_en.forEach((ingredient, index) => {
      initialSelection.push({
        option: ingredient.options[0],
        index: 0,
        en: ingredient.options[0],
        el: ingredients_el[index]?.options[0] || "",
      });
    });

    setSelectedIngredients(initialSelection);
    onIngredientsChange(initialSelection);
  }, [ingredients_en, ingredients_el]);

  const handleIngredientChange = (
    ingredientIndex: number,
    optionIndex: number
  ) => {
    const updatedSelection = selectedIngredients.map((selection, index) =>
      index === ingredientIndex
        ? {
            option: ingredients_en[ingredientIndex].options[optionIndex],
            index: optionIndex,
            en: ingredients_en[ingredientIndex].options[optionIndex],
            el: ingredients_el[ingredientIndex]?.options[optionIndex] || "",
          }
        : selection
    );

    setSelectedIngredients(updatedSelection);
    onIngredientsChange(updatedSelection);
  };

  return (
    <div className={styles.ingredientsContainer}>
      {ingredients_en.map((ingredient, index) => (
        <div className={styles.optionGroup} key={index}>
          <label htmlFor={`ingredient-${index}`}>
            {currentLocale === "el"
              ? ingredients_el[index]?.title || ingredient.title
              : ingredient.title}
            :
          </label>
          <select
            id={`ingredient-${index}`}
            value={selectedIngredients[index]?.index || 0}
            onChange={(e) =>
              handleIngredientChange(index, Number(e.target.value))
            }
          >
            {ingredient.options.map((option, optionIndex) => (
              <option key={optionIndex} value={optionIndex}>
                {currentLocale === "el"
                  ? ingredients_el[index]?.options[optionIndex]
                  : option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default Ingredients;
