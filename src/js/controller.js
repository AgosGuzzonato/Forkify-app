'use strict';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

//import 'core-js/stable'; //pollifyling almost everything
//import 'regenerator-runtime/runtime'; //pollifyling async awit
//import { async } from 'regenerator-runtime';
import bookmarksView from './views/bookmarksView.js';
/*
if (module.hot) {
  module.hot.accept();
}
*/
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); //window.location is the entire url

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Update bookmark view
    bookmarksView.update(model.state.bookmarks);

    // 2)LOAD THE RECIPE
    await model.loadRecipe(id); //if i call an async function i should put await

    // 3) RENDERING THE RECIPE
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
//controlRecipes(); Solved with event list

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1.Get search
    const query = searchView.getQuery();
    if (!query) return;

    //2.Load search
    await model.loadSearchResults(query);

    //3. Render result
    resultsView.render(model.getSearchResultsPage(1));

    // 4. Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1. Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2. Render new pagination buttons
  paginationView.render(model.state.search);
};

//SERVINGS
const controlServings = function (newServings) {
  // 1. Update the recipe servings (in state)
  model.updateServings(newServings);
  // 2. Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//BOOKMARK
const controlAddBookmark = function () {
  // Add or remove a bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else model.deleteBookmark(model.state.recipe.id);
  // Update recipe view
  recipeView.update(model.state.recipe);
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show spinner
    addRecipeView.renderSpinner();
    // Upload recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display success
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change ID in the url without reload
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close a form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('e', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
