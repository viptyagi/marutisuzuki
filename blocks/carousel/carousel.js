export function updateButtons(activeSlide) {
    const block = activeSlide.closest('.block');
    const nthSlide = activeSlide.offsetLeft / activeSlide.parentNode.clientWidth;
    const button = block.parentElement.querySelector(`.carousel-buttons > button:nth-child(${nthSlide + 1})`);
    [...block.closest('.carousel-wrapper').querySelector('.carousel-buttons').children].forEach((r) => r.classList.remove('selected'));
    button.classList.add('selected');
  }

  export default function decorate(block) {
    [...block.children].forEach((row, i) => {
      const classes = ['image', 'button']; // Corrected the class to 'button'
      classes.forEach((e, j) => {
        row.children[j].classList.add(`carousel-${e}`);
      });

      // Extract image and button elements
      const imageElement = row.querySelector('.carousel-image');
      const buttonElement = row.querySelector('.carousel-button');

      // Set image source
      imageElement.src = imageElement.getAttribute('data-image-src');

      // If button exists, set its properties and add it to the row
      if (buttonElement) {
        buttonElement.href = buttonElement.getAttribute('data-link');
        buttonElement.textContent = buttonElement.getAttribute('data-title');
        row.appendChild(buttonElement);
      }

      // Add button to carousel navigation
      const navButton = document.createElement('button');
      navButton.title = 'Carousel Nav';
      if (!i) navButton.classList.add('selected');
      navButton.addEventListener('click', () => {
        block.scrollTo({ top: 0, left: row.offsetLeft - row.parentNode.offsetLeft, behavior: 'smooth' });
        [...block.closest('.carousel-wrapper').querySelector('.carousel-buttons').children].forEach((r) => r.classList.remove('selected'));
        navButton.classList.add('selected');
      });
    });

    // Add automatic slide change every 5 seconds
    let slideIndex = 0;
    setInterval(() => {
      const nextSlide = block.children[slideIndex];
      block.scrollTo({ top: 0, left: nextSlide.offsetLeft - nextSlide.parentNode.offsetLeft, behavior: 'smooth' });
      updateButtons(nextSlide);
      slideIndex = (slideIndex + 1) % block.children.length;
    }, 5000); // Adjust the interval as needed
  }
