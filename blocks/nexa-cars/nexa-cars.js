/* eslint-disable no-console */
console.log('nexa-cars.js loading...');

export default function decorate() {
  const div = document.querySelector('main > div.section.nexa-cars');
  if (!div) return;

  const columns = div.children[1];
  if (!columns) return;

  const grid = columns.children[0]?.children[0];
  if (!grid) return;

  grid.className = 'grid';

  [...grid.children].forEach((row) => {
    if (row.children.length < 6) {
      return;
    }

    row.className = 'car';
    row.children[0].className = 'modelImage';
    row.children[1].className = 'price';
    row.children[2].className = 'showroom';
    row.children[3].className = 'modelName';
    row.children[4].className = 'downloadIcon';
    row.children[5].className = 'downloadBrochure';
  });
}
