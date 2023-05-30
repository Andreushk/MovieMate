// Модуль для блока с игрой
import { gameControllsModule } from "../../modules/game-module/game-module.js";


export const profileComponentModule = (function() {
  
  /* -------- model -------- */
  function Model() {
    this.view = null;
    this.settings = {
    };
    this.data = {
      watched: null,
      wishing: null,
      comments: null,
    };
    this.arrayWithGreetings = [
      "It's good to see you! This is your profile page =)",
      "How's it going? This is your profile page =)",
      "Yo! This is your profile page =)",
      "It's nice to meet you! This is your profile page =)",
      "Hi! This is your profile page =)"
    ];
  };

  Model.prototype.initialize = function(view) {
    this.view = view;
  };

  Model.prototype.startLoader = function() {
    this.view.startLoader();
  };

  Model.prototype.removeLoaderIfItsOnPage = function() {
    this.view.removeLoaderIfItsOnPage();
  };

  Model.prototype.setData = function(objectWithData) {
    this.data.watched = objectWithData.watched;
    this.data.wishing = objectWithData.wishlist;
    this.data.comments = objectWithData.comments;
  };

  Model.prototype.updateData = function(objectWithData) {
    this.data.watched = objectWithData.viewed;
    this.data.wishing = objectWithData.wishlist;
    this.data.comments = objectWithData.comments;
  }

  Model.prototype.startLoader = function() {
    this.view.startLoader();
  };

  Model.prototype.startMakingPage = function() {
    const numberOfGreeting = Math.floor(Math.random() * 5);
    this.view.startMakingPage(this.data.watched, this.arrayWithGreetings[numberOfGreeting]);
  };

  Model.prototype.showList = function(whichListMustBeShowen) {
    if (whichListMustBeShowen === "viewed") {
      this.view.highlightButton(whichListMustBeShowen);
      this.view.renderWatchedListPartOfPage(this.data.watched);
    } else {
      this.view.highlightButton(whichListMustBeShowen);
      this.view.renderWishListPartOfPage(this.data.wishing);
    };
  };

  Model.prototype.deleteMovieFromListOfWatched = function(imdbID) {
    delete this.data.watched[imdbID];
    this.view.deleteMovieFromListOfWatched(imdbID);
  };

  Model.prototype.removeMovieFromListOfWishes = function(imdbID) {
    delete this.data.wishing[imdbID];
    this.view.deleteMovieFromListOfWatched(imdbID);
  };

  Model.prototype.openAddCommentModalWindow = function(imdbID, title) {
    this.view.openOverflow();
    this.view.openAddCommentModalWindow(imdbID, title);
  };

  Model.prototype.disableAddingCommentButton = function(imdbID) {
    this.view.disableAddingCommentButton(imdbID);
  };

  Model.prototype.disableOpenCommentButton = function(imdbID) {
    this.view.disableOpenCommentButton(imdbID);
  };

  Model.prototype.closeAddingCommentWindowAndChangeButton = function(imdbID) {
    this.view.closeOverflow();
    this.view.changeAddingCommentButton(imdbID);
  };

  Model.prototype.openCommentWindowForMovie = function(imdbID) {
    const comment = this.data.comments[imdbID];
    this.view.openOverflow();
    this.view.openCommentWindowForMovie(imdbID, comment);
  };

  Model.prototype.makeUserCommentEditable = function() {
    this.view.makeUserCommentEditable();
  };

  Model.prototype.changeOpenCommentButton = function(imdbID) {
    this.view.changeOpenCommentButton(imdbID);
  };

  Model.prototype.makeOpenCommentButtonEnabled = function(imdbID) {
    this.view.makeOpenCommentButtonEnabled(imdbID);
  };

  Model.prototype.closeCommentModalWindow = function() {
    this.view.closeOverflow();
  };

  Model.prototype.addLoadingOverflowOnModalWindow = function() {
    this.view.addLoadingOverflowOnModalWindow();
  };

  Model.prototype.stopGameModule = function() {
    this.view.stopGameModule();
  };
  /* ------ end model ------ */ 


  /* --------- view -------- */ 
  function View() {
    this.htmlElements = {
      contentContainer: null,
      listContainer: null,
      gameContainer: null,
    };
    this.timerIDs = {
      timerIDForDeleteElements: null,
    };
    this.gameModule = null;
  };

  View.prototype.setContainer = function(id) {
    this.htmlElements.contentContainer = document.getElementById(id);
  };

  View.prototype.startLoader = function() {
    const loader = document.createElement("div");
    loader.classList.add("MM-loader");
    loader.setAttribute("id", "profile-page-loader");
    this.htmlElements.contentContainer.append(loader);

    for (let i = 0; i < 4; i++) {
      const loaderItem = document.createElement("div");
      loader.append(loaderItem);
    };
  };

  View.prototype.removeLoaderIfItsOnPage = function() {
    if (document.getElementById("profile-page-loader")) document.getElementById("profile-page-loader").remove();
  };

  View.prototype.startMakingPage = function(dataAboutWatchedMovies, greeting) {
    this.renderWelcomePartOfPage(greeting);
    this.renderControllsPartOfPage();
    this.renderListPartOfPage(dataAboutWatchedMovies);
    this.renderGamePartOfPage();

    this.gameModule = new gameControllsModule.GameModule();
    this.gameModule.start();
  };

  View.prototype.renderWelcomePartOfPage = function(greeting) {
    const helloPart = document.createElement("section");
    helloPart.classList.add("hello");
    this.htmlElements.contentContainer.append(helloPart);

    const body = document.createElement("div");
    body.classList.add("hello__body");
    helloPart.append(body);

    const helloParagraph = document.createElement("h1");
    body.append(helloParagraph);

    const makeHelloParagraph = (text) => {
      var index = 0;
      var timer = setInterval(function() {
        helloParagraph.textContent += text[index];
        index++;
        if (index >= text.length) {
          clearInterval(timer);
        }
      }, 70);
    };
    makeHelloParagraph(greeting);
  };

  View.prototype.renderControllsPartOfPage = function() {
    const controllsSection = document.createElement("section");
    controllsSection.classList.add("controlls");
    this.htmlElements.contentContainer.append(controllsSection);

    const controllsSectionHTML = `
    <div class="controlls__body">
        <div class="controlls__viewed controlls-selected">
            <button id="controlls-viewed-btn" type="button">Viewed</button>
        </div>
        <div class="controlls__wishlist"> 
            <button id="controlls-wishlist-btn" type="button">Wishlist</button>
        </div>
    </div>`;

    controllsSection.innerHTML = controllsSectionHTML;
  };

  View.prototype.renderListPartOfPage = function(data) {
    const list = document.createElement("section");
    list.classList.add("list");
    this.htmlElements.contentContainer.append(list);

    this.htmlElements.listContainer = document.createElement("div");
    this.htmlElements.listContainer.classList.add("list__body");
    list.append(this.htmlElements.listContainer);

    const keysArray = Object.keys(data);

    if (keysArray.length < 1) {
      this.showMessageThatUserDontHaveItemsInHisList();
      return;
    };

    keysArray.forEach(element => {
      const movieObject = data[element];
      const titleOfMovie = movieObject.title;
      const isUserWriteComment = movieObject.comment;
       
      const watchedListItem = document.createElement("div");
      watchedListItem.setAttribute("imdbID", element);
      watchedListItem.classList.add("list__item");
      this.htmlElements.listContainer.append(watchedListItem);

      const title = document.createElement("h1");
      title.textContent = titleOfMovie;
      watchedListItem.append(title);

      if (isUserWriteComment === false) {
        const addCommentButton = document.createElement("button");
        addCommentButton.classList.add("add-comment-btn");
        addCommentButton.setAttribute("type", "button");
        addCommentButton.textContent = "add comment";
        watchedListItem.append(addCommentButton);
      } else if (isUserWriteComment === true) {
        const showCommentButton = document.createElement("button");
        showCommentButton.classList.add("open-comment-btn");
        showCommentButton.setAttribute("type", "button");
        showCommentButton.textContent = "open comment";
        watchedListItem.append(showCommentButton);
      };

      const removeButton = document.createElement("button");
      removeButton.classList.add("remove-btn");
      removeButton.setAttribute("type", "button");
      removeButton.textContent = "remove";
      watchedListItem.append(removeButton);
    });

  };

  View.prototype.renderWatchedListPartOfPage = function(data) {
    
    this.htmlElements.listContainer.innerHTML = "";

    const keysArray = Object.keys(data);

    if (keysArray.length < 1) {
      this.showMessageThatUserDontHaveItemsInHisList();
      return;
    };

    keysArray.forEach(element => {
      const movieObject = data[element];
      const titleOfMovie = movieObject.title;
      const isUserWriteComment = movieObject.comment;
       
      const watchedListItem = document.createElement("div");
      watchedListItem.setAttribute("imdbID", element);
      watchedListItem.classList.add("list__item");
      this.htmlElements.listContainer.append(watchedListItem);

      const title = document.createElement("h1");
      title.textContent = titleOfMovie;
      watchedListItem.append(title);

      if (isUserWriteComment === false) {
        const addCommentButton = document.createElement("button");
        addCommentButton.classList.add("add-comment-btn");
        addCommentButton.setAttribute("type", "button");
        addCommentButton.textContent = "add comment";
        watchedListItem.append(addCommentButton);
      } else if (isUserWriteComment === true) {
        const showCommentButton = document.createElement("button");
        showCommentButton.classList.add("open-comment-btn");
        showCommentButton.setAttribute("type", "button");
        showCommentButton.textContent = "open comment";
        watchedListItem.append(showCommentButton);
      };

      const removeButton = document.createElement("button");
      removeButton.classList.add("remove-btn");
      removeButton.setAttribute("type", "button");
      removeButton.textContent = "remove";
      watchedListItem.append(removeButton);
    });

  };

  View.prototype.renderWishListPartOfPage = function(data) {

    this.htmlElements.listContainer.innerHTML = "";

    const keysArray = Object.keys(data);

    if (keysArray.length < 1) {
      this.showMessageThatUserDontHaveItemsInHisList();
      return;
    };

    keysArray.forEach(element => {

      const titleOfMovie = data[element];

      const wishListItem = document.createElement("div");
      wishListItem.setAttribute("imdbID", element);
      wishListItem.classList.add("list__item");
      this.htmlElements.listContainer.append(wishListItem);

      const title = document.createElement("h1");
      title.textContent = titleOfMovie;
      wishListItem.append(title);

      const removeButton = document.createElement("button");
      removeButton.classList.add("wl-remove-btn");
      removeButton.setAttribute("type", "button");
      removeButton.textContent = "remove";
      wishListItem.append(removeButton);
    });
  };

  View.prototype.renderGamePartOfPage = function() {
    const gameSection = document.createElement("section");
    gameSection.classList.add("game");
    this.htmlElements.contentContainer.append(gameSection);

    this.htmlElements.gameContainer = document.createElement("div");
    this.htmlElements.gameContainer.classList.add("game__body");
    gameSection.append(this.htmlElements.gameContainer);

    const welcome = document.createElement("div");
    welcome.classList.add("game__welcome");
    this.htmlElements.gameContainer.append(welcome);

    const text = document.createElement("p");
    text.textContent = "You can play a game here!";
    welcome.append(text);

    const startButton = document.createElement("button");
    startButton.setAttribute("id", "GW-lets-try");
    startButton.setAttribute("type", "button");
    startButton.textContent = "Lets's try!";
    welcome.append(startButton);
  };

  View.prototype.showMessageThatUserDontHaveItemsInHisList = function() {
    const messageContainer = document.createElement("div")
    messageContainer.classList.add("empty-list-container");
    this.htmlElements.listContainer.append(messageContainer);

    const message = document.createElement("p");
    message.textContent = "It looks like you have nothing here..."
    messageContainer.append(message);
  };

  View.prototype.highlightButton = function(whichIsShowing) {
    const viewedButtonContainer = document.querySelector(".controlls__viewed");
    const wishlistButtonContainer = document.querySelector(".controlls__wishlist");

    if (whichIsShowing === "viewed") {
      wishlistButtonContainer.classList.remove("controlls-selected");
      viewedButtonContainer.classList.add("controlls-selected");
    } else {
      viewedButtonContainer.classList.remove("controlls-selected");
      wishlistButtonContainer.classList.add("controlls-selected");
    };
  };

  View.prototype.deleteMovieFromListOfWatched = function(imdbID) {

    const itemsCollection = this.htmlElements.listContainer.querySelectorAll(".list__item");

    itemsCollection.forEach(element => {
      const itemIMDBID = element.getAttribute("imdbid");
      if (itemIMDBID === imdbID) {
      
        const elementHeight = element.offsetHeight;
        element.innerHTML = "";
        element.style.height = elementHeight + "px";
        element.classList.add("list__item-delete");

        this.timerIDs.timerIDForDeleteElements = setTimeout(() => {
          clearTimeout(this.timerIDs.timerIDForDeleteElements);
          element.remove();

          const itemsCollection = this.htmlElements.listContainer.querySelectorAll(".list__item");
          if (itemsCollection.length === 0) this.showMessageThatUserDontHaveItemsInHisList();
        }, 300);

      };
      
    });

  };

  View.prototype.openOverflow = function() {
    const overflow = document.createElement("div");
    overflow.classList.add("overflow");
    overflow.setAttribute("id", "overflow");
    document.body.prepend(overflow);
  };

  View.prototype.closeOverflow = function() {
    const overflow = document.getElementById("overflow");
    if (overflow) overflow.remove();
  };

  View.prototype.openAddCommentModalWindow = function(imdbID, title) {
    const commentModalWindow = document.createElement("div");
    commentModalWindow.classList.add("comment");
    const overflow = document.getElementById("overflow");
    overflow.append(commentModalWindow);

    const window = document.createElement("div");
    window.classList.add("comment__body");
    window.setAttribute("id", "comment-window");
    commentModalWindow.append(window);

    const titleContainer = document.createElement("div");
    window.append(titleContainer);

    const titleOfMovie = document.createElement("h1");
    titleOfMovie.textContent = `Adding a comment for the movie: ${title}`;
    titleContainer.append(titleOfMovie);

    const commentAreaContainer = document.createElement("div");
    window.append(commentAreaContainer);

    const commentArea = document.createElement("textarea");
    commentArea.setAttribute("id", "comment-area");
    commentArea.setAttribute("name", "comment-area");
    commentArea.setAttribute("placeholder", "Type here...");
    commentAreaContainer.append(commentArea);

    const saveButtonContainer = document.createElement("div");
    window.append(saveButtonContainer);

    const saveButton = document.createElement("button");
    saveButton.setAttribute("id", "comment-window-save-btn");
    saveButton.setAttribute("data-title", title);
    saveButton.setAttribute("imdbid", imdbID);
    saveButton.setAttribute("type", "button");
    saveButton.textContent = "Save";
    saveButtonContainer.append(saveButton);
  };

  View.prototype.disableAddingCommentButton = function(imdbID) {
    const itemsCollection = this.htmlElements.listContainer.querySelectorAll(".list__item");
    itemsCollection.forEach(element => {
      const elementIMDBid = element.getAttribute("imdbid");
      if (elementIMDBid === imdbID) {
        const addCommentButton = element.querySelector(".add-comment-btn");
        addCommentButton.disabled = true;
      };
    });
  };

  View.prototype.disableOpenCommentButton = function(imdbID) {
    const itemsCollection = this.htmlElements.listContainer.querySelectorAll(".list__item");
    itemsCollection.forEach(element => {
      const elementIMDBid = element.getAttribute("imdbid");
      if (elementIMDBid === imdbID) {
        const addCommentButton = element.querySelector(".open-comment-btn");
        addCommentButton.disabled = true;
      };
    });
  };

  View.prototype.changeAddingCommentButton = function(imdbID) {
    const listItems = this.htmlElements.listContainer.querySelectorAll(".list__item");

    listItems.forEach(element => {
      const elementIMDBid = element.getAttribute("imdbid");
      if (imdbID === elementIMDBid) {
        const addCommentButton = element.querySelector(".add-comment-btn");
        addCommentButton.classList.remove("add-comment-btn");
        addCommentButton.classList.add("open-comment-btn");
        addCommentButton.textContent = "open comment";
        addCommentButton.disabled = false;
      };
    });

  };

  View.prototype.openCommentWindowForMovie = function(imdbID, comment) {
    const commentModalWindow = document.createElement("div");
    commentModalWindow.classList.add("comment");
    const overflow = document.getElementById("overflow");
    overflow.append(commentModalWindow);

    const window = document.createElement("div");
    window.setAttribute("id", "comment-window");
    window.classList.add("comment__body");
    commentModalWindow.append(window);

    const titleContainer = document.createElement("div");
    window.append(titleContainer);

    const title = document.createElement("h1");
    title.textContent = `Your note for this film:`;
    titleContainer.append(title);

    const commentAreaContainer = document.createElement("div");
    commentAreaContainer.setAttribute("id", "comment-area-container")
    window.append(commentAreaContainer);

    const userCommentContainer = document.createElement("div");
    userCommentContainer.classList.add("user-comment-area");
    commentAreaContainer.append(userCommentContainer);

    const userCommentParagraph = document.createElement("p");
    userCommentParagraph.setAttribute("id", "user-comment-paragraph");
    userCommentParagraph.textContent = comment;
    userCommentContainer.append(userCommentParagraph);

    const windowFooter = document.createElement("div");
    windowFooter.classList.add("comment__footer");
    window.append(windowFooter);

    const cancelButton = document.createElement("button");
    cancelButton.setAttribute("id", "comment-window-close-btn");
    cancelButton.setAttribute("type", "button");
    cancelButton.textContent = "Cancel";
    windowFooter.append(cancelButton);

    const editButton = document.createElement("button");
    editButton.setAttribute("id", "comment-window-edit-btn");
    editButton.setAttribute("imdbid", imdbID);
    editButton.setAttribute("type", "button");
    editButton.textContent = "Edit";
    windowFooter.append(editButton);
  };

  View.prototype.makeUserCommentEditable = function() {
    const modalWindow = document.getElementById("comment-window");
    const commentAreaContainer = modalWindow.querySelector("#comment-area-container");
    const userCommentContainer = commentAreaContainer.querySelector(".user-comment-area");
    const userCommentValue = userCommentContainer.firstElementChild.textContent;

    const editButton =  document.getElementById("comment-window-edit-btn");
    editButton.textContent = "Save";
    editButton.setAttribute("id", "comment-window-save-edit-btn");

    commentAreaContainer.innerHTML = "";
    
    const textarea = document.createElement("textarea");
    textarea.setAttribute("id", "edited-comment-area");
    textarea.setAttribute("name", "edited-comment-area");
    textarea.value = userCommentValue;

    commentAreaContainer.append(textarea);
    textarea.focus();
  };

  View.prototype.changeOpenCommentButton = function(imdbID) {
    const listItems = this.htmlElements.listContainer.querySelectorAll(".list__item");

    listItems.forEach(element => {
      const elementIMDBid = element.getAttribute("imdbid");
      if (imdbID === elementIMDBid) {
        const openCommentButton = element.querySelector(".open-comment-btn");
        openCommentButton.classList.add("add-comment-btn");
        openCommentButton.classList.remove("open-comment-btn");
        openCommentButton.textContent = "add comment";
      };
    });
  };

  View.prototype.makeOpenCommentButtonEnabled = function(imdbID) {
    const listItems = this.htmlElements.listContainer.querySelectorAll(".list__item");

    listItems.forEach(element => {
      const elementIMDBid = element.getAttribute("imdbid");
      if (imdbID === elementIMDBid) {
        const openCommentButton = element.querySelector(".open-comment-btn");
        openCommentButton.disabled = false;
      };
    });
  };

  View.prototype.addLoadingOverflowOnModalWindow = function() {
    const modalWindow = document.getElementById("comment-window");

    const loaderContainer = document.createElement("div");
    loaderContainer.setAttribute("id", "comment-loading-overflow")
    loaderContainer.classList.add("loading-overflow");
    modalWindow.append(loaderContainer);

    const loader = document.createElement("div");
    loader.classList.add("MM-loader");

    for (let i = 0; i < 4; i++) {
      const loaderItem = document.createElement("div");
      loader.append(loaderItem);
    };

    loaderContainer.append(loader);
  };

  View.prototype.stopGameModule = function() {
    this.gameModule.stop();
    this.gameModule = null;
  };
  /* ------- end view ------ */


  /* ------ controller ----- */ 
  function Controller() {
    this.model = null;
    this.listeners = {
      buttonForWishlist: null,
      buttonForViewed: null,
    }
  };

  Controller.prototype.initialize = function(model) {
    this.model = model;
  };

  Controller.prototype.startPageRendering = function() {
    this.model.startMakingPage();
    this.addEventListenersOnSwith();
  };

  Controller.prototype.addEventListenersOnSwith = function() {
    const buttonForWishlist = document.getElementById("controlls-wishlist-btn");
    const buttonForViewed = document.getElementById("controlls-viewed-btn");

    this.listeners.buttonForWishlist = this.setList.bind(this);
    buttonForWishlist.addEventListener("click", this.listeners.buttonForWishlist);

    this.listeners.buttonForViewed = this.setList.bind(this);
    buttonForViewed.addEventListener("click", this.listeners.buttonForViewed);
  };

  Controller.prototype.setList = function(event) {
    event.preventDefault();
    
    let whichListMustBeShowen = null;
    event.target === document.getElementById("controlls-viewed-btn") ? whichListMustBeShowen = "viewed" : whichListMustBeShowen = "wishes";
    
    this.model.showList(whichListMustBeShowen);
  }

  Controller.prototype.deleteMovieFromListOfWatched = function(imdbID) {
    this.model.deleteMovieFromListOfWatched(imdbID);
  };

  Controller.prototype.removeMovieFromListOfWishes = function(imdbID) {
    this.model.removeMovieFromListOfWishes(imdbID);
  };

  Controller.prototype.startLoader = function() {
    this.model.startLoader();
  };

  Controller.prototype.removeLoaderIfItsOnPage = function() {
    this.model.removeLoaderIfItsOnPage();
  };

  Controller.prototype.openAddCommentModalWindow = function(imdbID, title) {
    this.model.openAddCommentModalWindow(imdbID, title);
  };

  Controller.prototype.disableAddingCommentButton = function(imdbID) {
    this.model.disableAddingCommentButton(imdbID);
  };

  Controller.prototype.disableOpenCommentButton = function(imdbID) {
    this.model.disableOpenCommentButton(imdbID);
  };

  Controller.prototype.closeAddingCommentWindowAndChangeButton = function(imdbID) {
    this.model.closeAddingCommentWindowAndChangeButton(imdbID);
  };

  Controller.prototype.openCommentWindowForMovie = function(imdbID) {
    this.model.openCommentWindowForMovie(imdbID);
  };

  Controller.prototype.makeUserCommentEditable = function() {
    this.model.makeUserCommentEditable();
  };

  Controller.prototype.changeOpenCommentButton = function(imdbID) {
    this.model.changeOpenCommentButton(imdbID);
  };

  Controller.prototype.makeOpenCommentButtonEnabled = function(imdbID) {
    this.model.makeOpenCommentButtonEnabled(imdbID);
  };

  Controller.prototype.closeCommentModalWindow = function() {
    this.model.closeCommentModalWindow();
  };

  Controller.prototype.addLoadingOverflowOnModalWindow = function() {
    this.model.addLoadingOverflowOnModalWindow();
  };

  Controller.prototype.stopGameModule = function() {
    this.model.stopGameModule();
  };
  /* --- end controller ---- */ 


  /* --- ProfilePageModule --- */
  function ProfilePageModule() {
    this.model = new Model();
    this.view = new View();
    this.controller = new Controller();

    this.model.initialize(this.view);
    this.controller.initialize(this.model);
  };

  ProfilePageModule.prototype.start = function(id, objectWithData) {
    if (objectWithData === null) {
      this.view.setContainer(id);
      this.controller.startLoader();
      return;
    } else {
      this.controller.removeLoaderIfItsOnPage();
      this.model.setData(objectWithData);
      this.view.setContainer(id);
      this.controller.startPageRendering();
    }
    
  };

  ProfilePageModule.prototype.deleteMovieFromListOfWatched = function(imdbID) {
    this.controller.deleteMovieFromListOfWatched(imdbID);
  };

  ProfilePageModule.prototype.removeMovieFromListOfWishes = function(imdbID) {
    this.controller.removeMovieFromListOfWishes(imdbID);
  };

  ProfilePageModule.prototype.openAddCommentModalWindow = function(imdbID, title) {
    this.controller.openAddCommentModalWindow(imdbID, title);
  };

  ProfilePageModule.prototype.openCommentWindowForMovie = function(imdbID) {
    this.controller.openCommentWindowForMovie(imdbID);
  };

  ProfilePageModule.prototype.makeUserCommentEditable = function() {
    this.controller.makeUserCommentEditable();
  };

  ProfilePageModule.prototype.closeAddingCommentWindowAndChangeButton = function(imdbID) {
    this.controller.closeAddingCommentWindowAndChangeButton(imdbID);
  };

  ProfilePageModule.prototype.updateData = function(data) {
    this.model.updateData(data);
  };

  ProfilePageModule.prototype.disableAddingCommentButton = function(imdbID) {
    this.controller.disableAddingCommentButton(imdbID);
  };

  ProfilePageModule.prototype.disableOpenCommentButton = function(imdbID) {
    this.controller.disableOpenCommentButton(imdbID);
  };

  ProfilePageModule.prototype.changeOpenCommentButton = function(imdbID) {
    this.controller.changeOpenCommentButton(imdbID);
  };

  ProfilePageModule.prototype.makeOpenCommentButtonEnabled = function(imdbID) {
    this.controller.makeOpenCommentButtonEnabled(imdbID);
  };

  ProfilePageModule.prototype.closeCommentModalWindow = function() {
    this.controller.closeCommentModalWindow();
  };

  ProfilePageModule.prototype.addLoadingOverflowOnModalWindow = function() {
    this.controller.addLoadingOverflowOnModalWindow();
  };

  ProfilePageModule.prototype.stop = function() {
    this.controller.stopGameModule()
  };
  /* - end ProfilePageModule - */

  return {
    ProfilePageModule,
    start: ProfilePageModule.prototype.start,
    updateData: ProfilePageModule.prototype.updateData,
    deleteMovieFromListOfWatched: ProfilePageModule.prototype.deleteMovieFromListOfWatched,
    removeMovieFromListOfWishes: ProfilePageModule.prototype.removeMovieFromListOfWishes,
    openAddCommentModalWindow: ProfilePageModule.prototype.openAddCommentModalWindow,
    disableAddingCommentButton: ProfilePageModule.prototype.disableAddingCommentButton,
    disableOpenCommentButton: ProfilePageModule.prototype.disableOpenCommentButton,
    makeOpenCommentButtonEnabled: ProfilePageModule.prototype.makeOpenCommentButtonEnabled,
    closeAddingCommentWindowAndChangeButton: ProfilePageModule.prototype.closeAddingCommentWindowAndChangeButton,
    openCommentWindowForMovie: ProfilePageModule.openCommentWindowForMovie,
    makeUserCommentEditable: ProfilePageModule.prototype.makeUserCommentEditable,
    changeOpenCommentButton: ProfilePageModule.prototype.changeOpenCommentButton,
    closeCommentModalWindow:ProfilePageModule.prototype.closeCommentModalWindow,
    addLoadingOverflowOnModalWindow: ProfilePageModule.prototype.addLoadingOverflowOnModalWindow,
    stop: ProfilePageModule.prototype.stop,
  };
  
}());