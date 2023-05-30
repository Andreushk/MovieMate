export function searchPageComponent() {

  /* -------- model -------- */
  const model = {
    view: null,

    searchSettings: {
      searchValue: null,
      OMDBKEY: "1166139f",

      timerIDForAbort: null,
    },

    initialize: function(view, searchValue) {
      this.view = view;
      this.searchSettings.searchValue = searchValue;
    },

    startLoader: function() {
      this.view.startLoader();
    },

    stopLoader: function() {
      this.view.stopLoader();
    },

    showSearchResults: function(data) {
      this.view.showSearchResults(data);
    },

    makeErrorMessageForUser: function(errorMessage) {
      this.view.makeErrorMessageForUser(errorMessage);
    },

    requestData: async function() {
      try {

        const controller = new AbortController();
        const signal = controller.signal;

        this.searchSettings.timerIDForAbort = setTimeout(() => {
          controller.abort();
        }, 10000);

        const response = await fetch(`http://www.omdbapi.com/?apikey=${this.searchSettings.OMDBKEY}&s=${this.searchSettings.searchValue}`, {signal});
        const data = await response.json();
        
        clearTimeout(this.searchSettings.timerIDForAbort);
        const responseStatus = data.Response;
        switch (responseStatus) {
          case "True":
            this.stopLoader();
            this.showSearchResults(data);
            break;
          case "False":
            const errorMessage = "Something went wrong, but you can always try again!";
            this.stopLoader();
            this.makeErrorMessageForUser(errorMessage);
            break;
          default: 
            break;
        };
      } catch (error) {
        if (error.name === "AbortError") {
          const errorMessage = "The wait time is over, maybe the server is overloaded. Try again later.";
          this.stopLoader();
          this.makeErrorMessageForUser(errorMessage);
        } else {
          console.warn(error);
        };
      };
    },

  };
  /* ------ end model ------ */


  /* --------- view -------- */
  const view = {
    contentContainer: null,

    initialize: function(pageID) {
      this.contentContainer = document.getElementById(pageID);
    },

    startLoader: function() {
      const loaderContainer = document.createElement("div");
      loaderContainer.classList.add("MM-loader");
      loaderContainer.setAttribute("id", "MML");

      for (let i = 0; i < 3; i++) {
        const loaderItem = document.createElement("div");
        loaderContainer.append(loaderItem);
      };

      this.contentContainer.append(loaderContainer);
    },

    stopLoader: function() {
      const loader = document.getElementById("MML");
      loader.remove();
    },

    showSearchResults: function(data) {

      const resultsOfSearchSection = document.createElement("section");
      resultsOfSearchSection.classList.add("results-of-search");
      this.contentContainer.append(resultsOfSearchSection);

      const resultsOfSearchSectionBody = document.createElement("div");
      resultsOfSearchSectionBody.classList.add("results-of-search__body");
      resultsOfSearchSection.append(resultsOfSearchSectionBody);

      const titleOfSearchSection = document.createElement("h1");
      titleOfSearchSection.textContent = "Here's what we were able to find:";
      resultsOfSearchSectionBody.append(titleOfSearchSection);

      const resultsOfSearchContainer = document.createElement("div");
      resultsOfSearchContainer.classList.add("results-of-search__items-container");
      resultsOfSearchSectionBody.append(resultsOfSearchContainer);

      data.Search.forEach(element => {
        const searchItem = document.createElement("div");
        searchItem.classList.add("results-of-search__item");
        searchItem.setAttribute("data-imdbID", element.imdbID);
        resultsOfSearchContainer.append(searchItem);

        const searchItemPosterContainer = document.createElement("div");
        searchItemPosterContainer.classList.add("results-of-search__poster");
        searchItem.append(searchItemPosterContainer);

        const poster = document.createElement("img");
        if (element.Poster === "N/A") {
          searchItemPosterContainer.classList.add("ROS__no-poster");
          poster.setAttribute("alt", "sorry, no poster");
        } else {
          poster.setAttribute("src", element.Poster);
        };
        searchItemPosterContainer.append(poster);

        const movieInfoContainer = document.createElement("div");
        searchItem.append(movieInfoContainer);

        const movieTitle = document.createElement("h2");
        movieTitle.textContent = element.Title;
        movieInfoContainer.append(movieTitle);

        const movieYear = document.createElement("span");
        movieYear.textContent = `Year: `;
        const movieYearValue = document.createElement("p");
        movieYearValue.textContent = element.Year;
        movieYearValue.prepend(movieYear);
        movieInfoContainer.append(movieYearValue);

        const movieType = document.createElement("span");
        movieType.textContent = `Type: `;
        const movieTypeValue = document.createElement("p");
        movieTypeValue.textContent = element.Type;
        movieTypeValue.prepend(movieType);
        movieInfoContainer.append(movieTypeValue);
      });

    },

    makeErrorMessageForUser: function(errorMessage) {
      const errorSection = document.createElement("section");
      errorSection.classList.add("ROS__error");
      this.contentContainer.append(errorSection);

      const messageParagraph = document.createElement("p");
      messageParagraph.textContent = errorMessage;
      errorSection.append(messageParagraph);
    },

  };
 /* ------- end view ------ */


  /* ------ controller ----- */
  const controller = {
    model: null,
    contentContainer: null,

    initialize: function(model, pageID) {
      this.model = model;
      this.contentContainer = document.getElementById(pageID);
    },

    startMakingPage: function() {
      this.model.startLoader();
      this.model.requestData();
    },

  };
  /* --- end controller ---- */


  return function showSearchResultsOnPage(pageID, searchValue) {
    model.initialize(view, searchValue);
    view.initialize(pageID);
    controller.initialize(model, pageID);
  
    controller.startMakingPage();
  };
 
};