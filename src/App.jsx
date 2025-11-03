import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSun, FaMoon, FaUtensils, FaYoutube } from "react-icons/fa";
import RecipeModal from "./components/RecipeModal";

function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Example queries on load
  const exampleQueries = ["Chicken", "Pasta", "Cake"];

  // Debounce timer
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Fetch recipes
  const fetchRecipes = async (searchTerm) => {
    if (!searchTerm) return;
    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
      );
      setRecipes(res.data.meals || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Initial load: show example recipes
  useEffect(() => {
    const randomExample =
      exampleQueries[Math.floor(Math.random() * exampleQueries.length)];
    fetchRecipes(randomExample);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search while typing
  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);
    const timeout = setTimeout(() => {
      if (query) fetchRecipes(query);
    }, 700); // wait 700ms after last key press
    setTypingTimeout(timeout);
  }, [query, typingTimeout]);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-500">
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaUtensils /> Recipe Finder
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-2 rounded-full transition hover:scale-110"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </header>

        {/* Search */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex justify-center my-4"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes..."
            className="p-2 w-[80%] md:w-[30%] rounded-l-md border border-gray-300 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            type="submit"
            onClick={() => fetchRecipes(query)}
            className="bg-indigo-500 text-white px-4 rounded-r-md hover:bg-indigo-600 transition"
          >
            <FaSearch />
          </button>
        </form>

        {/* Recipes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {recipes.length === 0 && (
            <p className="text-center col-span-full">No recipes found.</p>
          )}
          {recipes.map((recipe) => (
            <div
              key={recipe.idMeal}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition hover:scale-105 cursor-pointer"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">{recipe.strMeal}</h2>
                  <FaUtensils className="text-indigo-500" />
                </div>

                {/* Category */}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Category: {recipe.strCategory || "N/A"}
                </p>

                {/* Small description */}
                <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                  {recipe.strInstructions
                    ? recipe.strInstructions.slice(0, 80) + "..."
                    : "No description available."}
                </p>

                {/* YouTube Link */}
                {recipe.strYoutube && (
                  <a
                    href={recipe.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-red-500 text-sm hover:underline mt-1"
                  >
                    <FaYoutube size={16} /> Watch Video
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recipe Modal */}
        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
