/* 
  Импорт всего необходимого для работы приложения 
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { collection, doc, setDoc, onSnapshot, getDoc, updateDoc, collectionGroup, deleteField  } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
  

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB940a0fVW3HEVsFr9LqpC4f9ldw0EoYTE",
  authDomain: "moviemate-9181.firebaseapp.com",
  projectId: "moviemate-9181",
  storageBucket: "moviemate-9181.appspot.com",
  messagingSenderId: "778465789318",
  appId: "1:778465789318:web:dca4533b797feaa9ec1807"
};
  

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
// Получение объекта аутентификации
const auth = getAuth(app);
// Получение объекта базы данных
const firestore = getFirestore(app);


// Дефолтные компоненты, которые используются на всех страницах:
import { defaultComponents } from "../javascript/components/default/default-components.js";
// Роуты:
import { routesObj } from "../javascript/routes/routes.js";
// Компоненты для главной/домашней страницы:
import { homeComponents } from "../javascript/components/pages/components-for-home-page.js";
// Компоненты для страницы с ошибкой:
import { errorSection } from "../javascript/components/pages/components-for-error-page.js";
// Компоненты для страницы с результатами поиска:
import { searchPageComponent } from "../javascript/components/pages/components-for-search-page.js";
// Модуль управления поисковой строкой:
import { searchModule } from "../javascript/modules/search-module/search-module.js";
// Компонент для страницы с фильмом:
import { moviePageModule } from "../javascript/components/pages/components-for-movie-page.js";
// Компонент для страницы профиля:
import { profileComponentModule } from "../javascript/components/pages/components-for-profile-page.js";


/*
  Переопределение в объекты для удобства использования
*/

// Объект с дефолтными компонентами, которые есть на всех страницах (../default-components.js)
const componentsDefault = {
  header: defaultComponents.header,
  pageContentContainer: defaultComponents.contentContainer,
  footer: defaultComponents.footer,
  signUp: defaultComponents.signUp,
  logIn: defaultComponents.logIn,
};

// Объект с компонентами главной/домашней страницы (../components-for-home-page.js)
const componentsHome = {
  about: homeComponents.about,
  recommendations: homeComponents.recommendations,
  registration: homeComponents.registration,
  account: homeComponents.account,
};

// Объект роутов с информацией о "страничках" (../routes.js)
const routes = {
  home: routesObj.mainPage,
  search: routesObj.searchPage,
  movie: routesObj.moviePage,
  profile: routesObj.profilePage,
  error: routesObj.errorPage,
};



/* ------------ MovieMate SPA модуль ------------ */
const movieMateSPA = (function() {
  /* ------- model ------- */
  function Model() {
    this.view = null;

    this.settings = {
      data: {
        userSnapshotsListeners: {
          isActive: false,
          wishlistListener: null,
          viewedListeber: null,
          commentsListener: null,
        },
        timerID: null,
        wishlist: null,
        viewed: null,
        comments: null,
      },
      audioContext: null,
      authorizedSoundPath: "http://fe.it-academy.by/Sites/0043221/login-sound.mp3",
      isUserAuthorized: false,
      UID: null,

      isSomethingOnPage: false,
      hash: null,
      valueForSearch: null,
    };
  };

  Model.prototype.initialize = function(view) {
    this.view = view;
  };

  Model.prototype.setAudioContext = function() {
    const contextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);
    this.settings.audioContext = new contextClass();

    if (this.settings.audioContext.state === "suspended") {
      this.settings.audioContext.resume();
    };

    this.view.setAudioContext(this.settings.audioContext, this.settings.authorizedSoundPath);
  };

  Model.prototype.setHashValue = function(hash) {
    
    if ((this.settings.hash === "" || this.settings.hash === "home") && (hash === "" || hash === "home")) return;

    if (this.settings.isSomethingOnPage === true) {
      if (this.settings.hash === "" || this.settings.hash === "home") {
        this.view.removeListenersFromSlider();
      } else if (this.settings.hash === "movie") {
        this.view.removeListenersFromMoviePage();
      } else if (this.settings.hash === "profile") {
        this.view.removeListenersFromProfilePage();
      };
      this.view.cleanPageContent();
    };

    this.settings.valueForSearch = null;
    const hashComponents = hash.split("/");
    if (hashComponents.length > 1 && hashComponents.length < 3) {
      hash = hashComponents[0];
      this.settings.valueForSearch = hashComponents[1];
    } else {
      hash = hashComponents[0];
    };

    this.settings.hash = hash;
    this.settings.isSomethingOnPage = true;

    if (this.settings.hash === "movie" && this.settings.isUserAuthorized === true) {
      const isUserWatchedThis = this.checkUserWatchedList(this.settings.valueForSearch);
      const isUserWishThis = this.checkUserWishList(this.settings.valueForSearch);

      if (isUserWatchedThis)  {
        this.view.identifyThePageUsingTheHash(hash, this.settings.isUserAuthorized, this.settings.valueForSearch, "watched");
        return;
      };

      if (isUserWishThis) {
        this.view.identifyThePageUsingTheHash(hash, this.settings.isUserAuthorized, this.settings.valueForSearch, "wish");
        return;
      };
    };

    if (this.settings.hash === "profile" && this.settings.isUserAuthorized === false) {
      location.hash = "home";
      return;
    };

    if (this.settings.hash === "profile" && this.settings.isUserAuthorized === true) {
      const dataObject = {
        watched: this.settings.data.viewed,
        wishlist: this.settings.data.wishlist,
        comments: this.settings.data.comments,
      };

      if (this.settings.data.viewed === null && this.settings.data.wishlist === null && this.settings.data.comments === null) {
        this.view.identifyThePageUsingTheHash(hash, null, null, null, null);

        this.settings.data.timerID = setInterval(() => {
          this.chekData(hash);
        }, 250);

        return;
      };

      this.view.identifyThePageUsingTheHash(hash, null, null, null, dataObject);
      return;
    };

    this.view.identifyThePageUsingTheHash(hash, this.settings.isUserAuthorized, this.settings.valueForSearch);
  };

  Model.prototype.chekData = function(hash) {
    if (this.settings.data.viewed !== null && this.settings.data.wishlist !== null && this.settings.data.comments !== null) {
      clearInterval(this.settings.data.timerID);
      const dataObject = {watched: this.settings.data.viewed, wishlist: this.settings.data.wishlist, comments: this.settings.data.comments};
      this.view.identifyThePageUsingTheHash(hash, null, null, null, dataObject);
    };
  };

  Model.prototype.checkUserWatchedList = function(imdbID) {

    try {
      return this.settings.data.viewed[imdbID] ? true : false;
    } catch(error) {
      if (error.name === "TypeError") {
        return;
      } else {
        console.warn(error);
      };
    };
  
  };

  Model.prototype.checkUserWishList = function(imdbID) {
    
    try {
      return this.settings.data.wishlist[imdbID] ? true : false;
    } catch(error) {
      if (error.name === "TypeError") {
        return;
      } else {
        console.warn(error);
      };
    };

  };

  Model.prototype.scrollToTop = function(speed) {
    speed === "fast" ? this.view.scrollToTopFast() : this.view.scrollToTopSmooth();
  };

  Model.prototype.showSignUpModalWindow = function() {
    this.view.showSignUpModalWindow();
  };

  Model.prototype.showLogInModalWindow = function() {
    this.view.showLogInModalWindow();
  };

  Model.prototype.changeRegistartionToLogInModal = function() {
    this.view.changeRegistartionToLogInModal();
  };

  Model.prototype.changeLogInToRegistartionModal = function() {
    this.view.changeLogInToRegistartionModal();
  };

  Model.prototype.removeOverflow = function() {
    this.view.removeOverflow();
  };

  Model.prototype.checkInputValue = function(type, emailValue, passwordValue) {
    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

    const resultOfEmailValidation = EMAIL_REGEXP.test(emailValue);
    const resultOfPasswordValidation = passwordValue.length > 7 || false;

    if (type === "email") {
      this.view.markInput(type, resultOfEmailValidation);
    } else if (type === "password") {
      this.view.markInput(type, resultOfPasswordValidation);
    };

    if (resultOfEmailValidation === true && resultOfPasswordValidation === true) {
      this.view.makeRegistrationButtonActive();
    };
    
  };

  Model.prototype.startLoaderInRegWindow = function() {
    this.view.startLoaderInRegWindow();
  };

  Model.prototype.removeLoaderInRegWindow = function() {
    this.view.removeLoaderInRegWindow();
  };

  Model.prototype.registerUser = async function(email, password) {

    try {
      // создается новый пользователь
      const userObject = await createUserWithEmailAndPassword(auth, email, password);
      const user = await userObject.user;
      this.settings.UID = user.uid;
      this.settings.isUserAuthorized = true;


      // ссылка на коллекцию в базе данных
      const usersCollection = collection(firestore, "users");

      // создается место в базе данных для пользователя
      const newUserDocument = doc(usersCollection, `user_${this.settings.UID}`);
      await setDoc(newUserDocument, {});

      // Создание коллекции "comments" внутри пользователя
      const commentsCollection = collection(newUserDocument, "comments");
      const userCommentsDocRef = doc(commentsCollection, "user_comments");
      await setDoc(userCommentsDocRef, {});

      // Создание коллекции "viewed" внутри пользователя
      const viewedCollection = collection(newUserDocument, "viewed");
      const userViewedDocRef = doc(viewedCollection, "user_viewed");
      await setDoc(userViewedDocRef, {});

      // Создание коллекции "wishlist" внутри пользователя
      const wishlistCollection = collection(newUserDocument, "wishlist");
      const userWishlistDocRef = doc(wishlistCollection, "user_wishlist");
      await setDoc(userWishlistDocRef, {});


      // закрытие модального окна и изменение элементов страницы
      this.view.removeRegButtonsInHeader();

      if (location.hash.slice(1).toLowerCase() === "" || location.hash.slice(1).toLowerCase() === "home") {
        this.view.changeRegBlock();
      };

      this.addUserSnapshotListeners();
      this.view.makeLogInSound(this.settings.audioContext, this.settings.authorizedSoundPath);
      this.view.removeOverflow();

    } catch(error) {
      this.removeLoaderInRegWindow();
      console.warn(error);
    };

  };

  Model.prototype.logInUser = async function(email, password) {

    try {
      const userObject = await signInWithEmailAndPassword(auth, email, password);
      const user = userObject.user;
      this.settings.UID = user.uid;
      this.settings.isUserAuthorized = true;

      this.addUserSnapshotListeners();

      this.view.removeRegButtonsInHeader();

      if (location.hash.slice(1).toLowerCase() === "" || location.hash.slice(1).toLowerCase() === "home") {
        this.view.changeRegBlock();
      };

      this.view.removeOverflow();
      this.view.makeLogInSound(this.settings.audioContext, this.settings.authorizedSoundPath);

    } catch(error) {
      this.removeLoaderInRegWindow();
      if (error.name === "FirebaseError" && error.message === "Firebase: Error (auth/wrong-password).") {
        const message = "Incorrect login information (password)";
        this.view.sayUserThatSomethingIsWrong(message);
      } else if (error.name === "FirebaseError" && ((error.message === "Firebase: Error (auth/invalid-email).") || (error.message === "Firebase: Error (auth/user-not-found)."))) {
        const message = "Incorrect login information (e-mail)";
        this.view.sayUserThatSomethingIsWrong(message);
      } else {
        console.warn(error);
      };
    };

  };

  Model.prototype.addUserSnapshotListeners = async function() {
    this.settings.data.userSnapshotsListeners.isActive = true;
  
    // Ссылка на корневую папку users
    const users = collection(firestore, "users");
    // Ссылка на документ пользователя
    const userDocument = doc(users, `user_${this.settings.UID}`);
  
    // Слушатель изменений для коллекции "comments" текущего пользователя
    const commentsCollection = collection(userDocument, "comments");
    this.settings.data.userSnapshotsListeners.commentsListener = onSnapshot(commentsCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const commentData = change.doc.data();
        this.settings.data.comments = commentData;
        this.determineWhatPageAreOpen();
      });
    });
  
    // Слушатель изменений для коллекции "viewed" текущего пользователя
    const viewedCollection = collection(userDocument, "viewed");
    this.settings.data.userSnapshotsListeners.viewedListeber = onSnapshot(viewedCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const viewedData = change.doc.data();
        this.settings.data.viewed = viewedData;
        this.determineWhatPageAreOpen();
      });
    });
  
    // Слушатель изменений для коллекции "wishlist" текущего пользователя
    const wishlistCollection = collection(userDocument, "wishlist");
    this.settings.data.userSnapshotsListeners.wishlistListener = onSnapshot(wishlistCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const wishlistData = change.doc.data();
        this.settings.data.wishlist = wishlistData;
        this.determineWhatPageAreOpen();
      });
    });
  };
  
  Model.prototype.determineWhatPageAreOpen = function() {
    const hashValue = location.hash.slice(1).toLowerCase();
    const hashComponents = hashValue.split("/");

    let hash = null;
    let imdbID = null;
    if (hashComponents.length > 1) {
      hash = hashComponents[0];
      imdbID = hashComponents[1];
    } else {
      hash = hashComponents[0];
    };

    if (hash === "home" || hash === "" || hash === "seacrh") return;
    if (hash === "movie") this.checkIsCurrentMovieInUserLists(imdbID);
    if (hash === "profile") this.updateProfileData();
  };

  Model.prototype.updateProfileData = function() {
    this.view.updateDataInProfilePageModule(this.settings.data);
  };

  Model.prototype.checkIsCurrentMovieInUserLists = function(imdbID) {
    const isUserWatchedThis = this.checkUserWatchedList(this.settings.valueForSearch);
    const isUserWishThis = this.checkUserWishList(this.settings.valueForSearch);

    if (isUserWatchedThis)  {
      this.changeAsWatcedButton();
      return;
    } else if (isUserWishThis) {
      this.changeWishlistButton();
      return;
    };

  };

  Model.prototype.changePlotViewOnMoviePage = function() {
    this.view.changePlotViewOnMoviePage();
  };

  Model.prototype.redirectUserOnTrailer = function(link) {
    this.view.redirectUserOnTrailer(link);
  };

  Model.prototype.markMovieAsWatched = async function(title) {
    if (this.settings.isUserAuthorized === false) {
      this.showLogInModalWindow();
      return;
    };

    const imdbID = this.settings.valueForSearch;
    const objectWithInfoForFirestore = {
      title: title,
      comment: false,
    };
    
    try {
      // Ссылка на корневую "users"
      const users = collection(firestore, "users");

      // Ссылка на документ пользователя с его UID
      const userDocument = doc(users, `user_${this.settings.UID}`);
      // Cсылка на коллекцию viewed внутри документа пользователя
      const viewedCollection = collection(userDocument, "viewed");
      // Ссылка на документ user_viewed в коллекции viewed
      const userViewedDocument = doc(viewedCollection, "user_viewed");
      // Получаем снимок текущего документа с viewed-элементами
      const userViewedDocumentSnapshot = await getDoc(userViewedDocument);
      const userViewedData = userViewedDocumentSnapshot.data();

      if (userViewedData) {
        // Если поле уже существует, то ничего не происходит
        if (userViewedData.hasOwnProperty(imdbID)) {
          console.log("Поле уже существует в списке просмотров.");
          return;
        };
  
        // Если поле не существует, добавляем новое поле в список просмотров
        const viewedDataWithNewField = { ...userViewedData, [imdbID]: objectWithInfoForFirestore };
        await updateDoc(userViewedDocument, viewedDataWithNewField);
      };
      this.changeAsWatcedButton();

    } catch(error) {
      console.warn(error);
    };
  };

  Model.prototype.changeAsWatcedButton = function() {
    this.view.changeAsWatcedButton();
  };

  Model.prototype.addMovieToWishList = async function(title) {
    if (this.settings.isUserAuthorized === false) {
      this.showLogInModalWindow();
      return;
    };

    const imdbID = this.settings.valueForSearch;
    try {
      // Ссылка на корневую папку users
      const users = collection(firestore, "users");
      // Ссылка на документ пользователя
      const userDocument = doc(users, `user_${this.settings.UID}`);
      // Ссылка на коллекцию wishlist пользователя
      const wishlistCollection = collection(userDocument, "wishlist");
      // Ссылка на документ user_wishlist в коллекции wishlist
      const userWishlistDocument = doc(wishlistCollection, "user_wishlist");
      // Снимок документа
      const userWishlistDocumentSnapshot = await getDoc(userWishlistDocument);
      const  userWishlistData = userWishlistDocumentSnapshot.data();

      if (userWishlistData) {
        // Если поле существует, то ничего не происходит
        if (userWishlistData.hasOwnProperty(imdbID)) {
          return;
        };

        // Если поле не существует, то добавляется
        const wishlistDataWithNewField = {...userWishlistData, [imdbID]: title };
        await updateDoc(userWishlistDocument, wishlistDataWithNewField);
      };
      this.changeWishlistButton();

    } catch(error) {
      console.warn(error);
    };

  };

  Model.prototype.changeWishlistButton = function() {
    this.view.changeWishlistButton();
  };

  Model.prototype.tryToOpenPfofilePage = function() {
    if (this.settings.isUserAuthorized === true) {
      location.hash = "profile";
    } else {
      this.showLogInModalWindow();
    };
  };

  Model.prototype.removeMovieFromListOfWatchedMovies = async function(imdbID) {
    
    try {
      // Корневая коллекция с пользователями
      const usersCollection = collection(firestore, "users");
      // Документ пользователя
      const userDocument = doc(usersCollection, `user_${this.settings.UID}`);
      // Коллекция просмотренных пользователем фильмов
      const viewedCollection = collection(userDocument, "viewed");
      // Документ с полями фильмов, которые пользователь посмотрел
      const userViewedDocument = doc(viewedCollection, "user_viewed");

      // Удаляется поле с нужным imdbID
      await updateDoc(userViewedDocument, {
        [imdbID]: deleteField()
      });

      this.view.removeMovieFromListOfWatchedMovies(imdbID);

    } catch (error) {
      console.warn(error);
    };

  };

  Model.prototype.removeMovieFromListOfWishes = async function(imdbID) {

    try {

      // Корневая колекция с пользователями
      const usersCollection = collection(firestore, "users");
      // Документ пользователя
      const userDocument = doc(usersCollection, `user_${this.settings.UID}`);
      // Коллекция списка желаний
      const wishlistCollection = collection(userDocument, "wishlist");
      // Документ с полями списка желаний
      const userWishlistDocument = doc(wishlistCollection, "user_wishlist");

      await updateDoc(userWishlistDocument, {
        [imdbID]: deleteField()
      });

      this.view.removeMovieFromListOfWishes(imdbID);

    } catch(error) {
      console.warn(error);
    };

  };

  Model.prototype.openAddCommentModalWindow = function(imdbID, title) {
    this.view.openAddCommentModalWindow(imdbID, title);
  };

  Model.prototype.saveCommentToFirestore = async function(imdbID, titleOfTheMovie, commentValue) {

    this.view.addLoadingOverflowOnModalWindow();
    this.view.disableAddingCommentButton(imdbID);

    try {
      // Ссылка на корневую папку users
      const users = collection(firestore, "users");
      // Ссылка на документ пользователя
      const userDocument = doc(users, `user_${this.settings.UID}`);

      // Ссылка на коллекцию comments пользователя
      const commentsCollection = collection(userDocument, "comments");
      // Ссылка на документ user_comments в коллекции wishlist
      const userCommentsDocument = doc(commentsCollection, "user_comments");
      // Снимок документа
      const userCommentsDocumentSnapshot = await getDoc(userCommentsDocument);
      const  userCommentsData = userCommentsDocumentSnapshot.data();

      if (userCommentsData) {
        // Если поле существует, то ничего не происходит
        if (userCommentsData.hasOwnProperty(imdbID)) {
          return;
        };
        // Если поле не существует, то добавляется
        const commentsDataWithNewField = {...userCommentsData, [imdbID]: commentValue };
        await updateDoc(userCommentsDocument, commentsDataWithNewField);
      };


      const objectWithInfoForFirestore = {title: titleOfTheMovie, comment: true,};
      // Cсылка на коллекцию viewed внутри документа пользователя
      const viewedCollection = collection(userDocument, "viewed");
      // Ссылка на документ user_viewed в коллекции viewed
      const userViewedDocument = doc(viewedCollection, "user_viewed");
      await updateDoc(userViewedDocument, {
        [imdbID]: objectWithInfoForFirestore
      });

      this.view.closeCommentModalWindow();
      this.view.closeAddingCommentWindowAndChangeButton(imdbID);

    } catch(error) {
      console.warn(error);
    };

  };

  Model.prototype.openCommentWindowForMovie = function(imdbID) {
    this.view.openCommentWindowForMovie(imdbID);
  };

  Model.prototype.makeUserCommentEditable = function() {
    this.view.makeUserCommentEditable();
  };

  Model.prototype.updateCommentsDataInFirestore = async function(imdbID, newCommentValue) {

    this.view.addLoadingOverflowOnModalWindow();
    this.view.disableOpenCommentButton(imdbID);

    try {
      // Ссылка на корневую папку users
      const users = collection(firestore, "users");
      // Ссылка на документ пользователя
      const userDocument = doc(users, `user_${this.settings.UID}`);
      // Ссылка на коллекцию comments пользователя
      const commentsCollection = collection(userDocument, "comments");
      // Ссылка на документ user_comments в коллекции wishlist
      const userCommentsDocument = doc(commentsCollection, "user_comments");
      await updateDoc(userCommentsDocument, {
        [imdbID]: newCommentValue
      });

      this.view.makeOpenCommentButtonEnabled(imdbID);
      this.view.closeCommentModalWindow();

    } catch(error) {
      console.warn(error);
    };

  };

  Model.prototype.deleteUserCommentForMovie = async function(imdbID) {

    try {

      this.view.addLoadingOverflowOnModalWindow();

      // Корневая колекция с пользователями
      const usersCollection = collection(firestore, "users");
      // Документ пользователя
      const userDocument = doc(usersCollection, `user_${this.settings.UID}`);
      // Ссылка на коллекцию comments пользователя
      const commentsCollection = collection(userDocument, "comments");
      // Ссылка на документ user_comments в коллекции wishlist
      const userCommentsDocument = doc(commentsCollection, "user_comments");

      await updateDoc(userCommentsDocument, {
        [imdbID]: deleteField()
      });

      const viewedCollectionRef = collection(userDocument, "viewed");
      const userViewedDocRef = doc(viewedCollectionRef, "user_viewed");

      await updateDoc(userViewedDocRef, {
        [`${imdbID}.comment`]: false
      });

      this.view.changeOpenCommentButton(imdbID);
      this.view.closeCommentModalWindow();

    } catch(error) {
      console.warn(error);
    };

  };
  /* ------ end model -----*/


  /* ------- view -------- */
  function View() {
    this.settings = {
      pageContentContainerID: null,
      isUserAuthorized: false,
      dataForProfilePage: null,
      listOption: null,
      recommendationSliderComponent: null,
      contentContainer: null,
      searchInformation: {
        valueForSearch: null,
      },
      moviePageModule: null,
      profilePageModule: null,
    };
  };

  View.prototype.initialize = function(containerID) {
    this.settings.pageContentContainerID = containerID;
    this.settings.contentContainer = document.getElementById(`${containerID}`);
  };

  View.prototype.cleanPageContent = function() {
    this.settings.contentContainer.innerHTML = "";
  };

  View.prototype.scrollToTopFast = function() {
    window.scrollTo(0, 0);
  };

  View.prototype.scrollToTopSmooth = function() {
    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    };
  };

  View.prototype.identifyThePageUsingTheHash = function(hash, isUserAuthorized, valueForSearch, listOption, data) {
    this.settings.isUserAuthorized = isUserAuthorized;
    this.settings.listOption = listOption;
    this.settings.dataForProfilePage = data;
    this.settings.searchInformation = valueForSearch;

    let route = "home";
    if (hash.length > 0) route = hash in routes ? hash : "error";

    this.startRenderPage(route);
  };

  View.prototype.startRenderPage = function(route) {
    // добавление названия вкладки браузера
    window.document.title = routes[route].title;

    // определение какая страница должна быть отрисована
    switch(route) {
      case "home":
        this.renderHomePage();
        break;
      case "search":
        this.renderSearchPage();
        break;
      case "movie": 
        this.renderMoviePage();
        break;
      case "profile":
        this.renderProfilePage();
        break;
      case "error":
        this.renderErrorPage();
        break;
      default: 
        break;
    };
  };

  View.prototype.renderHomePage = function() {
    // добавление блока "about"
    componentsHome.about.makePageSection(this.settings.pageContentContainerID);

    // вызов компонента блока с рекоммендациями, который строит его самостоятельно (+ запускает логику управления)
    this.settings.recommendationSliderComponent = new componentsHome.recommendations.RecommendationSection();
    this.settings.recommendationSliderComponent.start(this.settings.pageContentContainerID);
    
    // добавление блока регистрации/прехода в аккаунт взависимости зарегистрирован пользователь или нет
    if (this.settings.isUserAuthorized === false) {
      componentsHome.registration.makePageSection(this.settings.pageContentContainerID);
    } else if (this.settings.isUserAuthorized === true) {
      componentsHome.account.makePageSection(this.settings.pageContentContainerID);
    };
  };

  View.prototype.renderSearchPage = function() {
    const seacrhComponent = searchPageComponent();
    seacrhComponent(this.settings.pageContentContainerID, this.settings.searchInformation);
  };

  View.prototype.renderMoviePage = function() {
    this.settings.moviePageModule = new moviePageModule.MoviePageModule();
    this.settings.moviePageModule.start(this.settings.pageContentContainerID ,this.settings.searchInformation, this.settings.listOption);
  };

  View.prototype.renderProfilePage = function() {
    this.settings.profilePageModule = new profileComponentModule.ProfilePageModule();
    this.settings.profilePageModule.start(this.settings.pageContentContainerID, this.settings.dataForProfilePage);
    this.settings.dataForProfilePage = null;
  }

  View.prototype.removeListenersFromMoviePage = function() {
    this.settings.moviePageModule.stop();
  };

  View.prototype.changePlotViewOnMoviePage = function() {
    this.settings.moviePageModule.changePlotViewOnMoviePage();
  };

  View.prototype.removeListenersFromSlider = function() {
    this.settings.recommendationSliderComponent.stop();
    this.settings.recommendationSliderComponent = null;
  };

  View.prototype.renderErrorPage = function() {
    errorSection.makePageSection(this.settings.pageContentContainerID);
  };

  View.prototype.showSignUpModalWindow = function() {
    defaultComponents.signUp.makeSignUpModalWindow();
  };

  View.prototype.showLogInModalWindow = function() {
    defaultComponents.logIn.makeLogInModalWindow();

  };

  View.prototype.changeRegistartionToLogInModal = function() {
    defaultComponents.logIn.changeRegToLogInModal();
  };

  View.prototype.changeLogInToRegistartionModal = function() {
    defaultComponents.signUp.changeLogInToRegModal();
  };

  View.prototype.removeOverflow = function() {
    if (document.getElementById("overflow") === null) return;
    const overflow = document.getElementById("overflow");
    overflow.remove();
  };

  View.prototype.markInput = function(type, boolean) {

    const modalWindow = document.getElementById("registration") || document.getElementById("log-in");
    if (modalWindow === document.getElementById("log-in")) return;

    if (type === "email") {
      const input = document.getElementById("RW-mail");
      boolean === true ? input.style.cssText = "border: 2px solid rgb(2, 97, 2)" : input.style.cssText = "border: 2px solid brown";
    } else if (type === "password") {
      const input = document.getElementById("RW-password");
      boolean === true ? input.style.cssText = "border: 2px solid rgb(2, 97, 2)" : input.style.cssText = "border: 2px solid brown";
    };

  };

  View.prototype.makeRegistrationButtonActive = function() {
    const button = document.getElementById("signUpRegButton");
    if (button === null) return;
    button.disabled = false;
  };

  View.prototype.removeRegButtonsInHeader = function() {
    const container = document.getElementById("HRBC");
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    };
    container.innerHTML = `<button id="HAB" class="HAB" type="button">My Account</button>`;
  };

  View.prototype.changeRegBlock = function() {
    const registrationSectionOnPage = document.querySelector(".registration");
    registrationSectionOnPage.remove();
    componentsHome.account.makePageSection(this.settings.pageContentContainerID);
  };

  View.prototype.sayUserThatSomethingIsWrong = function(message) {
    const logInWindow = document.getElementById("log-in");
    const ligInWindowBody = logInWindow.querySelector(".log-in-window__body");
    const container = ligInWindowBody.firstElementChild;

    if (container.querySelector("#logInMessageParagraph")) {
      const message = container.querySelector("#logInMessageParagraph");
      message.remove();
    };

    const messageParagraph = document.createElement("p");
    messageParagraph.setAttribute("id", "logInMessageParagraph");
    messageParagraph.textContent = message;
    container.append(messageParagraph);
  };

  View.prototype.startLoaderInRegWindow = function() {
    const window = document.getElementById("log-in") || document.getElementById("registration");
    const windowContainer = window.firstChild;

    const loaderContainer = document.createElement("div");
    loaderContainer.setAttribute("id", "RWLC");
    loaderContainer.classList.add("reg-window-loader-container"); 
    windowContainer.prepend(loaderContainer);

    /*<div class="MM-loader"><div></div><div></div><div></div></div>*/
    const loader = document.createElement("div");
    loader.classList.add("MM-loader");

    for (let i = 0; i < 3; i++) {
      const loaderItem = document.createElement("div");
      loader.append(loaderItem);
    };

    loaderContainer.append(loader);
  };

  View.prototype.removeLoaderInRegWindow = function() {
    if (document.getElementById("overflow") === null) return;
    const loader = document.getElementById("RWLC");
    loader.remove();
  };

  View.prototype.redirectUserOnTrailer = function(link) {
    window.open(link);
  };

  View.prototype.changeAsWatcedButton = function() {
    this.settings.moviePageModule.changeAsWatcedButton();
  };

  View.prototype.changeWishlistButton = function() {
    this.settings.moviePageModule.changeWishlistButton();
  };

  View.prototype.removeMovieFromListOfWatchedMovies = function(imdbID) {
    this.settings.profilePageModule.deleteMovieFromListOfWatched(imdbID);
  };

  View.prototype.removeMovieFromListOfWishes = function(imdbID) {
    this.settings.profilePageModule.removeMovieFromListOfWishes(imdbID);
  };

  View.prototype.openAddCommentModalWindow = function(imdbID, title) {
    this.settings.profilePageModule.openAddCommentModalWindow(imdbID, title);
  };

  View.prototype.disableAddingCommentButton = function(imdbID) {
    this.settings.profilePageModule.disableAddingCommentButton(imdbID);
  };

  View.prototype.disableOpenCommentButton = function(imdbID) {
    this.settings.profilePageModule.disableOpenCommentButton(imdbID);
  };

  View.prototype.closeAddingCommentWindowAndChangeButton = function(imdbID) {
    this.settings.profilePageModule.closeAddingCommentWindowAndChangeButton(imdbID);
  };

  View.prototype.openCommentWindowForMovie = function(imdbID) {
    this.settings.profilePageModule.openCommentWindowForMovie(imdbID);
  };

  View.prototype.updateDataInProfilePageModule = function(data) {
    this.settings.profilePageModule.updateData(data);
  };

  View.prototype.makeUserCommentEditable = function() {
    this.settings.profilePageModule.makeUserCommentEditable();
  };

  View.prototype.changeOpenCommentButton = function(imdbID) {
    this.settings.profilePageModule.changeOpenCommentButton(imdbID);
  };

  View.prototype.makeOpenCommentButtonEnabled = function(imdbID) {
    this.settings.profilePageModule.makeOpenCommentButtonEnabled(imdbID);
  };

  View.prototype.addLoadingOverflowOnModalWindow = function() {
    this.settings.profilePageModule.addLoadingOverflowOnModalWindow();
  };

  View.prototype.closeCommentModalWindow = function() {
    this.settings.profilePageModule.closeCommentModalWindow();
  };

  View.prototype.makeLogInSound = function(audioContext, path) {
    let source = null;
    const sound = new Audio(path);
    sound.crossOrigin = "anonymous";

    source = audioContext.createMediaElementSource(sound);
    source.connect(audioContext.destination);
  
    sound.currentTime = 0;
    sound.play();
  };

  View.prototype.removeListenersFromProfilePage = function() {
    this.settings.profilePageModule.stop();
  };

  View.prototype.setAudioContext = async function(audioContext, path) {
    const sound = new Audio(path);
    sound.crossOrigin = "anonymous";

    let source = audioContext.createMediaElementSource(sound);
    source.connect(audioContext.destination);

    await sound.play();
    sound.pause();
  };
  /* ------ end view ----- */

  /* ----- controller ---- */
  function Controller() {
    this.model = null;

    this.settings = {
      header: null,
      contentContainer: null,
      footer: null,

      listeners: {
        appClickListener: null,
        appInputListener: null,
      },

      searchBoxModule: null,
    };
  };

  Controller.prototype.initialize = function(model, headerID, contentContainerID, footeID) {
    this.model = model;

    this.settings.header = document.getElementById(headerID);
    this.settings.contentContainer = document.getElementById(contentContainerID);
    this.settings.footer = document.getElementById(footeID);

    this.addListenerOnURL();
    this.getHashFromURL();
  };

  Controller.prototype.addListenersOnApp = function() {
    // запуск модуля управления поисковой строкой
    this.settings.searchBoxModule = new searchModule.SearchModule();
    this.settings.searchBoxModule.start();

    // слушатель клика на все приложение
    this.settings.listeners.appClickListener = this.checkWhatWasClicked.bind(this);
    document.addEventListener("click", this.settings.listeners.appClickListener);

    // слушатель изменения в инпутах на все приложение
    this.settings.listeners.appInputListener = this.checkInput.bind(this);
    document.addEventListener("input", this.settings.listeners.appInputListener);

    // запуск аудиоконтекста по клику
    document.addEventListener("click", () => this.model.setAudioContext(), {once: true});
  };

  Controller.prototype.addListenerOnURL = function() {
    window.addEventListener("hashchange", this.getHashFromURL.bind(this));
  };

  Controller.prototype.getHashFromURL = function() {
    const hash = location.hash.slice(1).toLowerCase();
    this.model.setHashValue(hash);
  };

  Controller.prototype.checkInput = function(event) {
    event.preventDefault();

    switch(event.target) {
      case(document.getElementById("RW-mail")):
        this.model.checkInputValue("email", document.getElementById("RW-mail").value, document.getElementById("RW-password").value);
      break;
      case(document.getElementById("RW-password")):
        this.model.checkInputValue("password", document.getElementById("RW-mail").value, document.getElementById("RW-password").value);
      break;
      default:
      break;
    }

  };

  Controller.prototype.checkWhatWasClicked = function(event) {
    event.preventDefault();
    const target = event.target;

    if (target.closest("#footer-logo") || target.closest(".header__logo-container")) {
      location.hash ="home";
      this.model.scrollToTop("fast");
    };

    if (target.classList.contains("results-of-search__item")) {
      this.model.scrollToTop("fast");
      const imdbID = target.getAttribute("data-imdbid");
      const newHash = `movie/${imdbID}`;
      location.hash = newHash;
    };

    if (target.closest(".header__profile-button")) {
      this.model.tryToOpenPfofilePage();
    };

    if (target.closest("#movie-thumbnail-container")) {
      const container = document.getElementById("movie-thumbnail-container");
      const link = container.getAttribute("data-trailer-link");
      this.model.redirectUserOnTrailer(link);
    };

    if (target.closest(".slider-item__learn-more")) {
      const button = target.closest(".slider-item__learn-more");
      const imdbID = button.getAttribute("imdbid");
      const newHash = `movie/${imdbID}`;
      location.hash = newHash;
      this.model.scrollToTop("fast");
    };

    if (target.closest(".remove-btn")) {
      const item = target.closest(".list__item");
      const imdbID = item.getAttribute("imdbid");
      this.model.removeMovieFromListOfWatchedMovies(imdbID);
    };

    if (target.closest(".wl-remove-btn")) {
      const item = target.closest(".list__item");
      const imdbID = item.getAttribute("imdbid");
      this.model.removeMovieFromListOfWishes(imdbID);
    };

    if (target.closest(".add-comment-btn")) {
      this.takeTitleAndIMDBidOfMovieAndOpenAddCommentWindow(target);
    };

    if (target.closest(".open-comment-btn")) {
      this.openCommentWindowForMovie(target);
    };

    switch (target) {
      case(document.getElementById("footer-top-button")):
        this.model.scrollToTop("smooth");
        break;
      case(document.getElementById("to-the-main-page-btn")):
        location.hash ="home";
        break;
      case(document.getElementById("HRBC-sign-up")):
      case(document.getElementById("registration-sign-up")):
        this.model.showSignUpModalWindow();
        break;
      case(document.getElementById("HRBC-log-in")):
      case(document.getElementById("registration-log-in")):
        this.model.showLogInModalWindow();
        break;
      case(document.getElementById("alreadyRegButton")):
        this.model.changeRegistartionToLogInModal();
        break;
      case(document.getElementById("notRegButton")):
        this.model.changeLogInToRegistartionModal();
        break;
      case(document.getElementById("cancelRegButton")):
        this.model.removeOverflow();
      break;
      case(document.getElementById("signUpRegButton")):
       this.takeDataFromInputs("sign-up");
       break;
      case(document.getElementById("logInRegButton")):
       this.takeDataFromInputs("log-in");
      break;
      case(document.getElementById("overflow")):
      case(document.getElementById("comment-window-close-btn")):
        this.model.removeOverflow();
        break;
      case(document.getElementById("m-plot-read-button")):
        this.model.changePlotViewOnMoviePage();
        break;
      case(document.getElementById("m-mark-as-watched")):
        this.takeTitleOfMovieAndMarkAsWatched();
        break;
      case(document.getElementById("m-add-to-wish-list")):
          this.takeTitleOfMovieAndAddToWishlist();
        break;
      case(document.getElementById("HAB")):
      case(document.getElementById("account-my-account")):
      case(document.getElementById("account-game")):
        this.model.scrollToTop("fast");
        location.hash ="profile";
        break;
      case(document.getElementById("comment-window-save-btn")):
        this.takeCommentValueAndSaveToFirestore(target);
        break;
      case(document.getElementById("comment-window-edit-btn")):
        this.model.makeUserCommentEditable()
        break;
      case(document.getElementById("comment-window-save-edit-btn")):
        this.getDataFromUsersCommentWindowAndUpdateDataInFirestore(target);
      default:
        break;
    };
  };

  Controller.prototype.takeDataFromInputs = function(operation) {
    const email = document.getElementById("RW-mail").value;
    const password = document.getElementById("RW-password").value;

    if (operation === "sign-up") {
      this.model.startLoaderInRegWindow();
      this.model.registerUser(email, password);
      return;
    }

    if (operation === "log-in") {
      this.model.startLoaderInRegWindow();
      this.model.logInUser(email, password);
      return;
    };

  };

  Controller.prototype.takeTitleOfMovieAndMarkAsWatched = function() {
    const movieTitle = document.getElementById("title-of-movie").textContent;
    this.model.markMovieAsWatched(movieTitle);
  };

  Controller.prototype.takeTitleOfMovieAndAddToWishlist = function() {
    const movieTitle = document.getElementById("title-of-movie").textContent;
    this.model.addMovieToWishList(movieTitle);
  };

  Controller.prototype.takeTitleAndIMDBidOfMovieAndOpenAddCommentWindow = function(target) {
    const item = target.closest(".list__item");
    const imdbID = item.getAttribute("imdbid");
    const title = item.firstElementChild.textContent;
    this.model.openAddCommentModalWindow(imdbID, title);
  };

  Controller.prototype.takeCommentValueAndSaveToFirestore = function(target) {
    const modalWindow = target.closest(".comment__body");
    const titleOfTheMovie = target.getAttribute("data-title");
    const commentValue = modalWindow.querySelector("#comment-area").value.trim();
    const imdbID = target.getAttribute("imdbid");
    
    if (commentValue.length === 0) return;
    this.model.saveCommentToFirestore(imdbID, titleOfTheMovie, commentValue);
  };

  Controller.prototype.openCommentWindowForMovie = function(target) {
    const item = target.closest(".list__item");
    const imdbID = item.getAttribute("imdbid");
    this.model.openCommentWindowForMovie(imdbID);
  };

  Controller.prototype.getDataFromUsersCommentWindowAndUpdateDataInFirestore = function(target) {
    const imdbID = target.getAttribute("imdbid");
    const window = target.closest(".comment__body");
    const newCommentValue = window.querySelector("#edited-comment-area").value.trim();
    
    if (newCommentValue.length === 0) {
      this.model.deleteUserCommentForMovie(imdbID);
    } else {
      this.model.updateCommentsDataInFirestore(imdbID, newCommentValue);
    };
  };
  /* --- end controller ---*/

  return {
    initialize: function() {
      // добавление на страницу дефолтных компонентов
      this.makeDefaultComponents();

      // создание MVC
      const model = new Model();
      const view = new View();
      const controller = new Controller(); 

      // инициализация MVC
      model.initialize(view);
      view.initialize("page-content-container");
      controller.initialize(model, "header", "page-content-container", "footer");

      // добавление слушателей для дефолтных компонентов
      controller.addListenersOnApp();
    },
    makeDefaultComponents: function() {
      const body = document.querySelector("body");
      const wrapper = document.createElement("div");
      wrapper.classList.add("wrapper");
      wrapper.setAttribute("id", "wrapper");
      body.prepend(wrapper);

      wrapper.innerHTML += componentsDefault.header.getHTML();
      wrapper.innerHTML += componentsDefault.pageContentContainer.getHTML();
      wrapper.innerHTML += componentsDefault.footer.getHTML();
    },
  };

}());

document.addEventListener("DOMContentLoaded", () => {
  movieMateSPA.initialize();
});
