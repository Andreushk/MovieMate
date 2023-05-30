// Запасной запрос (если приложение достигнет лимита)
import { responseAboutMovie } from "../../responses/aboutMovie/responseAboutMovie.js";

// Модуль управления слайдером с рекоммендациями
import { recommendationsSliderControlls } from "../../modules/slider-module/slider-module.js"

// Модуль управления галереей с картинками
import { imagesModule } from "../../modules/images-from-movie-module/images-module.js"




export const moviePageModule = (function() {

  /* -------- model -------- */
  function Model() {
    this.view = null;
    this.settings = {
      imdbID: null,
      requestTry: 1,
      IMDBAPIKEY: "k_zv8c981k",
      IMDBAPIKEY2: "k_90mg46g4",
      timerIDForAbort: null,
      
      listOption: null,
    };
  };

  Model.prototype.initialize = function(view) {
    this.view = view;
  };

  Model.prototype.setListsParametrs = function(listOption) {
    this.listOption = listOption
  };

  Model.prototype.setIMDBID = function(id) {
    this.settings.imdbID = id;
  };

  Model.prototype.makeLoader = function() {
    this.view.makeLoader();
  };

  Model.prototype.stopLoader = function() {
    this.view.stopLoader();
  };

  Model.prototype.makeErrorMessageForUser = function(message) {
    this.view.makeErrorMessageForUser(message);
  };

  Model.prototype.renderPage = function(data) {
    this.view.renderPage(data, this.listOption);
  };

  Model.prototype.requestData = async function() {

    try {

      let key = null;

      if (this.settings.requestTry === 1) {
        key = this.settings.IMDBAPIKEY;
      } else {
        key = this.settings.IMDBAPIKEY2;
      };

      const controller = new AbortController();
      const signal = controller.signal;

      this.settings.timerIDForAbort = setTimeout(() => {
        controller.abort();
      }, 10000);

      const response = await fetch(`https://imdb-api.com/en/API/Title/${key}/${this.settings.imdbID}/Posters,Images,Trailer,Wikipedia,`, {signal});
      const data = await response.json();

      //const data = responseAboutMovie;
      
      if (data.errorMessage) {
        const limitError = new Error();
        limitError.name = "Limit";
        limitError.message = "Unfortunately, our application has a limit for using the IMDB API and you have reached the limit of requests per day :("
        throw limitError;
      };
      
      clearTimeout(this.settings.timerIDForAbort);
      this.stopLoader();
      this.renderPage(data);

    } catch(error) {
      if (error.name === "AbortError") {
        const errorMessage = "The wait time is over, maybe the server is overloaded. Try again later.";
        this.stopLoader();
        this.makeErrorMessageForUser(errorMessage);
      } else if (error.name === "Limit") {
        switch(this.settings.requestTry) {
          case(1):
            this.settings.requestTry = 2;
            this.requestData();
            break;
          case(2):
            const errorMessage = error.message;
            this.stopLoader();
            this.makeErrorMessageForUser(errorMessage);
            break;
          default: 
            break;
        };
      } else {
        console.warn(error);
        const errorMessage = "Something went wrong, but you can always try again!";
        this.stopLoader();
        this.makeErrorMessageForUser(errorMessage);
      };
    };

  };

  Model.prototype.removeControllsObject = function() {
    this.view.removeControllsObject();
  };

  Model.prototype.changePlotViewOnMoviePage = function() {
    this.view.changePlotViewOnMoviePage();
  };
  /* ------ end model ------ */ 


  /* --------- view -------- */ 
  function View() {
    this.settings = {
      contentContainer: null,
      images: 0,
      imagesLoaded: 0,

      imagesControllsModule: null,

      sliderContainer: null,
      controllsObject: null,
    };
  };

  View.prototype.setContainer = function(id) {
    this.settings.contentContainer = document.getElementById(id);
  };

  View.prototype.makeLoader = function() {
    const loader = document.createElement("div");
    loader.classList.add("MM-loader");
    loader.setAttribute("id", "MML");

    for (let i = 0; i < 4; i++){
      const loaderItem = document.createElement("div");
      loader.append(loaderItem);
    }

    this.settings.contentContainer.append(loader);
  };

  View.prototype.stopLoader = function() {
    if (document.getElementById("MML") === null) return;
    const loader = document.getElementById("MML");
    loader.remove();
  };

  View.prototype.makeErrorMessageForUser = function(message) {
    const errorSection = document.createElement("section");
    errorSection.classList.add("ROS__error");
    this.settings.contentContainer.append(errorSection);

    const messageParagraph = document.createElement("p");
    messageParagraph.textContent = message;
    errorSection.append(messageParagraph);
  };

  View.prototype.renderPage = function(data, listOption) {
    this.renderTitlePartOfPage(data.title, data.type, data.year, data.runtimeStr, data.imDbRating);
    this.renderPosterAndTrailerPartOfPage(data.image, data.trailer, data.trailer.thumbnailUrl, data.trailer.link);
    this.renderGenreAndControllsPartOfPage(data.genres, listOption);
    this.renderPlotPartOfPage(data.plot);
    this.renderGalleryPartOfPage(data.images.items);
    this.renderDetailsPartOfPage(data.releaseDate, data.type, data.runtimeStr, data.genres, data.actorList, data.countries, data.awards);
    if (data.wikipedia) this.renderMoviInfoPartOfPage(data.wikipedia.plotShort.html);
    this.renderRecommendationsPartOfPage(data.similars);
    this.connectControllsModules();
  };

  View.prototype.renderTitlePartOfPage = function(title, type, year, runtime, imDbRating) {
    const titlePageSection = document.createElement("section");
    titlePageSection.classList.add("movie-title");
    this.settings.contentContainer.append(titlePageSection);

    const body = document.createElement("div");
    body.classList.add("movie-title__body");
    titlePageSection.append(body);

    const infoContainer = document.createElement("div");
    body.append(infoContainer);

    const movieTitle = document.createElement("h1");
    movieTitle.setAttribute("id", "title-of-movie");
    movieTitle.textContent = title;
    infoContainer.append(movieTitle);

    const moreInfoContainer = document.createElement("div");
    infoContainer.append(moreInfoContainer);

    const movieType = document.createElement("p");
    movieType.textContent = type;
    moreInfoContainer.append(movieType);

    const dot1 = document.createElement("span");
    moreInfoContainer.append(dot1);

    const movieYears = document.createElement("p");
    movieYears.textContent = year;
    moreInfoContainer.append(movieYears);

    if (runtime !== null) {
      const dot2 = document.createElement("span");
      moreInfoContainer.append(dot2);

      const movieRuntime = document.createElement("p");
      movieRuntime.textContent = runtime;
      moreInfoContainer.append(movieRuntime);
    };

    const ratingsContainer = document.createElement("div");
    body.append(ratingsContainer);

    const startContainer = document.createElement("div");
    ratingsContainer.append(startContainer);

    const starHTML = ` <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M36.6667 16.8333C36.8334 16 36.1667 15 35.3334 15L25.8334 13.6667L21.5 4.99999C21.3334 4.66666 21.1667 4.49999 20.8334 4.33333C20 3.83333 19 4.16666 18.5 4.99999L14.3334 13.6667L4.83337 15C4.33337 15 4.00004 15.1667 3.83337 15.5C3.16671 16.1667 3.16671 17.1667 3.83337 17.8333L10.6667 24.5L9.00004 34C9.00004 34.3333 9.00004 34.6667 9.16671 35C9.66671 35.8333 10.6667 36.1667 11.5 35.6667L20 31.1667L28.5 35.6667C28.6667 35.8333 29 35.8333 29.3334 35.8333C29.5 35.8333 29.5 35.8333 29.6667 35.8333C30.5 35.6667 31.1667 34.8333 31 33.8333L29.3334 24.3333L36.1667 17.6667C36.5 17.5 36.6667 17.1667 36.6667 16.8333Z" fill="#FFE814"/></svg>`;
    ratingsContainer.innerHTML = starHTML;

    const ratingValue = document.createElement("p");
    ratingValue.textContent = imDbRating + "/10";
    ratingsContainer.append(ratingValue);
  };

  View.prototype.renderPosterAndTrailerPartOfPage = function(imageURL, trailerObj, trailerThumbnailUrl, trailerLink) {
    const posterPageSection = document.createElement("section");
    posterPageSection.classList.add("movie-poster");
    this.settings.contentContainer.append(posterPageSection);

    const body = document.createElement("div");
    body.classList.add("movie-poster__body");
    posterPageSection.append(body);

    const posterContainer = document.createElement("div");
    body.append(posterContainer);

    const poster = document.createElement("img");
    poster.setAttribute("src", imageURL);
    poster.setAttribute("alt", "poster");
    posterContainer.append(poster);

    const trailerContainer = document.createElement("div");
    trailerContainer.setAttribute("id", "movie-thumbnail-container");
    trailerContainer.setAttribute("data-trailer-link", trailerLink);
    body.append(trailerContainer);

    const thumbnail = document.createElement("img");
    thumbnail.setAttribute("src", trailerThumbnailUrl);
    thumbnail.setAttribute("alt", "trailer thumbnail");
    trailerContainer.append(thumbnail);

    const buttonContainer = document.createElement("div");
    trailerContainer.append(buttonContainer);

    const button = document.createElement("button");
    button.setAttribute("type", "button");
    buttonContainer.append(button);

    const buttonSVG = `<svg width="100" height="100" viewBox="0 0 100 100"  xmlns="http://www.w3.org/2000/svg"><path d="M66.6667 42.7917L45.8333 30.75C44.5671 30.019 43.1309 29.6339 41.6688 29.6336C40.2067 29.6332 38.7703 30.0175 37.5037 30.7479C36.2371 31.4783 35.185 32.529 34.453 33.7947C33.721 35.0603 33.3348 36.4963 33.3333 37.9583V62.0417C33.3348 63.503 33.7206 64.9383 34.4519 66.2035C35.1832 67.4687 36.2344 68.5193 37.5 69.25C38.7668 69.9814 40.2039 70.3665 41.6667 70.3665C43.1295 70.3665 44.5665 69.9814 45.8333 69.25L66.6667 57.2083C67.9295 56.4758 68.9777 55.4244 69.7064 54.1593C70.435 52.8942 70.8186 51.4599 70.8186 50C70.8186 48.5401 70.435 47.1058 69.7064 45.8407C68.9777 44.5757 67.9295 43.5242 66.6667 42.7917ZM62.5 50L41.6667 62.0417V37.9583L62.5 50ZM50 8.33334C41.7591 8.33334 33.7033 10.7771 26.8512 15.3554C19.9992 19.9338 14.6587 26.4413 11.505 34.0549C8.35137 41.6685 7.52623 50.0462 9.13395 58.1288C10.7417 66.2113 14.71 73.6356 20.5372 79.4628C26.3644 85.29 33.7887 89.2583 41.8712 90.8661C49.9538 92.4738 58.3316 91.6486 65.9451 88.495C73.5587 85.3413 80.0662 80.0008 84.6446 73.1488C89.223 66.2967 91.6667 58.2409 91.6667 50C91.6667 44.5283 90.5889 39.1101 88.495 34.0549C86.401 28.9996 83.3319 24.4063 79.4628 20.5372C75.5937 16.6681 71.0004 13.599 65.9451 11.505C60.8899 9.41108 55.4717 8.33334 50 8.33334ZM50 83.3333C43.4073 83.3333 36.9626 81.3784 31.481 77.7157C25.9994 74.0529 21.7269 68.847 19.204 62.7561C16.6811 56.6653 16.021 49.963 17.3072 43.497C18.5933 37.031 21.768 31.0915 26.4298 26.4298C31.0915 21.768 37.031 18.5933 43.497 17.3072C49.963 16.021 56.6652 16.6811 62.7561 19.204C68.847 21.7269 74.0529 25.9994 77.7157 31.481C81.3784 36.9626 83.3333 43.4073 83.3333 50C83.3333 58.8406 79.8214 67.319 73.5702 73.5702C67.319 79.8214 58.8406 83.3333 50 83.3333Z"/></svg>`;
    button.innerHTML = buttonSVG;
  };

  View.prototype.renderGenreAndControllsPartOfPage = function(genres, listOption) {
    const genrePageSection = document.createElement("section");
    genrePageSection.classList.add("movie-genre-and-controlls");
    this.settings.contentContainer.append(genrePageSection);

    const body = document.createElement("div");
    body.classList.add("movie-genre-and-controlls__body");
    genrePageSection.append(body);

    const genresContainer = document.createElement("div");
    body.append(genresContainer);

    const genresArray = genres.split(",");
    for (let i = 0; i < genresArray.length; i++) {
      const genreItem = document.createElement("p");
      genreItem.textContent = genresArray[i];
      genresContainer.append(genreItem);
    };
    
    const controllsContainer = document.createElement("div");
    body.append(controllsContainer);
    
    if (listOption === "watched") {
      const watchedButton = document.createElement("button");
      watchedButton.classList.add("disabled-CB-main");
      watchedButton.setAttribute("type", "button");
      watchedButton.disabled = true;
      watchedButton.textContent = "Marked as watched";
      controllsContainer.append(watchedButton);

      const wishlistButton = document.createElement("button");
      wishlistButton.classList.add("disabled-CB-second");
      wishlistButton.setAttribute("type", "button");
      watchedButton.disabled = true;
      wishlistButton.textContent = "Add to wish list";
      controllsContainer.append(wishlistButton);
      return;
    } else if (listOption === "wish") {
      const watchedButton = document.createElement("button");
      watchedButton.classList.add("disabled-CB-second");
      watchedButton.setAttribute("type", "button");
      watchedButton.disabled = true;
      watchedButton.textContent = "Mark as watched";
      controllsContainer.append(watchedButton);

      const wishlistButton = document.createElement("button");
      wishlistButton.classList.add("disabled-CB-main");
      wishlistButton.disabled = true;
      wishlistButton.textContent = "Added to wish list";
      controllsContainer.append(wishlistButton);
      return;
    };

    const watchedButton = document.createElement("button");
    watchedButton.setAttribute("id", "m-mark-as-watched");
    watchedButton.setAttribute("type", "button");
    watchedButton.textContent = "Mark as watched";
    controllsContainer.append(watchedButton);

    const wishlistButton = document.createElement("button");
    wishlistButton.setAttribute("id", "m-add-to-wish-list");
    wishlistButton.setAttribute("type", "button");
    wishlistButton.textContent = "Add to wish list";
    controllsContainer.append(wishlistButton);
  };

  View.prototype.renderPlotPartOfPage = function(plot) {
    const plotPageSection = document.createElement("section");
    plotPageSection.classList.add("movie-briefly-plot");
    this.settings.contentContainer.append(plotPageSection);

    const body = document.createElement("div");
    body.classList.add("movie-briefly-plot__body");
    plotPageSection.append(body);

    const title = document.createElement("h1");
    title.textContent = "Briefly about the plot";
    body.append(title);

    const moviePlot = document.createElement("p");
    moviePlot.textContent = plot;
    body.append(moviePlot);
  };

  View.prototype.renderGalleryPartOfPage = function(arrayWithImages) {
    const imagesPageSection = document.createElement("section");
    imagesPageSection.classList.add("movie-photos");
    this.settings.contentContainer.append(imagesPageSection);

    const body = document.createElement("div");
    body.classList.add("movie-photos__body");
    imagesPageSection.append(body);

    const title = document.createElement("h1");
    title.textContent = "Movie pictures";
    body.append(title);

    const imagesCollectionContainer = document.createElement("div");
    imagesCollectionContainer.classList.add("movie-photos__photo-collection");
    imagesCollectionContainer.classList.add("MPPC-loading");
    imagesCollectionContainer.setAttribute("id", "MPPC-loading");

    const loaderContainer = document.createElement("div");
    loaderContainer.classList.add("MPPC-loader-container");

    imagesCollectionContainer.append(loaderContainer);

    const loader = document.createElement("div");
    loader.classList.add("MM-loader");

    for (let i = 0; i < 4; i++) {
      const loaderItem = document.createElement("div");
      loader.append(loaderItem);
    }

    loaderContainer.append(loader);
    body.append(imagesCollectionContainer);

    try {

      for (let i = 0; i < 20; i++) {
        const urlOfImage = arrayWithImages[i].image;

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("movie-photo-item");
        imageContainer.setAttribute("data-number", i);
        imagesCollectionContainer.append(imageContainer);

        const img = document.createElement("img");
        img.setAttribute("src", urlOfImage);
        img.setAttribute("alt", "photo from movie");
        imageContainer.append(img);

        this.settings.images += 1;

        // слушатель события на картинки, чтобы при их загрузке убрать анимацию загрузки :)
        img.addEventListener("load", this.imageLoadedHandle.bind(this), {once: true});
      };

    } catch(error) {
      return;
    };
  };

  View.prototype.renderDetailsPartOfPage = function(releaseDate, type, runtime, genres, actors, countries, awards) {
    const detailsPageSection = document.createElement("section");
    detailsPageSection.classList.add("movie-details");
    this.settings.contentContainer.append(detailsPageSection);

    const body = document.createElement("div");
    body.classList.add("movie-details__body");
    detailsPageSection.append(body);

    const title = document.createElement("h1");
    title.textContent = "Details";
    body.append(title);

    if (releaseDate) {
      const releaseDateParagraph = document.createElement("p");
      releaseDateParagraph.textContent = "Released: ";

      const dateSpan = document.createElement("span");
      dateSpan.textContent = releaseDate;

      body.append(releaseDateParagraph);
      releaseDateParagraph.append(dateSpan);
    };

    if (type) {
      const typeParagraph = document.createElement("p");
      typeParagraph.textContent = "Type: ";

      const typeSpan = document.createElement("span");
      typeSpan.textContent = type;

      body.append(typeParagraph);
      typeParagraph.append(typeSpan);
    };

    if (runtime) {
      const runtimeParagraph = document.createElement("p");
      runtimeParagraph.textContent = "Runtime: ";

      const runtimeSpan = document.createElement("span");
      runtimeSpan.textContent = runtime;

      body.append(runtimeParagraph);
      runtimeParagraph.append(runtimeSpan);
    };

    if (genres) {
      const genresParagraph = document.createElement("p");
      genresParagraph.textContent = "Genre: ";

      const genresSpan = document.createElement("span");
      genresSpan.textContent = genres;

      body.append(genresParagraph);
      genresParagraph.append(genresSpan);
    };

    if (actors) {

      const actorsParagraph = document.createElement("p");
      actorsParagraph.textContent = "Actors: ";

      const actorsSpan = document.createElement("span");
      
      let actorsString = "";
      for (let i = 0; i < 6; i++) {
        actorsString += actors[i].name + ", ";
      };
      actorsSpan.textContent = actorsString.slice(0, -2);

      body.append(actorsParagraph);
      actorsParagraph.append(actorsSpan); 
    };

    if (countries) {
      const countriesParagraph = document.createElement("p");
      countriesParagraph.textContent = "Countries: ";

      const countriesSpan = document.createElement("span");
      countriesSpan.textContent = countries;

      body.append(countriesParagraph);
      countriesParagraph.append(countriesSpan);
    };

    if (awards) {
      const awardsParagraph = document.createElement("p");
      awardsParagraph.textContent = "Awards: ";

      const awardsSpan = document.createElement("span");
      awardsSpan.textContent = awards;

      body.append(awardsParagraph);
      awardsParagraph.append(awardsSpan);
    };

  };

  View.prototype.renderMoviInfoPartOfPage = function(text) {
    const plotPageSection = document.createElement("section");
    plotPageSection.classList.add("movie-plot");
    this.settings.contentContainer.append(plotPageSection);

    const body = document.createElement("div");
    body.classList.add("movie-plot__body");
    plotPageSection.append(body);

    const title = document.createElement("h1");
    title.textContent = "About the movie";
    body.append(title);

    const plotItemsContainer = document.createElement("div");
    body.append(plotItemsContainer);

    const plotContainer = document.createElement("div");
    plotContainer.setAttribute("id", "about-movie-info-container");
    plotContainer.style.height = "250px";
    plotContainer.innerHTML = text;
    plotItemsContainer.append(plotContainer);
    
    const overflow = document.createElement("div");
    overflow.setAttribute("id", "MPCO");
    plotContainer.append(overflow);

    const readMoreButton = document.createElement("button");
    readMoreButton.setAttribute("id", "m-plot-read-button");
    readMoreButton.setAttribute("type", "button");
    readMoreButton.textContent = "Read all";
    plotItemsContainer.append(readMoreButton);
  };

  View.prototype.renderRecommendationsPartOfPage = function(simillarsArray) {
    const leftButtonSVG = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M14.1666 21.3333L23.6666 30.6666C24.3333 31.3333 25.3333 31.3333 26 30.6666C26.6666 30 26.6666 29 26 28.3333L17.8333 20L26 11.6666C26.6666 11 26.6666 9.99998 26 9.33331C25.6666 8.99998 25.3333 8.83331 24.8333 8.83331C24.3333 8.83331 24 8.99998 23.6666 9.33331L14.1666 18.6666C13.5 19.5 13.5 20.5 14.1666 21.3333C14.1666 21.1666 14.1666 21.1666 14.1666 21.3333Z"/></svg> `;
    const rightButtonSVG = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M25.8333 18.6666L16.3333 9.33329C15.6667 8.66663 14.6667 8.66663 14 9.33329C13.3333 9.99996 13.3333 11 14 11.6666L22.1667 20L14 28.3333C13.3333 29 13.3333 30 14 30.6666C14.3333 31 14.6667 31.1666 15.1667 31.1666C15.6667 31.1666 16 31 16.3333 30.6666L25.8333 21.3333C26.5 20.5 26.5 19.5 25.8333 18.6666C25.8333 18.8333 25.8333 18.8333 25.8333 18.6666Z"/></svg> `;

    const recPageSection = document.createElement("section");
    recPageSection.classList.add("movie-might-be-interesting");
    this.settings.contentContainer.append(recPageSection);

    const body = document.createElement("div");
    body.classList.add("movie-might-be-interesting__body");
    recPageSection.append(body);

    const titleOfSection = document.createElement("h1");
    titleOfSection.textContent = "Might be interesting";
    body.append(titleOfSection);

    const slider = document.createElement("div");
    slider.setAttribute("id", "recommendations-slider");
    slider.classList.add("recommendations__slider-container");
    this.settings.sliderContainer = slider;
    body.append(slider);

    const leftButton = document.createElement("button");
    leftButton.classList.add("recommendations__slider-left");
    leftButton.classList.add("slider-left");
    leftButton.setAttribute("type", "button");
    leftButton.innerHTML = leftButtonSVG;
    slider.append(leftButton);

    const sliderBody = document.createElement("div");
    sliderBody.classList.add("recommendations__slider-body");
    sliderBody.classList.add("slider-body");
    slider.append(sliderBody);

    const sliderLine = document.createElement("div");
    sliderLine.classList.add("recommendations__slider-line");
    sliderLine.classList.add("slider-line");
    sliderBody.append(sliderLine);

    simillarsArray.forEach(element => {
      const sliderItem = document.createElement("div");
      sliderItem.classList.add("recommendations__item");
      sliderItem.classList.add("slider-item");
      sliderLine.append(sliderItem);

      const ratingContainer = document.createElement("div");
      sliderItem.append(ratingContainer);

      const ratingStarContainer = document.createElement("div");
      ratingStarContainer.classList.add("slider-item__imdb-rating-start");
      ratingStarContainer.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 7.57502C16.575 7.20002 16.275 6.75001 15.9 6.75001L11.625 6.15001L9.675 2.25001C9.6 2.10001 9.525 2.02501 9.375 1.95001C9 1.72501 8.55 1.87501 8.325 2.25001L6.45 6.15001L2.175 6.75001C1.95 6.75001 1.8 6.82502 1.725 6.97502C1.425 7.27502 1.425 7.72501 1.725 8.02501L4.8 11.025L4.05 15.3C4.05 15.45 4.05 15.6 4.125 15.75C4.35 16.125 4.8 16.275 5.175 16.05L9 14.025L12.825 16.05C12.9 16.125 13.05 16.125 13.2 16.125C13.275 16.125 13.275 16.125 13.35 16.125C13.725 16.05 14.025 15.675 13.95 15.225L13.2 10.95L16.275 7.95001C16.425 7.87501 16.5 7.72502 16.5 7.57502Z" fill="#FFE814"/></svg>`;
      ratingContainer.append(ratingStarContainer);

      const rating = document.createElement("p");
      rating.textContent = element.imDbRating;
      ratingContainer.append(rating);

      const posterContainer = document.createElement("div");
      posterContainer.classList.add("slider-item__poster");
      sliderItem.append(posterContainer);

      const poster = document.createElement("img");
      poster.setAttribute("src", element.image);
      poster.setAttribute("alt", "poster");
      posterContainer.append(poster);

      const infoContainer = document.createElement("div");
      sliderItem.append(infoContainer);

      const title = document.createElement("h2");
      title.textContent = element.title;
      infoContainer.append(title);

      const button = document.createElement("button");
      button.classList.add("slider-item__learn-more");
      button.setAttribute("type", "button");
      button.setAttribute("imdbid", element.id);
      button.textContent = "Learn more";
      infoContainer.append(button);
    });

    const rightButton = document.createElement("button");
    rightButton.classList.add("recommendations__slider-left");
    rightButton.classList.add("slider-right");
    rightButton.setAttribute("type", "button");
    rightButton.innerHTML = rightButtonSVG;
    slider.append(rightButton);
  };

  View.prototype.connectControllsModules = function() {
    // Подключение модуля управления слайдером
    this.settings.controllsObject = new recommendationsSliderControlls.SliderController();
    this.settings.controllsObject.start(this.settings.sliderContainer);

    // Подключение модуля управления галереей с картинками из фильма
    this.settings.imagesControllsModule = new imagesModule.ImagesModule();
    this.settings.imagesControllsModule.start(document.querySelector(".movie-photos__photo-collection"));
  };

  View.prototype.removeControllsObject = function() {
    this.settings.controllsObject.stop();
    this.settings.imagesControllsModule.stop();
  };

  View.prototype.imageLoadedHandle = function(event) {
    event.preventDefault();
    this.settings.imagesLoaded += 1;
    if (this.settings.imagesLoaded === this.settings.images) this.removeLoaderFromImagesContainer();
  };

  View.prototype.removeLoaderFromImagesContainer = function() {
    const container = document.getElementById("MPPC-loading");
    if (container) {
      const loader = container.querySelector(".MPPC-loader-container");
      loader.remove();
      container.classList.remove("MPPC-loading");
    };
  };

  View.prototype.changePlotViewOnMoviePage = function() {
    const MINHEIGHT = 250;
    const container = document.getElementById("about-movie-info-container");
    const button = document.getElementById("m-plot-read-button");
    const overflow = document.getElementById("MPCO");

    if (container.offsetHeight <= 250) {
      const height = container.scrollHeight;
      overflow.style.display = "none";
      container.style.cssText = `max-height: ${height}px`;
      button.textContent = "Roll Up";
    } else {
      container.style.cssText = `max-height: ${MINHEIGHT}px`;
      overflow.style.display = "block";
      button.textContent = "Read All";
    };

  };

  View.prototype.changeAsWatcedButton = function() {
    const button = document.getElementById("m-mark-as-watched");
    button.classList.add("disabled-CB-main");
    button.disabled = true;
    button.textContent = "Marked as watched";

    const wishlistButton = document.getElementById("m-add-to-wish-list");
    wishlistButton.classList.add("disabled-CB-second");
    wishlistButton.disabled = true;
  };

  View.prototype.changeWishlistButton = function() {
    const button = document.getElementById("m-add-to-wish-list");
    button.classList.add("disabled-CB-main");
    button.disabled = true;
    button.textContent = "Added to wish list";

    const watchedButton = document.getElementById("m-mark-as-watched");
    watchedButton.classList.add("disabled-CB-second");
    watchedButton.disabled = true;
  };
  /* ------- end view ------ */


  /* ------ controller ----- */ 
  function Controller() {
    this.model = null;

    this.settings = {
      contentContainer: null,
    };
  };

  Controller.prototype.initialize = function(model) {
    this.model = model;
  };

  Controller.prototype.setContainer = function(id) {
    this.settings.contentContainer = document.getElementById(id);
  };

  Controller.prototype.start = function() {
    this.model.makeLoader();
    this.model.requestData();
  };

  Controller.prototype.removeControllsObject = function() {
    this.model.removeControllsObject();
  };

  Controller.prototype.changePlotViewOnMoviePage = function() {
    this.model.changePlotViewOnMoviePage();
  };
  /* --- end controller ---- */ 


  /* --- RecommendationSection --- */
  function MoviePageModule() {
    this.model = new Model();
    this.view = new View();
    this.controller = new Controller();

    this.model.initialize(this.view);
    this.controller.initialize(this.model);
  };

  MoviePageModule.prototype.start = function(containerID, imdbID, listOption) {
    this.controller.setContainer(containerID);
    this.view.setContainer(containerID);
    this.model.setListsParametrs(listOption);
    this.model.setIMDBID(imdbID);
    this.controller.start();
  };

  MoviePageModule.prototype.changePlotViewOnMoviePage = function() {
    this.controller.changePlotViewOnMoviePage();
  };

  MoviePageModule.prototype.updatePageInfo = function(data) {

  };

  MoviePageModule.prototype.changeAsWatcedButton = function() {
    this.view.changeAsWatcedButton();
  };

  MoviePageModule.prototype.changeWishlistButton = function() {
    this.view.changeWishlistButton();
  };

  MoviePageModule.prototype.stop = function() {
    this.controller.removeControllsObject();
  };
  /* - end RecommendationSection - */

  return {
    MoviePageModule,
    start: MoviePageModule.prototype.start,
    stop: MoviePageModule.prototype.stop,
  };
  
}());