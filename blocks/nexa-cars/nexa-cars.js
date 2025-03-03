/* eslint-disable no-console */
console.log('nexa-cars.js loading...');

export default function decorate(_block) { // Prefixing `block` with `_` to avoid the unused variable error
  const div = document.querySelector('main > div.section.nexa-cars');
  if (!div) return; // Ensure the div exists before proceeding

  const columns = div.children[1];
  if (!columns) return; // Prevent errors if columns are missing

  const grid = columns.children[0]?.children[0];
  if (!grid) return; // Ensure grid exists before applying class

  grid.className = 'grid';

  [...grid.children].forEach((row) => {
    if (row.children.length >= 6) { // Ensure row has expected children
      row.className = 'car';
      row.children[0].className = 'modelImage';
      row.children[1].className = 'price';
      row.children[2].className = 'showroom';
      row.children[3].className = 'modelName';
      row.children[4].className = 'downloadIcon';
      row.children[5].className = 'downloadBrochure';
    }
  });
}
