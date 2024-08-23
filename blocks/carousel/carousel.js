export function updateButtons(activeSlide) {
    const block = activeSlide.closest('.block');
    const nthSlide = activeSlide.offsetLeft / activeSlide.parentNode.clientWidth;
    const button = block.parentElement.querySelector(`.carousel-buttons > button:nth-child(${nthSlide + 1})`);
    [...block.closest('.carousel-wrapper').querySelector('.carousel-buttons').children].forEach((r) => r.classList.remove('selected'));
    button.classList.add('selected');
  }

  export default function decorate(block) {
    const buttons = document.createElement('div');
    [...block.children].forEach((row, i) => {
      const classes = ['image']; // Removed 'button' since we're only using images
      classes.forEach((e, j) => {
        row.children[j].classList.add(`carousel-${e}`);
      });

// Extract image element
      const imageElement = row.querySelector('.carousel-image');

// Set image source
      imageElement.src = imageElement.getAttribute('data-image-src');

// Add button to carousel navigation (optional)
        const button = document.createElement('button');
        button.title = 'Carousel Nav';
        if (!i) button.classList.add('selected');
        button.addEventListener('click', () => {
          block.scrollTo({ top: 0, left: row.offsetLeft - row.parentNode.offsetLeft, behavior: 'smooth' });
          [...block.closest('.carousel-wrapper').querySelector('.carousel-buttons').children].forEach((r) => r.classList.remove('selected'));
          button.classList.add('selected');
        });
       buttons.append(button);
 
    });

// ... rest of the code remains the same ...

// Add automatic slide change every 5 seconds
    let slideIndex = 0;
    setInterval(() => {
      const nextSlide = block.children[slideIndex];
      block.scrollTo({ top: 0, left: nextSlide.offsetLeft - nextSlide.parentNode.offsetLeft, behavior: 'smooth' });
      updateButtons(nextSlide);
      slideIndex = (slideIndex + 1) % block.children.length;
    }, 5000); // Adjust the interval as needed
  }
