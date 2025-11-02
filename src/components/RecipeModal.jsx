import React, { useState } from "react";
import { FaTimes, FaPlay, FaStop } from "react-icons/fa";

export default function RecipeModal({ recipe, onClose }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!recipe) return null;

  // Collect ingredients dynamically
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient) ingredients.push(`${ingredient} - ${measure}`);
  }

  // Play or Stop speech
  const toggleSpeech = () => {
    if (!window.speechSynthesis) return;

    if (!isSpeaking) {
      // Start speaking
      const utterance = new SpeechSynthesisUtterance(recipe.strInstructions);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.lang = "en-US";

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleClose = () => {
    window.speechSynthesis.cancel();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-800 dark:text-gray-100 hover:text-red-500 transition"
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-2">{recipe.strMeal}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
          {recipe.strCategory}
        </p>

        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h3 className="font-semibold mb-2">Ingredients:</h3>
        <ul className="list-disc list-inside mb-4">
          {ingredients.map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          Instructions:
          <button
            onClick={toggleSpeech}
            className={`bg-indigo-500 text-white p-1 rounded hover:bg-indigo-600 transition flex items-center gap-1`}
          >
            {isSpeaking ? <FaStop /> : <FaPlay />}
            {isSpeaking ? "Stop" : "Play"}
          </button>
        </h3>

        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {recipe.strInstructions}
        </p>
      </div>
    </div>
  );
}
