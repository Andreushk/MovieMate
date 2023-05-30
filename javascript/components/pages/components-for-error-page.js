/* ------- Компоент блока "About" -------- */
export const errorSection = {
  makePageSection: (id) => {
    const pageContainer = document.getElementById(id);

    const section = document.createElement("section");
    section.classList.add("error");
    section.innerHTML = `
    <div class="error__body">
        <div>
            <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M68.75 275C68.75 288.75 57.5 300 43.75 300C30 300 18.75 288.75 18.75 275C18.75 267.5 21.25 261.25 26.25 257.5C30 252.5 36.25 250 43.75 250C57.5 250 68.75 261.25 68.75 275Z" fill="#313338"/>
                <path d="M93.75 225C80 225 68.75 213.75 68.75 200C68.75 192.5 71.25 186.25 76.25 182.5C80 177.5 86.25 175 93.75 175" fill="#313338"/>
                <path d="M393.75 181.25V156.25H378.75C377.5 153.75 376.25 151.25 375 147.5L385 137.5L367.5 120L357.5 130C355 128.75 352.5 127.5 348.75 126.25V112.5H330V151.25C333.75 150 335 150 337.5 150C347.5 150 356.25 158.75 356.25 168.75C356.25 178.75 347.5 187.5 337.5 187.5C335 187.5 333.75 187.5 331.25 186.25V225H350V210C352.5 208.75 355 207.5 358.75 206.25L368.75 216.25L386.25 198.75L376.25 188.75C377.5 186.25 378.75 183.75 380 180H393.75V181.25Z" fill="#313338"/>
                <path d="M318.75 262.5H106.25C98.75 262.5 93.75 257.5 93.75 250V100C93.75 92.5 98.75 87.5 106.25 87.5H318.75C326.25 87.5 331.25 92.5 331.25 100V250C331.25 257.5 326.25 262.5 318.75 262.5Z" fill="#313338"/>
                <path d="M181.25 262.5H243.75V312.5H181.25V262.5Z" fill="#313338"/>
                <path d="M93.75 250C93.75 257.5 98.75 262.5 106.25 262.5H318.75C326.25 262.5 331.25 257.5 331.25 250V225H93.75V250Z" fill="#313338"/>
                <path d="M168.75 193.75H131.25C130 193.75 127.5 192.5 126.25 191.25C125 190 125 188.75 125 186.25L135 136.25C136.25 132.5 138.75 130 142.5 131.25C146.25 132.5 148.75 135 147.5 138.75L140 181.25H170C173.75 181.25 176.25 183.75 176.25 187.5C176.25 191.25 172.5 193.75 168.75 193.75Z" fill="#1E1F22"/>
                <path d="M156.25 206.25C152.5 206.25 150 203.75 150 200V162.5C150 158.75 152.5 156.25 156.25 156.25C160 156.25 162.5 158.75 162.5 162.5V200C162.5 203.75 160 206.25 156.25 206.25ZM293.75 193.75H256.25C255 193.75 252.5 192.5 251.25 191.25C250 190 250 188.75 250 186.25L260 136.25C261.25 132.5 263.75 130 267.5 131.25C271.25 132.5 273.75 135 272.5 138.75L265 181.25H295C298.75 181.25 301.25 183.75 301.25 187.5C301.25 191.25 297.5 193.75 293.75 193.75Z" fill="#1E1F22"/>
                <path d="M281.25 206.25C277.5 206.25 275 203.75 275 200V162.5C275 158.75 277.5 156.25 281.25 156.25C285 156.25 287.5 158.75 287.5 162.5V200C287.5 203.75 285 206.25 281.25 206.25Z" fill="#1E1F22"/>
                <path d="M318.75 268.75H106.25C96.25 268.75 87.5 260 87.5 250V100C87.5 90 96.25 81.25 106.25 81.25H318.75C328.75 81.25 337.5 90 337.5 100V250C337.5 260 328.75 268.75 318.75 268.75ZM106.25 93.75C102.5 93.75 100 96.25 100 100V250C100 253.75 102.5 256.25 106.25 256.25H318.75C322.5 256.25 325 253.75 325 250V100C325 96.25 322.5 93.75 318.75 93.75H106.25ZM293.75 318.75H131.25C127.5 318.75 125 316.25 125 312.5C125 308.75 127.5 306.25 131.25 306.25H293.75C297.5 306.25 300 308.75 300 312.5C300 316.25 297.5 318.75 293.75 318.75Z" fill="#1E1F22"/>
                <path d="M331.25 231.25H93.75C90 231.25 87.5 228.75 87.5 225C87.5 221.25 90 218.75 93.75 218.75H331.25C335 218.75 337.5 221.25 337.5 225C337.5 228.75 335 231.25 331.25 231.25ZM243.75 318.75H181.25C177.5 318.75 175 316.25 175 312.5V262.5C175 258.75 177.5 256.25 181.25 256.25H243.75C247.5 256.25 250 258.75 250 262.5V312.5C250 316.25 247.5 318.75 243.75 318.75ZM187.5 306.25H237.5V268.75H187.5V306.25ZM81.25 281.25H68.75C65 281.25 62.5 278.75 62.5 275C62.5 271.25 65 268.75 68.75 268.75H81.25C85 268.75 87.5 271.25 87.5 275C87.5 278.75 85 281.25 81.25 281.25ZM18.75 281.25H6.25C2.5 281.25 0 278.75 0 275C0 271.25 2.5 268.75 6.25 268.75H18.75C22.5 268.75 25 271.25 25 275C25 278.75 22.5 281.25 18.75 281.25ZM43.75 256.25C40 256.25 37.5 253.75 37.5 250V237.5C37.5 233.75 40 231.25 43.75 231.25C47.5 231.25 50 233.75 50 237.5V250C50 253.75 47.5 256.25 43.75 256.25ZM43.75 318.75C40 318.75 37.5 316.25 37.5 312.5V300C37.5 296.25 40 293.75 43.75 293.75C47.5 293.75 50 296.25 50 300V312.5C50 316.25 47.5 318.75 43.75 318.75ZM26.25 263.75C25 263.75 22.5 263.75 21.25 262.5L12.5 252.5C10 250 10 246.25 12.5 243.75C15 241.25 18.75 241.25 21.25 243.75L30 252.5C32.5 255 32.5 258.75 30 261.25C28.75 262.5 27.5 263.75 26.25 263.75ZM70 307.5C68.75 307.5 66.25 307.5 65 306.25L56.25 297.5C53.75 295 53.75 291.25 56.25 288.75C58.75 286.25 62.5 286.25 65 288.75L75 297.5C77.5 300 77.5 303.75 75 306.25C73.75 307.5 71.25 307.5 70 307.5ZM61.25 263.75C60 263.75 57.5 263.75 56.25 262.5C53.75 260 53.75 256.25 56.25 253.75L65 245C67.5 242.5 71.25 242.5 73.75 245C76.25 247.5 76.25 251.25 73.75 253.75L65 262.5C65 262.5 62.5 263.75 61.25 263.75ZM17.5 307.5C16.25 307.5 13.75 307.5 12.5 306.25C10 303.75 10 300 12.5 297.5L21.25 288.75C23.75 286.25 27.5 286.25 30 288.75C32.5 291.25 32.5 295 30 297.5L21.25 306.25C20 307.5 18.75 307.5 17.5 307.5Z" fill="#1E1F22"/>
                <path d="M43.75 281.25C47.2018 281.25 50 278.452 50 275C50 271.548 47.2018 268.75 43.75 268.75C40.2982 268.75 37.5 271.548 37.5 275C37.5 278.452 40.2982 281.25 43.75 281.25Z" fill="#1E1F22"/>
                <path d="M43.75 306.25C26.25 306.25 12.5 292.5 12.5 275C12.5 266.25 16.25 258.75 21.25 252.5C27.5 246.25 35 243.75 43.75 243.75C61.25 243.75 75 257.5 75 275C75 292.5 61.25 306.25 43.75 306.25ZM43.75 256.25C38.75 256.25 33.75 258.75 30 261.25C27.5 265 25 270 25 275C25 285 33.75 293.75 43.75 293.75C53.75 293.75 62.5 285 62.5 275C62.5 265 53.75 256.25 43.75 256.25ZM68.75 206.25H56.25C52.5 206.25 50 203.75 50 200C50 196.25 52.5 193.75 56.25 193.75H68.75C72.5 193.75 75 196.25 75 200C75 203.75 72.5 206.25 68.75 206.25ZM76.25 188.75C75 188.75 72.5 188.75 71.25 187.5L62.5 177.5C60 175 60 171.25 62.5 168.75C65 166.25 68.75 166.25 71.25 168.75L80 177.5C82.5 180 82.5 183.75 80 186.25C78.75 187.5 77.5 188.75 76.25 188.75ZM67.5 232.5C66.25 232.5 63.75 232.5 62.5 231.25C60 228.75 60 225 62.5 222.5L71.25 213.75C73.75 211.25 77.5 211.25 80 213.75C82.5 216.25 82.5 220 80 222.5L71.25 231.25C70 232.5 68.75 232.5 67.5 232.5Z" fill="#1E1F22"/>
                <path d="M93.75 231.25C76.25 231.25 62.5 217.5 62.5 200C62.5 191.25 66.25 183.75 71.25 177.5C77.5 171.25 85 168.75 93.75 168.75V181.25C88.75 181.25 83.75 183.75 80 186.25C77.5 190 75 195 75 200C75 210 83.75 218.75 93.75 218.75V231.25ZM350 231.25H331.25C327.5 231.25 325 228.75 325 225V112.5C325 108.75 327.5 106.25 331.25 106.25H350C353.75 106.25 356.25 108.75 356.25 112.5V122.5L363.75 115C366.25 112.5 370 112.5 372.5 115L390 132.5C392.5 135 392.5 138.75 390 141.25L383.75 150H393.75C397.5 150 400 152.5 400 156.25V181.25C400 185 397.5 187.5 393.75 187.5H383.75L391.25 195C393.75 197.5 393.75 201.25 391.25 203.75L373.75 221.25C371.25 223.75 367.5 223.75 365 221.25L357.5 213.75V225C356.25 228.75 353.75 231.25 350 231.25ZM337.5 218.75H343.75V210C343.75 207.5 345 205 347.5 203.75C350 202.5 352.5 202.5 355 201.25C357.5 200 360 200 362.5 202.5L368.75 208.75L377.5 200L371.25 193.75C368.75 191.25 368.75 188.75 370 186.25C371.25 183.75 372.5 181.25 372.5 178.75C373.75 176.25 376.25 173.75 378.75 173.75H387.5V161.25H378.75C376.25 161.25 373.75 160 372.5 156.25C371.25 153.75 371.25 151.25 370 148.75C368.75 146.25 368.75 143.75 371.25 141.25L377.5 135L368.75 126.25L362.5 135C360 137.5 357.5 137.5 355 136.25C352.5 135 350 133.75 347.5 133.75C345 132.5 343.75 130 343.75 127.5V118.75H337.5V218.75Z" fill="#1E1F22"/>
                <path d="M337.5 193.75C335 193.75 332.5 193.75 328.75 192.5C326.25 191.25 325 188.75 325 186.25V151.25C325 148.75 326.25 146.25 328.75 145C346.25 138.75 362.5 152.5 362.5 168.75C362.5 182.5 351.25 193.75 337.5 193.75ZM337.5 156.25V181.25C345 181.25 350 176.25 350 168.75C350 161.25 345 156.25 337.5 156.25ZM218.75 206.25H206.25C196.25 206.25 187.5 197.5 187.5 187.5V150C187.5 140 196.25 131.25 206.25 131.25H218.75C228.75 131.25 237.5 140 237.5 150V187.5C237.5 197.5 228.75 206.25 218.75 206.25ZM206.25 143.75C202.5 143.75 200 146.25 200 150V187.5C200 191.25 202.5 193.75 206.25 193.75H218.75C222.5 193.75 225 191.25 225 187.5V150C225 146.25 222.5 143.75 218.75 143.75H206.25Z" fill="#1E1F22"/>
            </svg>
        </div>
        <h1>Something seems to have gone wrong...</h1>
        <div>
            <button id="to-the-main-page-btn" type="button">Go to the main page</button>
        </div>
    </div>`;
    pageContainer.append(section);
    return;
  },
};
/* ---------------------------------------- */