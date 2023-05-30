/*
  Чтобы включить запасные варианты запрсов - надо перейти в код (Model.prototype.requestDataForGame) 
  и закомментировать fetch-запросы, расскаоментировать константы, которые ссылаются на эти объекты
*/

// Запасной вариант топ-250 сериалов 
import { top250TVs } from "../../responses/top250imdb/top250TVs.js";
// Запасной вариант топ-250 фильмов
import { top250Movies } from "../../responses/top250imdb/top250Movies.js";



export const gameControllsModule = (function() {
  
  /* -------- model -------- */
  function Model() {
    this.view = null;
    this.settings = {
      IMDBAPIKEY_1: "k_90mg46g4",
      IMDBAPIKEY_2: "k_zv8c981k",
      whichKeyIsUsing: 1,
      timerIDForAbort: null,
      rules: "The game features movies and series from the top 50 imdb. We'll show you a picture and you have to choose which movie it is.",
    };
    this.gameInfo = {
      audioContext: null,
      rightAnswerPath: "../sounds/right-answer.mp3",
      wrongAnswerPath: "../sounds/wrong-answer.mp3",
      top100MoviesAndTVs: null,
      currectIMDBID: null,
      round: 0,
      timer: null,
    };
  };

  Model.prototype.initialize = function(view) {
    this.view = view;
  };

  Model.prototype.setAudioContext = function() {
    const contextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);
    this.gameInfo.audioContext = new contextClass();

    if (this.gameInfo.audioContext.state === "suspended") {
      this.gameInfo.audioContext.resume();
    };

    this.view.setAudioContext(this.gameInfo.audioContext, this.gameInfo.rightAnswerPath);
  };

  Model.prototype.showRulesOfGame = function() {
    this.view.showRulesOfGame(this.settings.rules);
  };

  Model.prototype.requestDataForGame = async function() {

    let key = null;

    // Два ключа вместо одного - всё ради знаний и науки :)
    if (this.settings.whichKeyIsUsing === 1) {
      key = this.settings.IMDBAPIKEY_1;
    } else if (this.settings.whichKeyIsUsing === 2) {
      key = this.settings.IMDBAPIKEY_2;
    };

    try {

      this.view.startLoaderInGameSection();

      const controller = new AbortController();
      const signal = controller.signal;

      this.settings.timerIDForAbort = setTimeout(() => {
        controller.abort();
      }, 10000);

      const responseForMovies = await fetch(`https://imdb-api.com/en/API/Top250Movies/${key}`, {signal});
      const dataForMovies = await responseForMovies.json();

      clearTimeout(this.settings.timerIDForAbort);
      this.settings.timerIDForAbort = setTimeout(() => {
        controller.abort();
      }, 10000);
      
      const responseForTVs = await fetch(`https://imdb-api.com/en/API/Top250TVs/${key}`, {signal});
      const dataForTVs = await responseForTVs.json();

      clearTimeout(this.settings.timerIDForAbort);

      //const dataForMovies = top250Movies;
      //const dataForTVs = top250TVs;

      if (dataForMovies.errorMessage) {
        const limitError = new Error();
        limitError.name = "Limit";
        limitError.message = "Unfortunately, our application has a limit for using the IMDB API and you have reached the limit of requests per day :("
        throw limitError;
      };

      if (dataForTVs.errorMessage) {
        const limitError = new Error();
        limitError.name = "Limit";
        limitError.message = "Unfortunately, our application has a limit for using the IMDB API and you have reached the limit of requests per day :("
        throw limitError;
      };

      const arraysWithDataForMovies = dataForMovies.items;
      const arraysWithDataForTVs = dataForTVs.items;

      const top50Movies = arraysWithDataForMovies.slice(0, 50);
      const top50TVs = arraysWithDataForTVs.slice(0, 50);
      this.gameInfo.top100MoviesAndTVs = top50Movies.concat(top50TVs);

      this.makeGameRound();

    } catch(error) {
      if (error.name === "AbortError") {
        const message = "The request was canceled because the waiting time was up. This may be because the server is overloaded.";
        console.warn(message);
        this.view.stopLoaderInGameSection();
        this.view.makeErrorMessageForUser(message);
      } else if (error.name === "Limit") {
        switch(this.settings.whichKeyIsUsing) {
          case(1):
            this.settings.whichKeyIsUsing = 2;
            this.requestDataForGame();
            break;
          case(2):
            const errorMessage = error.message;
            this.view.stopLoaderInGameSection();
            this.view.makeErrorMessageForUser(errorMessage);
            break;
          default: 
            break;
        };
      } else {
        console.warn(error);
        const errorMessage = "Something went wrong, but you can always try again!";
        this.view.stopLoaderInGameSection();
        this.view.makeErrorMessageForUser(errorMessage);
      };
    };

  };

  Model.prototype.makeGameRound = async function() {
    const objectWithNumbersForRound = this.getRandomNumbers();

    const currectAnswer = {
      id: this.gameInfo.top100MoviesAndTVs[objectWithNumbersForRound.specialNumber].id,
      title: this.gameInfo.top100MoviesAndTVs[objectWithNumbersForRound.specialNumber].title,
    };
    this.gameInfo.currectIMDBID = currectAnswer.id;

    const arrayWithWrongAnswers = [];
    for (let i = 0; i < objectWithNumbersForRound.numbers.length; i++) {
      const number = objectWithNumbersForRound.numbers[i];

      if (number === objectWithNumbersForRound.specialNumber) continue;

      const wrongAnswer = {
        id: this.gameInfo.top100MoviesAndTVs[number].id,
        title: this.gameInfo.top100MoviesAndTVs[number].title,
      };
      arrayWithWrongAnswers.push(wrongAnswer);
    };

    let key = null;
    if (this.settings.whichKeyIsUsing === 1) {
      key = this.settings.IMDBAPIKEY_1;
    } else if (this.settings.whichKeyIsUsing === 2) {
      key = this.settings.IMDBAPIKEY_2;
    };

    try {

      const controller = new AbortController();
      const signal = controller.signal;

      this.settings.timerIDForAbort = setTimeout(() => {
        controller.abort();
      }, 10000);

      const responseWithImages = await fetch(`https://imdb-api.com/en/API/Images/${key}/${currectAnswer.id}/Short`, {signal});
      const data = await responseWithImages.json();

      if (data.errorMessage) {
        const limitError = new Error();
        limitError.name = "Limit";
        limitError.message = "Unfortunately, our application has a limit for using the IMDB API and you have reached the limit of requests per day :("
        throw limitError;
      };
 
      const numberOfImages = data.items.length;
      const numberOfImage = Math.floor(Math.random() * numberOfImages);
      const imageURL = data.items[numberOfImage].image;

      this.view.stopLoaderInGameSection();
      console.log(imageURL, currectAnswer, arrayWithWrongAnswers);
      this.view.renderRound(imageURL, currectAnswer, arrayWithWrongAnswers);

    } catch(error) {
      if (error.name === "AbortError") {
        const message = "The request was canceled because the waiting time was up. This may be because the server is overloaded.";
        console.warn(message);
        this.view.stopLoaderInGameSection();
        this.view.makeErrorMessageForUser(message);
      } else if (error.name === "Limit") {
        switch(this.settings.whichKeyIsUsing) {
          case(1):
            this.settings.whichKeyIsUsing = 2;
            this.requestDataForGame();
            break;
          case(2):
            const errorMessage = error.message;
            this.view.stopLoaderInGameSection();
            this.view.makeErrorMessageForUser(errorMessage);
            break;
          default: 
            break;
        };
      } else {
        console.warn(error);
        const errorMessage = "Something went wrong, but you can always try again!";
        this.view.stopLoaderInGameSection();
        this.view.makeErrorMessageForUser(errorMessage);
      };
    };

  };

  Model.prototype.getRandomNumbers = function() {
    const numbers = [];
    for (let i = 0; i < 4; i++) {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      numbers.push(randomNumber);
    }
  
    const specialNumber = numbers[Math.floor(Math.random() * numbers.length)];
    return {numbers: numbers, specialNumber: specialNumber};
  };

  Model.prototype.checkUserAnswer = function(imdbID, indexOfButton) {

    if (imdbID === this.gameInfo.currectIMDBID) {
      this.gameInfo.round += 1;
      this.view.markUsersCurrectButton(indexOfButton);
      this.view.makeAnswerSound(this.gameInfo.audioContext, this.gameInfo.rightAnswerPath);
      this.view.disableButtons();
      this.gameInfo.timer = setTimeout(() => {
        clearTimeout(this.gameInfo.timer);
        this.makeGameRound();
      }, 2500);
    } else {
      this.view.disableButtons();
      this.view.makeAnswerSound(this.gameInfo.audioContext, this.gameInfo.wrongAnswerPath);
      this.view.markCurrectButtonForUser(this.gameInfo.currectIMDBID, indexOfButton);
      this.gameInfo.currectIMDBID = null;
      this.gameInfo.top100MoviesAndTVs = null;
      this.gameInfo.timer = setTimeout(() => {
        clearTimeout(this.gameInfo.timer);
        this.view.showUserEndScreen(this.gameInfo.round);
        this.gameInfo.round = 0;
      }, 2500);
    };

  };
  /* ------ end model ------ */ 


  /* --------- view -------- */ 
  function View() {
    this.gameContainer = null;
  };

  View.prototype.setGameContainer = function() {
    this.gameContainer = document.querySelector(".game__body");
  };

  View.prototype.setAudioContext = async function(audioContext, path) {
    console.log(audioContext, path);
    const sound = new Audio(path);
    sound.crossOrigin = "anonymous";

    let source = audioContext.createMediaElementSource(sound);
    source.connect(audioContext.destination);

    await sound.play();
    sound.pause();
  };

  View.prototype.showRulesOfGame = function(rules) {
    this.gameContainer.innerHTML = "";

    const rulesContainer = document.createElement("div");
    rulesContainer.classList.add("game__rules");
    this.gameContainer.append(rulesContainer);

    const title = document.createElement("h1");
    title.textContent = "Rules";
    rulesContainer.append(title);

    const rulesParagraph = document.createElement("p");
    rulesParagraph.textContent = rules;
    rulesContainer.append(rulesParagraph);

    const startButton = document.createElement("button");
    startButton.setAttribute("id", "GW-go");
    startButton.setAttribute("type", "button");
    startButton.textContent = "GO!"
    rulesContainer.append(startButton);
  };

  View.prototype.startLoaderInGameSection = function() {
    this.gameContainer.innerHTML = "";

    const loader = document.createElement("div");
    loader.classList.add("MM-loader");
    this.gameContainer.append(loader);

    for (let i = 0; i < 4; i++) {
      const loaderItem = document.createElement("div"); 
      loader.append(loaderItem);
    };
  };

  View.prototype.stopLoaderInGameSection = function() {
    const loader = this.gameContainer.querySelector(".MM-loader");
    if (loader) loader.remove();
  };

  View.prototype.renderRound = function(imageURL, currectAnswer, arrayWithWrongAnswers) {
    this.gameContainer.innerHTML = "";

    const gameContainer = document.createElement("div");
    gameContainer.classList.add("game__game");
    this.gameContainer.append(gameContainer);

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("game__image-container");
    gameContainer.append(imageContainer);

    const image = document.createElement("img");
    image.setAttribute("src", imageURL);
    image.setAttribute("alt", "There was supposed to be a picture");
    imageContainer.append(image);

    const answersContainer = document.createElement("div");
    answersContainer.classList.add("game__answers-container");
    gameContainer.append(answersContainer);
    
    const rightAnswerButton = document.createElement("button");
    rightAnswerButton.classList.add("game-button-answer");
    rightAnswerButton.setAttribute("type", "button");
    rightAnswerButton.setAttribute("imdbid", currectAnswer.id);
    rightAnswerButton.textContent = currectAnswer.title;

    const buttonsArray = [rightAnswerButton,];
    for (let i = 0; i < arrayWithWrongAnswers.length; i++) {
      const button = document.createElement("button");
      button.classList.add("game-button-answer");
      button.setAttribute("type", "button");
      button.setAttribute("imdbid", arrayWithWrongAnswers[i].id);
      button.textContent = arrayWithWrongAnswers[i].title;
      buttonsArray.push(button);
    };

    const shuffledButtonsArray = this.shuffleButtons(buttonsArray);

    shuffledButtonsArray.forEach(element => {
      answersContainer.append(element);
    });
  };

  View.prototype.shuffleButtons = function(arrayWithButtons) {
    for (var i = arrayWithButtons.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arrayWithButtons[i];
      arrayWithButtons[i] = arrayWithButtons[j];
      arrayWithButtons[j] = temp;
    }
    return arrayWithButtons;
  };

  View.prototype.markUsersCurrectButton = function(index) {
    const button = this.gameContainer.querySelectorAll(".game-button-answer")[index];
    button.classList.add("GA-good-anser");    
  };

  View.prototype.markCurrectButtonForUser = function(imdbID, indexOfButton) {
    const buttonsCollection = this.gameContainer.querySelectorAll(".game-button-answer");
    for (let i = 0; i < buttonsCollection.length; i++) {
      const button = buttonsCollection[i];
      const buttonIMDBid = button.getAttribute("imdbid");
      if (imdbID === buttonIMDBid) {
        button.classList.add("GA-good-anser");
      };
      if (i === indexOfButton) {
        button.classList.add("GA-wrong-anser");
      };
    };
  };

  View.prototype.disableButtons = function() {
    const buttonsCollection = this.gameContainer.querySelectorAll(".game-button-answer");
    buttonsCollection.forEach(element => {
      element.disabled = true;
    });
  };

  View.prototype.showUserEndScreen = function(numberOfRounds) {
    this.gameContainer.innerHTML = "";
    console.log(numberOfRounds);

    const resultsContainer = document.createElement("div");
    resultsContainer.classList.add("game__results-container");
    this.gameContainer.append(resultsContainer);

    const message = document.createElement("h1");
    message.textContent = "That was a great try! =)";
    resultsContainer.append(message);

    const text = document.createElement("p");
    text.innerHTML = `You scored <span>${numberOfRounds}</span> point (оne correct answer = 1 point)`;
    resultsContainer.append(text);

    const button = document.createElement("button");
    button.setAttribute("id", "game-results-btn");
    button.setAttribute("type", "button");
    button.textContent = "OK";
    resultsContainer.append(button);
  };

  View.prototype.makeAnswerSound = function(audioContext, path) {
    console.log(audioContext, path);
    const sound = new Audio();
    sound.src = path;
    sound.crossOrigin = "anonymous";

    let source = audioContext.createMediaElementSource(sound);
    source.connect(audioContext.destination);
    sound.play();
  };

  View.prototype.makeErrorMessageForUser = function(message) {
    this.gameContainer.innerHTML = "";

    const errorMessageContainer = document.createElement("div");
    errorMessageContainer.classList.add("game__rules");
    this.gameContainer.append(errorMessageContainer);

    const title = document.createElement("h1");
    title.textContent = "Error";
    errorMessageContainer.append(title);

    const errorParagraph = document.createElement("p");
    errorParagraph.textContent = message;
    errorMessageContainer.append(errorParagraph);
  };
  /* ------- end view ------ */


  /* ------ controller ----- */ 
  function Controller() {
    this.model = null;
    this.gameSection = null;
    this.clickListener = null;
  };

  Controller.prototype.initialize = function(model) {
    this.model = model;
  };

  Controller.prototype.addClickListener = function() {
    this.gameSection = document.querySelector(".game");
    
    this.clickListener = this.checkWhatWasClicked.bind(this);
    this.gameSection.addEventListener("click", this.clickListener);

    // запуск аудиоконтекста по клику
    this.gameSection.addEventListener("click", () => this.model.setAudioContext(), {once: true});
  };

  Controller.prototype.checkWhatWasClicked = function(event) {
    event.preventDefault();

    if (event.target.closest(".game-button-answer")) {
      this.takeIMDBIDFromAnswer(event.target);
      return;    
    };
    
    switch(event.target) {
      case(document.getElementById("GW-lets-try")):
      case(document.getElementById("game-results-btn")):
        this.model.showRulesOfGame();
        break;
      case(document.getElementById("GW-go")):
        this.model.requestDataForGame();
        break;
      default:
        break;
    };
  };

  Controller.prototype.takeIMDBIDFromAnswer = function(target) {
    const imdbID = target.getAttribute("imdbid");

    const allAnswersButtonsCollection = this.gameSection.querySelectorAll(".game-button-answer");
    let indexOfButton = null;
    
    for (let i = 0; i < allAnswersButtonsCollection.length; i++) {
      const button = allAnswersButtonsCollection[i];
      const buttonIMDBid = button.getAttribute("imdbid");
      if (imdbID === buttonIMDBid) indexOfButton = i;
    };

    this.model.checkUserAnswer(imdbID, indexOfButton);
  };

  Controller.prototype.removeClickListener = function() {
    this.gameSection.removeEventListener("click", this.clickListener);
  };
  /* --- end controller ---- */ 


  /* --- ProfilePageModule --- */
  function GameModule() {
    this.model = new Model();
    this.view = new View();
    this.controller = new Controller();

    this.model.initialize(this.view);
    this.controller.initialize(this.model);
  };

  GameModule.prototype.start = function() {
    this.view.setGameContainer();
    this.controller.addClickListener();
  };

  GameModule.prototype.stop = function() {
    this.controller.removeClickListener();
  };
  /* - end ProfilePageModule - */

  return {
    GameModule,
    start: GameModule.prototype.start,
    stop: GameModule.prototype.stop,
  };
  
}());