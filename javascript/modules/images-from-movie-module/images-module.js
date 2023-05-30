/*
  Модуль для галереи картинок из фильма
*/

export const imagesModule = (function() {

  /* -------- model -------- */
  function Model() {
    this.view = null;
    this.settings = { 
      numberOfImage: null,
      numberOfImages: null,
      linksOnImages: null,
    };
  };

  Model.prototype.initialize = function(view) {
    this.view = view;
  };

  Model.prototype.setNumberOfImagesInContainer = function(number) {
    this.settings.numberOfImages = number;
  };

  Model.prototype.setLinksOnImages = function(linksArray) {
    this.settings.linksOnImages = linksArray;
  };

  Model.prototype.openImage = function(numberOfImage) {
    this.settings.numberOfImage = Number(numberOfImage);
    const linlForImage = this.settings.linksOnImages[numberOfImage];
    this.view.openImage(linlForImage);
  };

  Model.prototype.closeImage = function() {
    this.settings.numberOfImage = null;
    this.view.closeImage();
  };

  Model.prototype.showAnotherImage = function(direction) {
    
    direction === "next" ? this.settings.numberOfImage += +1 : this.settings.numberOfImage -= 1;
    
    if (this.settings.numberOfImage < 0) {
      this.settings.numberOfImage = this.settings.numberOfImages - 1;
    } else if (this.settings.numberOfImage >= this.settings.numberOfImages) {
      this.settings.numberOfImage = 0;
    };

    this.view.showAnotherImage(this.settings.linksOnImages[this.settings.numberOfImage]);
  };
  /* ------ end model ------ */ 


  /* --------- view -------- */ 
  function View() {
    this.settings = {
      image: null,
    };
  };

  View.prototype.openImage = function(link) {
    const leftButtonSVG = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M14.1666 21.3333L23.6666 30.6666C24.3333 31.3333 25.3333 31.3333 26 30.6666C26.6666 30 26.6666 29 26 28.3333L17.8333 20L26 11.6666C26.6666 11 26.6666 9.99998 26 9.33331C25.6666 8.99998 25.3333 8.83331 24.8333 8.83331C24.3333 8.83331 24 8.99998 23.6666 9.33331L14.1666 18.6666C13.5 19.5 13.5 20.5 14.1666 21.3333C14.1666 21.1666 14.1666 21.1666 14.1666 21.3333Z"/></svg>`;
    const rightButtonSVG = `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M25.8333 18.6666L16.3333 9.33329C15.6667 8.66663 14.6667 8.66663 14 9.33329C13.3333 9.99996 13.3333 11 14 11.6666L22.1667 20L14 28.3333C13.3333 29 13.3333 30 14 30.6666C14.3333 31 14.6667 31.1666 15.1667 31.1666C15.6667 31.1666 16 31 16.3333 30.6666L25.8333 21.3333C26.5 20.5 26.5 19.5 25.8333 18.6666C25.8333 18.8333 25.8333 18.8333 25.8333 18.6666Z"/></svg>`;

    const overflow = document.createElement("div");
    overflow.setAttribute("id", "image-overflow");
    overflow.classList.add("image-overflow");
    document.body.prepend(overflow);

    const wrapper = document.createElement("div");
    wrapper.classList.add("image-wrapper");
    overflow.append(wrapper);

    const leftButton = document.createElement("button");
    leftButton.setAttribute("id", "IBB");
    leftButton.classList.add("image-wrapper__button-back");
    leftButton.setAttribute("type", "button");
    leftButton.innerHTML = leftButtonSVG;
    wrapper.append(leftButton);

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
    wrapper.append(imageContainer);

    const image = document.createElement("img");
    image.setAttribute("src", link);
    image.setAttribute("alt", "Photo from the movie");
    imageContainer.append(image);

    const rightButton = document.createElement("button");
    rightButton.setAttribute("id", "IBN");
    rightButton.classList.add("image-wrapper__button-back");
    rightButton.setAttribute("type", "button");
    rightButton.innerHTML = rightButtonSVG;
    wrapper.append(rightButton);

    this.settings.image = image;
  };

  View.prototype.closeImage = function() {
    const overflow = document.getElementById("image-overflow");
    overflow.remove();
  };

  View.prototype.showAnotherImage = function(link) {
    this.settings.image.setAttribute("src", link);
  };
  /* ------- end view ------ */


  /* ------ controller ----- */ 
  function Controller() {
    this.model = null;

    this.settings = {
      imagesContainer: null,
      documenListener: null,
    };
  };

  Controller.prototype.initialize = function(model) {
    this.model = model;
  };

  Controller.prototype.setContainer = function(container) {
    this.settings.imagesContainer = container;
  };

  Controller.prototype.countImages = function() {
    const imagesCollection = this.settings.imagesContainer.querySelectorAll(".movie-photo-item");
    this.model.setNumberOfImagesInContainer(imagesCollection.length);
    
    const linksArray = [];
    imagesCollection.forEach(element => {
      const link = element.firstChild.getAttribute("src")
      linksArray.push(link);
    });
    this.model.setLinksOnImages(linksArray);
  };

  Controller.prototype.addEventListener = function() {
    this.settings.documenListener = this.checkWhatWasClicked.bind(this);
    document.addEventListener("click", this.settings.documenListener);
  };

  Controller.prototype.removeEventListener = function() {
    document.removeEventListener("click", this.settings.documenListener);
  };

  Controller.prototype.checkWhatWasClicked = function(event) {
    event.preventDefault();

    if (event.target.closest(".movie-photo-item")) {
      const item = event.target.closest(".movie-photo-item");
      const numberOfImage = item.getAttribute("data-number");
      this.model.openImage(numberOfImage);
    };

    if (event.target.closest("#IBB")) {
      this.showAnotherImage("prev");
    };

    if (event.target.closest("#IBN")) {
      this.showAnotherImage("next");
    };

    if (event.target === document.getElementById("image-overflow")) {
      this.closeImage();
    };
  };

  Controller.prototype.closeImage = function() {
    this.model.closeImage();
  };

  Controller.prototype.showAnotherImage = function(direction) {
    this.model.showAnotherImage(direction);
  };
  /* --- end controller ---- */ 


  /* --- RecommendationSection --- */
  function ImagesModule() {
    this.model = new Model();
    this.view = new View();
    this.controller = new Controller();

    this.model.initialize(this.view);
    this.controller.initialize(this.model);
  };

  ImagesModule.prototype.start = function(container) {
    this.controller.setContainer(container);
    this.controller.countImages();
    this.controller.addEventListener();
  };

  ImagesModule.prototype.stop = function() {
    this.controller.removeEventListener();
  };
  /* - end RecommendationSection - */

  return {
    ImagesModule,
    start: ImagesModule.prototype.start,
    stop: ImagesModule.prototype.stop,
  };
  
}());