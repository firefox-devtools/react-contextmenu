// Importing this here makes it work everywhere.
import '@testing-library/jest-dom';

window.resizeTo = (width, height) => {
    window.innerWidth = width || window.innerWidth;
    window.innerHeight = height || window.innerHeight;
    window.dispatchEvent(new Event('resize'));
};
