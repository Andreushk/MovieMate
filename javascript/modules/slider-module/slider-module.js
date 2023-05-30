/*
  Модуль слайдеров
*/

/* 
  Для слайдера с рекоммендациями мобильный режим начинается с 750px.
*/


export const recommendationsSliderControlls = (function() {

  /* -------- model -------- */
  function Model() {
    this.view = null;

    this.settings = {
      SLIDERITEMMARGIN: 10,
      numberOfItems: null,
      bodyWidth: null,
      itemWidth: null,
      lineWidth: null,
      displacement: 0,
      maxDisplacement: null,
      sliderMovesCounter: 0,
      maxCounterValue: null,
    };
  };

  Model.prototype.initialize = function(view) {
    this.view = view;
  };

  Model.prototype.setInfoAboutWidth = function(sliderBodyWidth, sliderItemWidth, numberOfItems) {
    this.settings.bodyWidth = sliderBodyWidth;
    this.settings.itemWidth = sliderItemWidth + this.settings.SLIDERITEMMARGIN;
    this.settings.numberOfItems = numberOfItems;
    this.settings.lineWidth = (this.settings.itemWidth * this.settings.numberOfItems) - this.settings.SLIDERITEMMARGIN;
    this.calcParametrsOfSliderDisplacement();
  };

  Model.prototype.calcParametrsOfSliderDisplacement = function() {
    const howMuchFitsInTheSlider = this.settings.bodyWidth / this.settings.itemWidth;
    this.settings.maxDisplacement = this.settings.lineWidth - this.settings.itemWidth * howMuchFitsInTheSlider;

    let displacementForCalculating = 0;
    let sliderMovesCounterForCalculating = 0;

    do {
      this.settings.maxCounterValue += 1;
      sliderMovesCounterForCalculating += 1;
      displacementForCalculating = (this.settings.itemWidth * sliderMovesCounterForCalculating) * 2;
    } while (displacementForCalculating < this.settings.maxDisplacement);
  };

  Model.prototype.moveSliderRight = function() {

    if (this.settings.displacement === this.settings.maxDisplacement) {
      this.settings.displacement = 0;
      this.settings.sliderMovesCounter = 0;
      this.view.moveSlider(this.settings.displacement);
      return;
    }

    this.settings.sliderMovesCounter += 1;
    this.settings.displacement = (this.settings.itemWidth * this.settings.sliderMovesCounter) * 2;

    if (this.settings.displacement > this.settings.maxDisplacement) {
      this.settings.displacement = this.settings.maxDisplacement;
      this.view.moveSlider(this.settings.displacement);
      return;
    };

    this.view.moveSlider(this.settings.displacement);
  };

  Model.prototype.moveSliderLeft = function() {
    
    this.settings.sliderMovesCounter -= 1;
    this.settings.displacement = (this.settings.itemWidth * this.settings.sliderMovesCounter) * 2;

    if (this.settings.displacement < 0) {
      this.settings.displacement = this.settings.maxDisplacement;
      this.view.moveSlider(this.settings.displacement);
      this.settings.sliderMovesCounter = 0;
      this.settings.sliderMovesCounter = this.settings.maxCounterValue;
      return;
    }

    this.view.moveSlider(this.settings.displacement);
  };

  Model.prototype.debounceResetSlider = function() {
    clearTimeout(this.settings.timerIDForDebounce);
    this.settings.timerIDForDebounce = setTimeout(this.resetSlider.bind(this), 250);
  };
  
  Model.prototype.resetSlider = function() {
    this.settings.displacement = 0;
    this.settings.sliderMovesCounter = 0;
    this.settings.maxCounterValue = 0;
    this.view.moveSlider(0);
  };

  Model.prototype.resetSettings = function() {
    this.settings.SLIDERITEMMARGIN = 10;
    this.settings.numberOfItems = null;
    this.settings.bodyWidth = null;
    this.settings.itemWidth = null;
    this.settings.lineWidth = null;
    this.settings.displacement = 0;
    this.settings.maxDisplacement = null;
    this.settings.sliderMovesCounter = 0;
    this.settings.maxCounterValue = null;
  };
  /* ------ end model ------ */


  /* --------- view -------- */
  function View() {
    this.line = null;
  };

  View.prototype.setSliderLine = function(container) {
    this.line = container.querySelector(".slider-line");
  };

  View.prototype.moveSlider = function(displacement) {
    this.line.style.transform = 'translate(-' + displacement + "px)";
  };
  /* ------- end view ------ */



  /* ------ controller ----- */
  function Controller() {
    this.model = null;

    this.settings = {
      body: null,
      line: null,
      slidesNumber: null,
      leftButton: null,
      rightButton: null,
    };
  };

  Controller.prototype.initialize = function(model) {
    this.model = model;
  };

  Controller.prototype.setHTMLElements = function(container) {
    this.settings.body = container.querySelector(".slider-body");
    this.settings.line = container.querySelector(".slider-line");
    this.settings.leftButton = container.querySelector(".slider-left");
    this.settings.rightButton = container.querySelector(".slider-right");
    this.settings.slidesNumber = Number(this.settings.line.querySelectorAll(".slider-item").length);
  };

  Controller.prototype.getInfoAboutWidth = function() {
    const sliderBodyWidth = this.settings.body.offsetWidth;
    const sliderItemWidth = this.settings.line.querySelector(".slider-item").offsetWidth; 
    this.model.setInfoAboutWidth(sliderBodyWidth, sliderItemWidth, this.settings.slidesNumber);
  };

  Controller.prototype.addEventListeners = function() {
    this.settings.windowListener = this.resetSlider.bind(this);
    window.addEventListener("resize", this.settings.windowListener);

    this.settings.rightButtonListener = this.moveSliderRight.bind(this);
    this.settings.rightButton.addEventListener("click", this.settings.rightButtonListener);

    this.settings.leftButtonListener = this.moveSliderLeft.bind(this);
    this.settings.leftButton.addEventListener("click", this.settings.leftButtonListener);
  };

  Controller.prototype.moveSliderRight = function(event) {
    event.preventDefault();
    this.model.moveSliderRight();
  };

  Controller.prototype.moveSliderLeft = function(event) {
    event.preventDefault();
    this.model.moveSliderLeft();
  };

  Controller.prototype.resetSlider = function() {
    clearTimeout(this.settings.timerIDForDebounce);
    this.settings.timerIDForDebounce = setTimeout(() => {
      this.model.resetSlider();
      this.getInfoAboutWidth();
    }, 250);
  };

  Controller.prototype.removeEventListeners = function() {
    window.removeEventListener("resize", this.settings.windowListener);
    this.settings.rightButton.removeEventListener("click", this.settings.rightButtonListener);
    this.settings.leftButton.removeEventListener("click", this.settings.leftButtonListener);
  };
  /* --- end controller ---- */


  /* --- SliderController --- */
  function SliderController() {
    this.model = new Model();
    this.view = new View();
    this.controller = new Controller();

    this.model.initialize(this.view);
    this.controller.initialize(this.model);
  };

  SliderController.prototype.start = function(container) {
    this.controller.setHTMLElements(container);
    this.view.setSliderLine(container);
    this.controller.getInfoAboutWidth();
    this.controller.addEventListeners();
  };

  SliderController.prototype.stop = function() {
    this.controller.removeEventListeners();
  };
  /* - end SliderController - */

  return {
    SliderController,
    start: SliderController.prototype.start,
    stop: SliderController.prototype.stop,
  };

}());