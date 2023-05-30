/*
  Модуль поисковой строки;
  Точка перехода на мобильное представление - 590px;
*/


export const searchModule = (function() {

  /* -------- model -------- */
  class Model {

    constructor() {
      this.ADPTIVITYPOINT = 590;
      this.layoutType = null;
      this.widthOfWindow = null;

      this.OMDBAPIKEY = "1166139f";
      this.IMDBid = null;
      this.titleOfMovieForSearch
      this.searchResultArray = null;

      this.isResultErrorMessageShowing = false;
      this.isResultsShowing = false;
      this.isLoaderShowing = false;

      this.timerIDForDebounce = null;
      this.timerIDForFetchAbort = null;
    };

    initialize(SeacrhModuleView) {
      this.view = SeacrhModuleView;
    }

    setWidthOfWindow(width) {
      this.widthOfWindow = width;
    };

    setLayoutType(width) {
      if (width > this.ADPTIVITYPOINT) {
        this.layoutType = "desctop";
      } else if (width <= this.ADPTIVITYPOINT) {
        this.layoutType = "mobile";
      }
      this.view.setLayoutType(this.layoutType);
    };

    setTitleOfMovie(title) {
      this.titleOfMovieForSearch = title;
    };

    startLoader() {
      if (this.isLoaderShowing === false) {
        this.isLoaderShowing = true;
        this.view.startLoader();
      } else {
        return;
      }
    };

    removeIfSomethingShowing() {
      clearTimeout(this.timerIDForDebounce);
      if (this.isResultErrorMessageShowing === true || this.isResultsShowing === true) {
        this.view.removeResult();
        this.isResultsShowing = false;
        this.isResultErrorMessageShowing = false;
      };
      if (this.isLoaderShowing === true) {
        this.view.removeLoader();
        this.isLoaderShowing = false;
      };
    };

    setThatSomethingIsShowing() {
      this.isResultsShowing = true;
      this.isResultErrorMessageShowing = true;
    };

    cleanSearchInput() {
      this.view.cleanSearchInput(this.layoutType);
    };

    openMobileSearchInputWithInfo(info) {
      this.view.openMobileSearchInputWithInfo(info);
    };

    setInSearchInputInfo(info) {
      this.view.setInSearchInputInfo(info);
    };

    transferResults() {
      if (this.layoutType === "desctop") {
        this.view.transferResultsToMobile();
      } else if (this.layoutType === "mobile") {
        this.view.transferResultsToDesctop();
      }
    };

    showMobileSearchContainer() {
      this.view.showMobileSearchContainer();
    };

    closeMobileSearchContainer() {
      this.view.closeMobileSearchContainer();
    };

    startMakingSearch() {
      clearTimeout(this.timerIDForDebounce);
      this.timerIDForDebounce = setTimeout(() => {
        this.makeSearchRequest();
      }, 300);
    };

    async makeSearchRequest() {
      try {
        this.startLoader();

        const controller = new AbortController();
        const signal = controller.signal;

        this.timerIDForFetchAbort = setTimeout(() => {
          controller.abort();
        }, 10000);

        
        const response = await fetch(`http://www.omdbapi.com/?apikey=${this.OMDBAPIKEY}&s=${this.titleOfMovieForSearch}`, {signal});
        const data = await response.json();
      
        /*
        const data = {
          "Response": "False",
          "Error": "Too many results."
        };*/

        clearTimeout(this.timerIDForFetchAbort);
        const responseStatus = data.Response;
        switch (responseStatus) {
          case "True":
            this.view.setLayoutType(this.layoutType);
            this.view.removeLoader();
            this.view.showResultsOfSearch(data.Search);
            this.isLoaderShowing = false;
            this.isResultsShowing = true;
            break;
          case "False":
            if (data.Error === "Too many results." && this.isResultErrorMessageShowing === false) {
              const messageForUser = "Nothing was found. Try to write a more exact name...";
              this.view.setLayoutType(this.layoutType);
              this.view.removeLoader();
              this.view.makeResultsContainerWithMessage(messageForUser);
              this.isLoaderShowing = false;
              this.isResultErrorMessageShowing = true;
            } else {
              const messageForUser = "Nothing was found.";
              this.view.setLayoutType(this.layoutType);
              this.view.removeLoader();
              this.view.makeResultsContainerWithMessage(messageForUser);
              this.isLoaderShowing = false;
              this.isResultErrorMessageShowing = true;
            }
            break;
          default: 
            break;
        };
      } catch (e) {
        if (e.name === "AbortError") {
          this.view.removeLoader();
          this.isLoaderShowing = false;
        }
      };
    };

  };
  /* ------ end model ------ */


  /* --------- view -------- */
  class View {

    setHeader() {
      this.header = document.getElementById("header");
    };

    setLayoutType(type) {
      this.layoutType = type;
    };

    startLoader() {

      let container = null;
      const loaderContainer = document.createElement("div");

      switch (this.layoutType) {
        case "desctop": 
          container = this.header.querySelector("#header__search-container");
          break;
        case "mobile":
          container = this.header.querySelector("#header-mobile-seach-container");
          break;
        default:
          break;
      };

      container.append(loaderContainer);
      loaderContainer.setAttribute("id", "header-loader-container");
      loaderContainer.classList.add("header__loader-container");

      const loader = document.createElement("div");
      loader.classList.add("MM-loader");
      
      for (let i = 0; i < 4; i++) {
        const loaderItem = document.createElement("div");
        loader.append(loaderItem);
      }
      
      container.append(loaderContainer);
      loaderContainer.append(loader);
    };

    removeLoader() {
      const loader = document.getElementById("header-loader-container");
      loader.remove();
    };

    removeResult() {
      let result = null;

      switch (this.layoutType) {
        case "desctop":
          result = document.getElementById("header__search-container__results");
          break;
        case "mobile":
          result = document.getElementById("header__search-container-results-mobile");
          break;
        default: 
          break;
      };
       
      result.remove();
    };

    cleanSearchInput(layoutType) {
      let searchInput = null;
      if (layoutType === "desctop") {
        searchInput = this.header.querySelector("#search-box");
      } else if (layoutType === "mobile") {
        searchInput = this.header.querySelector("#mobile-search-box");
        this.closeMobileSearchContainer();
      }

      searchInput.value = "";
    };

    showResultsOfSearch(results) {
      let container = null;
      const resultsContainer = document.createElement("div");

      switch (this.layoutType) {
        case "desctop": 
          container = this.header.querySelector("#header__search-container");
          resultsContainer.setAttribute("id", "header__search-container__results");
          resultsContainer.classList.add("header__search-container__results");
          break;
        case "mobile":
          container = this.header.querySelector("#header-mobile-seach-container");
          resultsContainer.setAttribute("id", "header__search-container-results-mobile");
          resultsContainer.classList.add("header__search-container-results-mobile");
          break;
        default:
          break;
      };

      container.append(resultsContainer);

      for (let i = 0; i < results.length; i++) {
        const searchItem = document.createElement("div");
        searchItem.classList.add("hscr__item");
        searchItem.setAttribute("data-IMDBid", results[i].imdbID);
        
        const itemPosterContainer = document.createElement("div");

        const poster = document.createElement("img");
        if (results[i].Poster === "N/A") {
          poster.remove();
          itemPosterContainer.classList.add("hscr-no-poster");
        } else {
          poster.setAttribute("src", results[i].Poster);
          poster.setAttribute("alt", "sorry, no poster");
        }

        const itemInfoContainer = document.createElement("div");

        const title = document.createElement("p");
        title.textContent = results[i].Title;

        const years = document.createElement("p");
        years.textContent = results[i].Year;
        
        resultsContainer.append(searchItem);
        searchItem.append(itemPosterContainer);
        itemPosterContainer.append(poster);

        searchItem.append(itemInfoContainer);
        itemInfoContainer.append(title);
        itemInfoContainer.append(years);
      };
    };

    makeResultsContainerWithMessage(message) {
      let container = null;
      const resultsContainer = document.createElement("div");

      switch (this.layoutType) {
        case "desctop": 
          container = this.header.querySelector("#header__search-container");
          resultsContainer.setAttribute("id", "header__search-container__results");
          resultsContainer.classList.add("header__search-container__results");
          break;
        case "mobile":
          container = this.header.querySelector("#header-mobile-seach-container");
          resultsContainer.setAttribute("id", "header__search-container-results-mobile");
          resultsContainer.classList.add("header__search-container-results-mobile");
          break;
        default:
          break;
      };

      container.append(resultsContainer);

      const messageForUserParagraph = document.createElement("p");
      messageForUserParagraph.classList.add("header__search-container__results-message");
      messageForUserParagraph.textContent = message;

      resultsContainer.append(messageForUserParagraph);
    };

    openMobileSearchInputWithInfo(info) {
      const searchContainer = this.header.querySelector("#header-mobile-seach-container");
      const searchInput = searchContainer.querySelector("#mobile-search-box");
      searchContainer.classList.add("H-M-S-C-show");
      searchInput.value = info;
      searchInput.focus();
    };

    setInSearchInputInfo(info) {
      const searchInput = this.header.querySelector("#search-box");
      searchInput.value = info;
      searchInput.focus();
    };

    transferResultsToMobile() {
      const resultsContainer = this.header.querySelector("#header__search-container__results");
      const resultsContainerHTML = resultsContainer.innerHTML;
      
      const mobileSearchContainer = this.header.querySelector("#header-mobile-seach-container");
      const mobileResultsContainer = document.createElement("div");
      mobileResultsContainer.classList.add("header__search-container-results-mobile");
      mobileResultsContainer.setAttribute("id", "header__search-container-results-mobile");
      mobileSearchContainer.append(mobileResultsContainer);
      mobileResultsContainer.innerHTML = resultsContainerHTML;
    };

    transferResultsToDesctop() {
      const resultsContainer = this.header.querySelector("#header__search-container-results-mobile");
      const resultsContainerHTML = resultsContainer.innerHTML;

      const desctopSearchContainer = this.header.querySelector("#header__search-container");
      const desctopResultsContainer = document.createElement("div");
      desctopResultsContainer.classList.add("header__search-container__results");
      desctopResultsContainer.setAttribute("id", "header__search-container__results");
      desctopSearchContainer.append(desctopResultsContainer);
      desctopResultsContainer.innerHTML = resultsContainerHTML;
    };

    showMobileSearchContainer() {
      const searchContainer = this.header.querySelector("#header-mobile-seach-container");
      const searchInput = searchContainer.querySelector("#mobile-search-box");
      searchContainer.classList.add("H-M-S-C-show");
      searchInput.focus();
    };

    closeMobileSearchContainer() {
      const searchContainer = this.header.querySelector("#header-mobile-seach-container");
      searchContainer.classList.remove("H-M-S-C-show");
    };

  };
  /* ------- end view ------ */


  /* ------ controller ----- */
  class Controller {

    constructor() {
      this.widthOfWindow = null;
      this.layoutType = null;
      this.ADPTIVITYPOINT = 590;
      
      this.container = null;
      this.searchInput = null;
      this.searchButton = null;

      this.isOnResultsContainerListener = false;
      this.isDesctopListenersON = false;
      this.isMobileListenersON = false;
    };

    initialize(SearchModuleModel) {
      this.model = SearchModuleModel;
    };

    setHeader() {
      this.container = document.getElementById("header");
    };

    checkWidthOfWindow() {
      this.widthOfWindow = window.innerWidth;

      this.model.setWidthOfWindow(this.widthOfWindow);
      this.setLayout();
    };

    setLayout() {
      if (this.layoutType === "desctop" && this.widthOfWindow <= this.ADPTIVITYPOINT) {
        this.layoutType = "mobile";
        this.chekIsSomethingWasShown();
        this.removeDesctopEventListeners();
      } else if (this.layoutType === "mobile" && this.widthOfWindow > this.ADPTIVITYPOINT) {
        this.layoutType = "desctop";
        this.chekIsSomethingWasShown();
        this.model.closeMobileSearchContainer();
        this.removeMobileEventListeners();
      }

      if (this.widthOfWindow > this.ADPTIVITYPOINT) {
        this.searchInput = this.container.querySelector("#search-box");
        this.searchButton = this.container.querySelector("#search-button");
        this.layoutType = "desctop";
        this.addEventListenerForDesctop();
      } else if (this.widthOfWindow <= this.ADPTIVITYPOINT) {
        this.searchInput = this.container.querySelector("#mobile-search-box");
        this.searchButton = this.container.querySelector("#search-button");
        this.closeButton = this.container.querySelector("#mobile-search-close");
        this.layoutType = "mobile";
        this.addEventListenerForMobile();
      }

      this.model.setLayoutType(this.widthOfWindow);
    };

    addEventListenerForResize() {
      this.windowResizeListener = this.checkWidthOfWindow.bind(this);
      window.addEventListener("resize", this.windowResizeListener);
    };

    addEventListenerForDesctop() {
      if (this.isDesctopListenersON === false) {
        this.isDesctopListenersON = true;

        this.searchInputListener = this.checkInput.bind(this);
        this.searchInput.addEventListener("input", this.searchInputListener);

        this.searchInputListenerOnFocus = this.addKeyUpListenerOnDocument.bind(this);
        this.searchInput.addEventListener("focus", this.searchInputListenerOnFocus);

        this.searchInputRemoveListenerOnFocus = this.removeKeyUpListenerOnDocument.bind(this);
        this.searchInput.addEventListener("blur", this.searchInputRemoveListenerOnFocus);

        this.searchButtonListener = this.checkIsResultsWasFinded.bind(this);
        this.searchButton.addEventListener("click", this.searchButtonListener);
      } else {
        return;
      };
    };

    removeDesctopEventListeners() {
      this.isDesctopListenersON = false;
      this.searchInput.removeEventListener("input", this.searchInputListener);
      this.searchInput.removeEventListener("focus", this.searchInputListenerOnFocus);
      this.searchInput.removeEventListener("blur", this.searchInputRemoveListenerOnFocus);
      if (this.isOnResultsContainerListener === true) this.resultsContainer.removeEventListener("click", this.resultsContainerlistener);
      this.searchButton.removeEventListener("click", this.searchButtonListener);
    };

    addEventListenerForMobile() {
      if (this.isMobileListenersON === false) {
        this.isMobileListenersON = true;

        this.showSearchInput = this.showMobileSearchContainer.bind(this);
        this.searchButton.addEventListener("click", this.showSearchInput);

        this.searchInputListenerMobile = this.checkInput.bind(this);
        this.searchInput.addEventListener("input", this.searchInputListenerMobile);

        this.closeMobileSearch = this.closeMobileSearch.bind(this);
        this.closeButton.addEventListener("click", this.closeMobileSearch);
      } else {
        return;
      };
    };

    removeMobileEventListeners() {
      this.isMobileListenersON = false;
      this.searchButton.removeEventListener("click", this.showSearchInput);
      this.searchInput.removeEventListener("input", this.searchInputListenerMobile);
      this.closeButton.removeEventListener("click", this.closeMobileSearch);
    };

    addKeyUpListenerOnDocument(event) {
      event.preventDefault();
      this.addKeyUpDocumentListener = this.addKeyUpDocumentListener.bind(this);
      document.addEventListener("keyup", this.addKeyUpDocumentListener);
    };

    removeKeyUpListenerOnDocument(event) {
      event.preventDefault();
      document.removeEventListener("keyup", this.addKeyUpDocumentListener);
    };

    addKeyUpDocumentListener(event) {
      event.preventDefault();

      if (event.key === "Escape" || event.code === "Escape") {
        this.model.removeIfSomethingShowing();
        this.model.cleanSearchInput();
        this.removeEventListenerForCloseResultsByClick();
      } else if (event.key === "Enter" || event.code === "Enter") {
        const isResultsForDesctopShowing = document.getElementById("header__search-container__results");
        const isResultsForMobileShowing = document.getElementById("header__search-container-results-mobile");

        if (isResultsForDesctopShowing === null && isResultsForMobileShowing === null) return;

        const containerWithResult = isResultsForDesctopShowing || isResultsForMobileShowing;
        const errorMessage = containerWithResult.querySelector(".header__search-container__results-message");
        
        if (errorMessage === null) {
          this.makeRedirectToSearchPage(containerWithResult);
        } else {
          return;
        };
      };
    };

    addEventListenerForClick() {
      this.documentListenerForForClick = this.eventListenerForClick.bind(this);
      document.addEventListener("click", this.documentListenerForForClick);
    };

    removeEventListenerForClick() {
      document.removeEventListener("click", this.documentListenerForForClick);
    };

    showMobileSearchContainer(event) {
      event.preventDefault();
      this.model.showMobileSearchContainer();
    };

    checkInput(event) {
      event.preventDefault();
      this.model.removeIfSomethingShowing();

      const searchValue = event.target.value;
      if (searchValue.length === 0 || searchValue.trim() === "") {
        this.model.removeIfSomethingShowing();
      } else {
        this.model.setTitleOfMovie(searchValue.trim());
        this.model.startMakingSearch()
      };
    };

    eventListenerForClick(event) {
      event.preventDefault();
      const target = event.target;

      // есть ли контейнеры с результатами поиска
      const isResultsForDesctopShowing = document.getElementById("header__search-container__results");
      const isResultsForMobileShowing = document.getElementById("header__search-container-results-mobile");
      if (isResultsForDesctopShowing || isResultsForMobileShowing) {
        // какой именно (десктопный или мобильный) контейнер с результатами существует
        const containerWithResult = isResultsForDesctopShowing || isResultsForMobileShowing;
        // есть ли в нём сообщение с ошибкой...
        const errorMessage = containerWithResult.querySelector(".header__search-container__results-message");
        // ...если нет - проверяется находится ли объект клика в контейнере с результатами...
        if (errorMessage === null && containerWithResult.contains(target)) {
          // ...если да, то начинает меняться хэш
          const selectedMovie = target.closest(".hscr__item");
          this.makeRedirectToSelectedMoviePage(selectedMovie);
        };
      };

      // определяю контейнер с поисковой строкой для компьютерного и мобильного представлений...
      const desctopSearchContainer = document.getElementById("header__search-container");
      const mobileSearchContainer = document.getElementById("header-mobile-seach-container");

      // ...если кликнули по объектам внутри них - ничего не делать
      if (desctopSearchContainer.contains(target) || mobileSearchContainer.contains(target)) return;

      // ...если за пределами - убрать результаты или остановить загрузку
      if ((document.getElementById("header__search-container__results") !== null) || (document.getElementById("header__search-container-results-mobile") !== null) || (document.getElementById("header-loader-container") !== null)) {
        this.model.cleanSearchInput();
        this.model.removeIfSomethingShowing();
      };
    };

    closeMobileSearch(event) {
      event.preventDefault();
      this.model.cleanSearchInput();
      this.model.removeIfSomethingShowing();
      this.model.closeMobileSearchContainer();
    };

    chekIsSomethingWasShown() {
      let resultsContainerID = null;

      if (this.searchInput.value.trim() !== "") {
        const info = this.searchInput.value.trim();
        this.model.cleanSearchInput();

        switch(this.layoutType) {
          case "mobile":
            resultsContainerID = "#header__search-container__results";
            this.model.openMobileSearchInputWithInfo(info);
            break;
          case "desctop":
            resultsContainerID = "#header__search-container-results-mobile";
            this.model.setInSearchInputInfo(info);
            break;
          default:
            break;
        };
      };

      if (this.container.querySelector(resultsContainerID) !== null) {
        this.model.transferResults();
        this.model.removeIfSomethingShowing();
        this.model.setThatSomethingIsShowing();
      };
    };

    checkIsResultsWasFinded(event) {
      event.preventDefault();

      const isResultsForDesctopShowing = document.getElementById("header__search-container__results");
      const isResultsForMobileShowing = document.getElementById("header__search-container-results-mobile");

      if (isResultsForDesctopShowing === null && isResultsForMobileShowing === null) return;

      const containerWithResult = isResultsForDesctopShowing || isResultsForMobileShowing;
      const errorMessage = containerWithResult.querySelector(".header__search-container__results-message");
        
      if (errorMessage === null) {
        this.makeRedirectToSearchPage(containerWithResult);
      } else {
        return;
      };
    };

    makeRedirectToSelectedMoviePage(selectedMovie) {
      const imdbID = selectedMovie.getAttribute("data-imdbid");
      const newHash = "movie/" + imdbID;

      this.model.cleanSearchInput();
      this.model.removeIfSomethingShowing();

      location.hash = newHash;
    };

    makeRedirectToSearchPage(resultsContainer) {
      const searcValue = this.searchInput.value;
      const newHash = `search/${searcValue}`;

      this.model.cleanSearchInput();
      this.model.removeIfSomethingShowing();

      location.hash = newHash;
    };

  };
  /* --- end controller ---- */


  /* ----- SearchModule ---- */
  class SearchModule {

    constructor() {
      this.model = new Model();
      this.view = new View();
      this.controller = new Controller();
      
      this.model.initialize(this.view);
      this.controller.initialize(this.model);
    };

    start() {
      this.view.setHeader();
      this.controller.setHeader();
      this.controller.checkWidthOfWindow();
      this.controller.addEventListenerForResize();
      this.controller.addEventListenerForClick();
    };

  };
  /* --- end SearchModule -- */


  return {
    SearchModule,
    start: SearchModule.prototype.start,
  }

}());