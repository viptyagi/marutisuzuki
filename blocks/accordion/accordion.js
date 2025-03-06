export function generateAccordionDOM(block) {
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  details.append(summary);
  Array.from(block.children).forEach(async (element, i) => {
    if (i === 0) {
      // const heading = element.querySelector("h2,h3,h4,h5,h6");
      const heading = element;
      summary.append(heading || element.textContent.trim());
    }
  });

  return details;
}

export default function decorate(block) {
  const dom = generateAccordionDOM(block);
  block.textContent = '';
  block.append(dom);
}
