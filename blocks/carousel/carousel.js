export default function decorate(block) {
    const buttons = document.createElement('div');
    [...block.children].forEach((row, i) => {
        const classes = ['image', 'text'];
        classes.forEach((e, j) => {
            row.children[j].classList.add(`carousel-${e}`);
        });
        const carouselText = row.querySelector('.carousel-text');
        if (!carouselText.innerText.trim()) carouselText.remove();
        else {
            const linkText = carouselText.textContent; // Extract the text content
            const anchor = document.createElement('a');
            anchor.href = linkText; // Replace with the desired link
            anchor.textContent = 'Explore'; // Set the anchor text
            // Replace the text element with the anchor
            carouselText.innerHTML = ''; // Clear the existing content
            carouselText.appendChild(anchor); // Append the anchor to the carouse
        }
        /* buttons */
        const button = document.createElement('button');
        button.title = 'Carousel Nav';
        if (!i) button.classList.add('selected');
        button.addEventListener('click', () => {
            block.scrollTo({ top: 0, left: row.offsetLeft - row.parentNode.offsetLeft, behavior: 'smooth' });
            [...buttons.children].forEach((r) => r.classList.remove('selected'));
            button.classList.add('selected');
        });
        buttons.append(button);
    });
    if (block.nextElementSibling) block.nextElementSibling.replaceWith(buttons);
    else block.parentElement.append(buttons);

    block.querySelectorAll(':scope > div').forEach((slide) => slide.classList.add('slide'));

    block.addEventListener('scrollend', () => {
        const activeElement = Math.round(block.scrollLeft / block.children[0].clientWidth);
        const slide = block.children[activeElement];
        updateButtons(slide);
    }, { passive: true });
}
