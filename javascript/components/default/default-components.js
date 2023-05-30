const header = {
  getHTML: function () {
    return `
    <!-- Header -->
    <header class="header" id="header">
        <div class="header__logo-container">
            <img src="images/MovieMate-logo.svg" alt="our logo">
        </div>
        <!-- For Desctop -->
        <div id="header__search-container" class="header__search-container">
            <input id="search-box" class="header__search" type="text" placeholder="Search for a movie...">
            <button id="search-button" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="magnifier"><path d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z"></path></svg>
            </button>
        </div>
        <div id="HRBC" class="header__reg-buttons-container">
            <button  id="HRBC-sign-up" class="HRBC-sign-up" type="button">Sign Up</button>
            <button  id="HRBC-log-in" class="HRBC-log-in" type="button">Log In</button>
        </div>
        <!-- For Mobile -->
        <div id="header-mobile-seach-container" class="header-mobile-seach-container">
            <input id="mobile-search-box" class="header-mobile-search-box" type="text" placeholder="Search for a movie...">
            <button id="mobile-search-close" class="header-mobile-search-close" type="button">
                <svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.935 18.5613C17.6537 18.8425 17.2722 19.0006 16.8744 19.0006C16.4766 19.0006 16.095 18.8425 15.8137 18.5613L12.5 14.7738L9.18624 18.56C9.04737 18.7012 8.88192 18.8134 8.69945 18.8903C8.51698 18.9672 8.32109 19.0072 8.12308 19.008C7.92507 19.0088 7.72886 18.9704 7.54577 18.895C7.36268 18.8196 7.19633 18.7087 7.05631 18.5687C6.9163 18.4287 6.80539 18.2623 6.72999 18.0792C6.65458 17.8961 6.61618 17.6999 6.61699 17.5019C6.61779 17.3039 6.65779 17.108 6.73469 16.9255C6.81158 16.7431 6.92384 16.5776 7.06499 16.4388L10.5125 12.5013L7.06374 8.56125C6.92259 8.42238 6.81033 8.25694 6.73344 8.07447C6.65654 7.892 6.61654 7.69611 6.61574 7.4981C6.61493 7.30009 6.65333 7.10388 6.72874 6.92079C6.80414 6.73769 6.91505 6.57134 7.05506 6.43133C7.19508 6.29131 7.36143 6.18041 7.54452 6.105C7.72761 6.0296 7.92382 5.9912 8.12183 5.992C8.31984 5.99281 8.51573 6.03281 8.6982 6.1097C8.88067 6.18659 9.04612 6.29885 9.18499 6.44L12.5 10.2288L15.8137 6.44C15.9526 6.29885 16.118 6.18659 16.3005 6.1097C16.483 6.03281 16.6789 5.99281 16.8769 5.992C17.0749 5.9912 17.2711 6.0296 17.4542 6.105C17.6373 6.18041 17.8036 6.29131 17.9437 6.43133C18.0837 6.57134 18.1946 6.73769 18.27 6.92079C18.3454 7.10388 18.3838 7.30009 18.383 7.4981C18.3822 7.69611 18.3422 7.892 18.2653 8.07447C18.1884 8.25694 18.0761 8.42238 17.935 8.56125L14.4875 12.5013L17.935 16.4388C18.0744 16.5781 18.1851 16.7435 18.2606 16.9256C18.3361 17.1077 18.3749 17.3029 18.3749 17.5C18.3749 17.6971 18.3361 17.8923 18.2606 18.0744C18.1851 18.2565 18.0744 18.4219 17.935 18.5613Z"/>
                </svg>
            </button>
        </div>
        <button id="header__profile-button" class="header__profile-button" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" transform="translate(4 2.5)"><circle cx="7.579" cy="4.778" r="4.778"></circle><path d="M5.32907052e-15,16.2013731 C-0.00126760558,15.8654831 0.0738531734,15.5336997 0.219695816,15.2311214 C0.677361723,14.3157895 1.96797958,13.8306637 3.0389178,13.610984 C3.81127745,13.4461621 4.59430539,13.3360488 5.38216724,13.2814646 C6.84083861,13.1533327 8.30793524,13.1533327 9.76660662,13.2814646 C10.5544024,13.3366774 11.3373865,13.4467845 12.1098561,13.610984 C13.1807943,13.8306637 14.4714121,14.270023 14.929078,15.2311214 C15.2223724,15.8479159 15.2223724,16.5639836 14.929078,17.1807781 C14.4714121,18.1418765 13.1807943,18.5812358 12.1098561,18.7917621 C11.3383994,18.9634099 10.5550941,19.0766219 9.76660662,19.1304349 C8.57936754,19.2310812 7.38658584,19.2494317 6.19681255,19.1853548 C5.92221301,19.1853548 5.65676678,19.1853548 5.38216724,19.1304349 C4.59663136,19.077285 3.8163184,18.9640631 3.04807112,18.7917621 C1.96797958,18.5812358 0.686515041,18.1418765 0.219695816,17.1807781 C0.0745982583,16.8746908 -0.000447947969,16.5401098 5.32907052e-15,16.2013731 Z"></path></g></svg>
        </button>
    </header>`
  },
};

const pageContentContainer = {
  getHTML: function() {
    return `
    <!-- Page content -->
    <section id="page-content-container" class="page-content-container">
    </section>
    `
  },
};

const footer = {
  getHTML: function() {
    return `
    <!-- Footer -->
    <footer id="footer" class="footer">
        <div class="footer__body">
            <div id="footer-logo">
                <img src="images/MovieMate-logo.svg" alt="our logo">
            </div>
            <div>
                <button id="footer-top-button" type="button">Back to top</button>
            </div>
            <p>The site is made for educational purposes and is not commercial</p>
            <p>Andrew Shket &mdash; 2023</p>
        </div>
    </footer>`
  },
};

const signUp = {
    makeSignUpModalWindow: function() {

        let overflow = null;

        if (document.getElementById("overflow") !== null) {
            overflow = document.getElementById("overflow");
        } else {
            overflow = document.createElement("div");
            overflow.setAttribute("id", "overflow");
            overflow.classList.add("overflow");
            document.body.prepend(overflow);
        };

        const registrationSection = document.createElement("section");
        registrationSection.setAttribute("id", "registration");
        registrationSection.classList.add("registration-window");
        overflow.append(registrationSection);

        const registrationModal = document.createElement("div");
        registrationModal.classList.add("registration-window__container");
        registrationSection.append(registrationModal);

        const registrationModalTitle = document.createElement("div");
        registrationModalTitle.classList.add("registration-window__title");
        registrationModal.append(registrationModalTitle);

        const title = document.createElement("h1");
        title.textContent = "Registration";
        registrationModalTitle.append(title);

        const registrationModalBody = document.createElement("div");
        registrationModalBody.classList.add("registration-window__body");
        registrationModal.append(registrationModalBody);

        const registrationModalBodyAlert = document.createElement("div");
        registrationModalBodyAlert.classList.add("registration-window_alert");
        registrationModalBody.append(registrationModalBodyAlert);

        const registrationModalBodyAlertSVGContainer = document.createElement("div");
        registrationModalBodyAlert.append(registrationModalBodyAlertSVGContainer);

        const SVGHTML = `
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_202_4)">
            <path d="M32.9 23.7708L21.7146 5.22083C21.2623 4.51327 20.6391 3.93097 19.9026 3.52762C19.166 3.12427 18.3398 2.91284 17.5 2.91284C16.6602 2.91284 15.834 3.12427 15.0974 3.52762C14.3608 3.93097 13.7377 4.51327 13.2854 5.22083L2.09998 23.7708C1.70485 24.4295 1.49009 25.1806 1.47729 25.9486C1.46449 26.7166 1.65411 27.4744 2.02707 28.1458C2.45827 28.9016 3.0824 29.5294 3.83569 29.965C4.58898 30.4006 5.44442 30.6283 6.31457 30.625H28.6854C29.5498 30.6342 30.4014 30.4153 31.1542 29.9902C31.907 29.5652 32.5343 28.9491 32.9729 28.2042C33.3568 27.5257 33.5525 26.757 33.5397 25.9776C33.5268 25.1981 33.306 24.4363 32.9 23.7708ZM30.4208 26.7604C30.2455 27.0617 29.9912 27.3093 29.6853 27.4764C29.3794 27.6435 29.0336 27.7237 28.6854 27.7083H6.31457C5.96635 27.7237 5.62057 27.6435 5.31467 27.4764C5.00878 27.3093 4.75442 27.0617 4.57915 26.7604C4.45115 26.5387 4.38377 26.2872 4.38377 26.0313C4.38377 25.7753 4.45115 25.5238 4.57915 25.3021L15.7791 6.7375C15.9804 6.47166 16.2405 6.25605 16.5391 6.10761C16.8377 5.95916 17.1666 5.88191 17.5 5.88191C17.8334 5.88191 18.1623 5.95916 18.4609 6.10761C18.7594 6.25605 19.0196 6.47166 19.2208 6.7375L30.4062 25.2875C30.5392 25.5096 30.6106 25.7631 30.6132 26.022C30.6157 26.2808 30.5493 26.5357 30.4208 26.7604Z" fill="#313338"/>
            <path d="M17.5 24.7917C18.3054 24.7917 18.9583 24.1387 18.9583 23.3333C18.9583 22.5279 18.3054 21.875 17.5 21.875C16.6945 21.875 16.0416 22.5279 16.0416 23.3333C16.0416 24.1387 16.6945 24.7917 17.5 24.7917Z" fill="#313338"/>
            <path d="M17.5 11.6667C17.1132 11.6667 16.7423 11.8203 16.4688 12.0938C16.1953 12.3673 16.0416 12.7382 16.0416 13.125V18.9584C16.0416 19.3451 16.1953 19.7161 16.4688 19.9896C16.7423 20.263 17.1132 20.4167 17.5 20.4167C17.8867 20.4167 18.2577 20.263 18.5312 19.9896C18.8046 19.7161 18.9583 19.3451 18.9583 18.9584V13.125C18.9583 12.7382 18.8046 12.3673 18.5312 12.0938C18.2577 11.8203 17.8867 11.6667 17.5 11.6667Z" fill="#313338"/>
            </g>
            <defs>
            <clipPath id="clip0_202_4">
            <rect width="35" height="35" fill="white"/>
            </clipPath>
            </defs>
        </svg>`;
        registrationModalBodyAlertSVGContainer.innerHTML = SVGHTML;

        const message = document.createElement("p");
        message.textContent = "Do not enter your real information!";
        registrationModalBodyAlert.append(message);

        const inputsContainer = document.createElement("div");
        registrationModalBody.append(inputsContainer);

        const emailInputContainer = document.createElement("div");
        inputsContainer.append(emailInputContainer);

        const emailInputLabel = document.createElement("label");
        emailInputLabel.setAttribute("for", "RW-mail");
        emailInputLabel.textContent = "E-mail:";
        emailInputContainer.append(emailInputLabel);

        const emailInput = document.createElement("input");
        emailInput.setAttribute("id", "RW-mail");
        emailInput.setAttribute("type", "email");
        emailInputContainer.append(emailInput);

        const passwordInputContainer = document.createElement("div");
        inputsContainer.append(passwordInputContainer);

        const passwordInputLabel = document.createElement("label");
        passwordInputLabel.setAttribute("for", "RW-password");
        passwordInputLabel.textContent = "Password:";
        passwordInputContainer.append(passwordInputLabel);

        const passwordInput = document.createElement("input");
        passwordInput.setAttribute("id", "RW-password");
        passwordInput.setAttribute("type", "password");
        passwordInputContainer.append(passwordInput);

        const registrationModalFooter = document.createElement("div");
        registrationModalFooter.classList.add("registration-window__footer");
        registrationModal.append(registrationModalFooter);

        const buttonsContainer = document.createElement("div");
        registrationModalFooter.append(buttonsContainer);

        const cancelButton = document.createElement("button");
        cancelButton.setAttribute("id", "cancelRegButton");
        cancelButton.textContent = "Cancel";
        buttonsContainer.append(cancelButton);

        const signUpButton = document.createElement("button");
        signUpButton.setAttribute("id", "signUpRegButton");
        signUpButton.textContent = "Sign me up";
        signUpButton.disabled = true;
        buttonsContainer.append(signUpButton);

        const registeredButton = document.createElement("button");
        registeredButton.setAttribute("id", "alreadyRegButton");
        registeredButton.textContent = "Already registered?";
        registrationModalFooter.append(registeredButton);
    },

    changeLogInToRegModal: function() {
        const overflow = document.getElementById("overflow");
        const registrationModal = overflow.querySelector("#log-in");
        registrationModal.remove();

        this.makeSignUpModalWindow();
    },
};

const logIn = {
    makeLogInModalWindow: function() {

        let overflow = null;

        if (document.getElementById("overflow") !== null) {
            overflow = document.getElementById("overflow");
        } else {
            overflow = document.createElement("div");
            overflow.setAttribute("id", "overflow");
            overflow.classList.add("overflow");
            document.body.prepend(overflow);
        };

        const logInSection = document.createElement("section");
        logInSection.setAttribute("id", "log-in");
        logInSection.classList.add("log-in-window");
        overflow.append(logInSection);

        const logInModal = document.createElement("div");
        logInModal.classList.add("log-in-window__container");
        logInSection.append(logInModal);

        const logInModalTitle = document.createElement("div");
        logInModalTitle.classList.add("log-in-window__title");
        logInModal.append(logInModalTitle);

        const title = document.createElement("h1");
        title.textContent = "Log In";
        logInModalTitle.append(title);

        const logInModalBody = document.createElement("div");
        logInModalBody.classList.add("log-in-window__body");
        logInModal.append(logInModalBody);

        const inputsContainer = document.createElement("div");
        logInModalBody.append(inputsContainer);

        const emailInputContainer = document.createElement("div");
        inputsContainer.append(emailInputContainer);

        const emailInputLabel = document.createElement("label");
        emailInputLabel.setAttribute("for", "RW-mail");
        emailInputLabel.textContent = "E-mail:";
        emailInputContainer.append(emailInputLabel);

        const emailInput = document.createElement("input");
        emailInput.setAttribute("id", "RW-mail");
        emailInput.setAttribute("type", "email");
        emailInputContainer.append(emailInput);

        const passwordInputContainer = document.createElement("div");
        inputsContainer.append(passwordInputContainer);

        const passwordInputLabel = document.createElement("label");
        passwordInputLabel.setAttribute("for", "RW-password");
        passwordInputLabel.textContent = "Password:";
        passwordInputContainer.append(passwordInputLabel);

        const passwordInput = document.createElement("input");
        passwordInput.setAttribute("id", "RW-password");
        passwordInput.setAttribute("type", "password");
        passwordInputContainer.append(passwordInput);

        const logInModalFooter = document.createElement("div");
        logInModalFooter.classList.add("registration-window__footer");
        logInModal.append(logInModalFooter);

        const buttonsContainer = document.createElement("div");
        logInModalFooter.append(buttonsContainer);

        const cancelButton = document.createElement("button");
        cancelButton.setAttribute("id", "cancelRegButton");
        cancelButton.textContent = "Cancel";
        buttonsContainer.append(cancelButton);

        const logInButton = document.createElement("button");
        logInButton.setAttribute("id", "logInRegButton");
        logInButton.textContent = "Log In";
        buttonsContainer.append(logInButton);

        const registeredButton = document.createElement("button");
        registeredButton.setAttribute("id", "notRegButton");
        registeredButton.textContent = "Not registered?";
        logInModalFooter.append(registeredButton);
    },

    changeRegToLogInModal: function() {
        const overflow = document.getElementById("overflow");
        const registrationModal = overflow.querySelector("#registration");
        registrationModal.remove();

        this.makeLogInModalWindow();
    },
};

export const defaultComponents = {
  header: header,
  contentContainer: pageContentContainer,
  footer: footer,
  signUp: signUp,
  logIn: logIn,
};