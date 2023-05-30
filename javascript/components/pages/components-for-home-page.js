/* Сохраненный объект ответа по запросу топ-250 IMDb */
import { top250Movies } from "../../responses/top250imdb/top250Movies.js";

/* Модуль управления слайдером с рекоммендациями */
import { recommendationsSliderControlls } from "../../modules/slider-module/slider-module.js";


/* ------- Компоент блока "About" -------- */
const aboutSection = {
  makePageSection: (id) => {
    const pageContainer = document.getElementById(id);

    const section = document.createElement("section");
    section.classList.add("about");
    section.innerHTML = `
    <div class="about__body">
        <div>
            <h1>MovieMate</h1>
            <p>Our service uses a huge database of IMDb and helps you find the information you need about the film or series.</p>
            <p>Registering will give you even more options! You will be able to mark movies as "watched" or "watch later". Additionally, you will have the option to write notes so that you can always remember what you liked about a movie in the future.</p>
        </div>
    </div>`;
    pageContainer.append(section);
    return;
  },
};
/* ---------------------------------------- */


/* --- Компонент блока "Recommendations" --- */
const recommendationSection = (function() {

  /* -------- model -------- */
  function Model() {
    this.view = null;
    this.settings = {
      keyForSessionStorage: "MovieMate!Key",
      IMDbKey: "k_zv8c981k",
      timerIDForAbort: null,
    };
  };

  Model.prototype.initialize = function(view) {
    this.view = view;
  };

  Model.prototype.makeSliderContainer = function() {
    this.view.makeSliderContainer();
  };

  Model.prototype.startLoader = function() {
    this.view.startLoader();
  };

  Model.prototype.stopLoader = function() {
    this.view.stopLoader();
  };

  Model.prototype.getData = function() {
    if (sessionStorage.getItem(this.settings.keyForSessionStorage) !== null) {
      const JSONarrayWithMoviesData = sessionStorage.getItem(this.settings.keyForSessionStorage);
      const arrayWithMoviesData = JSON.parse(JSONarrayWithMoviesData);
      this.stopLoader();
      this.view.makeSlider(arrayWithMoviesData);
    } else {
        this.makeRequest();
    }
  };

  Model.prototype.makeRequest = async function() {
    try {
      const controller = new AbortController();
      const signal = controller.signal;

      this.settings.timerIDForAbort = setTimeout(() => {
          controller.abort();
      }, 10000);

      //const response = await fetch(`https://imdb-api.com/en/API/Top250TVs/${this.settings.IMDbKey}`, {signal});
      //const data = await response.json();
      const data = top250Movies

      const numbersOfMoviesFromTop250 = this.get10RandomNumbers();
      const arrayWithMoviesData = [];

      for (let i = 0; i < numbersOfMoviesFromTop250.length; i++) {
          const movieData = data.items[numbersOfMoviesFromTop250[i]];
          arrayWithMoviesData.push(movieData);
      };

      const dataArrayToStorage = JSON.stringify(arrayWithMoviesData);
      sessionStorage.setItem(this.settings.keyForSessionStorage, dataArrayToStorage);

      this.stopLoader();
      this.view.makeSlider(arrayWithMoviesData);

    } catch(error) {
        if (error.name === "AbortError") {
            const message = "The request was canceled because the waiting time was up. This may be because the server is overloaded.";
            console.warn(message);
            this.stopLoader();
            this.view.makeErrorMessage(message);
        } else {
            const message =`There was an error (name - ${error.name}, message - ${error.message}) in the recommendation block! We don't know how to deal with it, but you can try to reload the page and maybe it will work...`;
            console.warn(message);
            this.stopLoader();
            this.view.makeErrorMessage(message);
        };
    };
  };

  Model.prototype.get10RandomNumbers = function() {
    const numbers = [];

    while (numbers.length < 10) {
      const randomNumber = Math.floor(Math.random() * 250) + 1;
      if (!numbers.includes(randomNumber)) {
        numbers.push(randomNumber);
      }
    };
    
    return numbers;
  };

  Model.prototype.removeEventListeners = function() {
    this.view.removeEventListeners();
  };

  /* ------ end model ------ */ 


  /* --------- view -------- */ 
  function View() {
    this.container = null;
    this.loader = null;
    this.sliderContainer = null;
    this.controllsObject = null;
  };

  View.prototype.initialize = function(id) {
    this.container = document.getElementById(id);
  };

  View.prototype.startLoader = function() {
    this.sliderContainer.classList.add("RSC-loading-style");

    const loaderContainer = document.createElement("div");
    loaderContainer.classList.add("MM-loader");

    for (let i = 0; i < 3; i++) {
        const loaderItem = document.createElement("div");
        loaderContainer.append(loaderItem);
    }

    this.loader = loaderContainer;
    this.sliderContainer.append(loaderContainer);
  };

  View.prototype.stopLoader = function() {
    this.sliderContainer.classList.remove("RSC-loading-style");
    this.loader.remove();
  };

  View.prototype.makeSliderContainer = function() {
    const container = document.createElement("section");
    container.classList.add("recommendations");
    this.container.append(container);

    const titleOfSection = document.createElement("h1");
    titleOfSection.textContent = "Recommendations";
    container.append(titleOfSection);

    const sliderContainer = document.createElement("div");
    sliderContainer.setAttribute("id", "recommendations-slider");
    sliderContainer.classList.add("recommendations__slider-container");
    container.append(sliderContainer);

    this.sliderContainer = sliderContainer;
  };

  View.prototype.makeSlider = function(data) {
    const leftButtonHTML = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.1666 21.3333L23.6666 30.6666C24.3333 31.3333 25.3333 31.3333 26 30.6666C26.6666 30 26.6666 29 26 28.3333L17.8333 20L26 11.6666C26.6666 11 26.6666 9.99998 26 9.33331C25.6666 8.99998 25.3333 8.83331 24.8333 8.83331C24.3333 8.83331 24 8.99998 23.6666 9.33331L14.1666 18.6666C13.5 19.5 13.5 20.5 14.1666 21.3333C14.1666 21.1666 14.1666 21.1666 14.1666 21.3333Z"/>
    </svg>`;

    const rightButtonHTML = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.8333 18.6666L16.3333 9.33329C15.6667 8.66663 14.6667 8.66663 14 9.33329C13.3333 9.99996 13.3333 11 14 11.6666L22.1667 20L14 28.3333C13.3333 29 13.3333 30 14 30.6666C14.3333 31 14.6667 31.1666 15.1667 31.1666C15.6667 31.1666 16 31 16.3333 30.6666L25.8333 21.3333C26.5 20.5 26.5 19.5 25.8333 18.6666C25.8333 18.8333 25.8333 18.8333 25.8333 18.6666Z"/>
    </svg>`;

    const leftButton = document.createElement("button");
    leftButton.classList.add("recommendations__slider-left");
    leftButton.classList.add("slider-left");
    leftButton.setAttribute("id", "RS-LB");
    leftButton.setAttribute("type", "button");
    leftButton.innerHTML = leftButtonHTML;
    this.sliderContainer.append(leftButton);

    const sliderBody = document.createElement("div");
    sliderBody.classList.add("recommendations__slider-body");
    sliderBody.classList.add("slider-body");
    this.sliderContainer.append(sliderBody);

    const sliderLine = document.createElement("div");
    sliderLine.classList.add("recommendations__slider-line");
    sliderLine.classList.add("slider-line");
    sliderBody.append(sliderLine);

    data.forEach(element => {
        const sliderItem = document.createElement("div");
        sliderItem.classList.add("recommendations__item");
        sliderItem.classList.add("slider-item");

        const ratingContainer = document.createElement("div");
        
        const ratingContainerStarContainer = document.createElement("div");
        ratingContainerStarContainer.classList.add("slider-item__imdb-rating-start");
        ratingContainerStarContainer.innerHTML += `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 7.57502C16.575 7.20002 16.275 6.75001 15.9 6.75001L11.625 6.15001L9.675 2.25001C9.6 2.10001 9.525 2.02501 9.375 1.95001C9 1.72501 8.55 1.87501 8.325 2.25001L6.45 6.15001L2.175 6.75001C1.95 6.75001 1.8 6.82502 1.725 6.97502C1.425 7.27502 1.425 7.72501 1.725 8.02501L4.8 11.025L4.05 15.3C4.05 15.45 4.05 15.6 4.125 15.75C4.35 16.125 4.8 16.275 5.175 16.05L9 14.025L12.825 16.05C12.9 16.125 13.05 16.125 13.2 16.125C13.275 16.125 13.275 16.125 13.35 16.125C13.725 16.05 14.025 15.675 13.95 15.225L13.2 10.95L16.275 7.95001C16.425 7.87501 16.5 7.72502 16.5 7.57502Z" fill="#FFE814"/></svg>`;

        const paragraphWithRatingValue = document.createElement("p");
        paragraphWithRatingValue.classList.add("slider-item__imdb-rating");
        paragraphWithRatingValue.textContent = element.imDbRating;

        const posterContainer = document.createElement("div");
        posterContainer.classList.add("slider-item__poster");

        const poster = document.createElement("img");
        poster.setAttribute("src", element.image);
        poster.setAttribute("alt", "Movie poster");

        const textInfoContainer = document.createElement("div");
        
        const title = document.createElement("h2");
        title.textContent = element.title;

        const year = document.createElement("p");
        year.textContent = element.year;

        const learnMoreButton = document.createElement("button");
        learnMoreButton.classList.add("slider-item__learn-more");
        learnMoreButton.setAttribute("type", "button");
        learnMoreButton.setAttribute("IMDbID", element.id);
        learnMoreButton.textContent = "Learn more";
        
        sliderLine.append(sliderItem);
        sliderItem.append(ratingContainer);
        ratingContainer.append(ratingContainerStarContainer);
        ratingContainer.append(paragraphWithRatingValue);
        sliderItem.append(posterContainer);
        posterContainer.append(poster);
        sliderItem.append(textInfoContainer);
        textInfoContainer.append(title);
        textInfoContainer.append(year);
        textInfoContainer.append(learnMoreButton);
    });

    const rightButton = document.createElement("button");
    rightButton.classList.add("recommendations__slider-right");
    rightButton.classList.add("slider-right");
    rightButton.setAttribute("id", "//");
    rightButton.setAttribute("type", "button");
    rightButton.innerHTML = rightButtonHTML;
    this.sliderContainer.append(rightButton);

    this.controllsObject = new recommendationsSliderControlls.SliderController();
    this.controllsObject.start(this.sliderContainer);
  };

  View.prototype.makeErrorMessage = function(message) {
    this.sliderContainer.classList.add("RSC-loading-style");
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("recommendations__slider-container-error")
    errorMessage.textContent = message;
    this.sliderContainer.append(errorMessage);
  };

  View.prototype.removeEventListeners = function() {
    this.controllsObject.stop();
  };
  /* ------- end view ------ */


  /* ------ controller ----- */ 
  function Controller() {
    this.model = null;
  };

  Controller.prototype.initialize = function(model) {
    this.model = model;
  };

  Controller.prototype.start = function() {
    this.model.makeSliderContainer();
    this.model.startLoader();
    this.model.getData();
  };

  Controller.prototype.removeEventListeners = function() {
    this.model.removeEventListeners();
  };
  /* --- end controller ---- */ 


  /* --- RecommendationSection --- */
  function RecommendationSection() {
    this.model = new Model();
    this.view = new View();
    this.controller = new Controller();

    this.model.initialize(this.view);
    this.controller.initialize(this.model);
  };

  RecommendationSection.prototype.start = function(id) {
    this.view.initialize(id);
    this.controller.start();
  };

  RecommendationSection.prototype.stop = function() {
    this.controller.removeEventListeners();
  };
  /* - end RecommendationSection - */

  return {
    RecommendationSection,
    start: RecommendationSection.prototype.start,
    stop: RecommendationSection.prototype.stop,
  };
  
}());
/* ---------------------------------------- */


/* ------ Компоненты блока "Account" ------ */
const registrationSection = {
  makePageSection: (id) => {
    const pageContainer = document.getElementById(id);

    const section = document.createElement("section");
    section.classList.add("registration");
    section.innerHTML = `
        <div class="registration__body">
            <h1>Not registered yet?</h1>
            <p>Don't miss out on all the amazing features and benefits that come with being a member. Sign up now and unlock a whole new world of possibilities!</p>
            <div>
                <button id="registration-sign-up" type="button">Sign Up</button>
                <button id="registration-log-in" type="button">Log In</button>
            </div>
        </div>`;
    pageContainer.append(section);
    return;
  },
};

const accountSection = {
  makePageSection: (id) => {
    const pageContainer = document.getElementById(id);

    const section = document.createElement("section");
    section.classList.add("account");
    section.innerHTML = `
    <div class="account__body">
        <p>Great, you're registered! Now you can go to your profile page and manage your list of movies you've watched, your list of movies you want to watch in the future, leave notes for yourself and play the game. We invite you to try it now.</p>
        <div>
            <button id="account-my-account" type="button">My Account</button>
            <button id="account-game" type="button">Play the game</button>
        </div>
    </div>`;
    pageContainer.append(section);
    return;
  },
};
/* ---------------------------------------- */


export const homeComponents = {
  about: aboutSection,
  recommendations: recommendationSection,
  registration: registrationSection,
  account: accountSection,
};