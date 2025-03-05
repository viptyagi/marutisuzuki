console.log('nexa-cars.js loading...');

export default function decorate() {
  const div = document.querySelector('main > div.section.nexa-cars');
  if (!div) return; // Ensure the div exists before proceeding

  const columns = div.children[1];
  if (!columns) return; // Prevent errors if columns are missing

  const grid = columns.children[0]?.children[0];
  if (!grid) return; // Ensure grid exists before applying class

  grid.className = 'grid';

  [...grid.children].forEach((row) => {
    if (row.children.length >= 6) {
      // Ensure row has expected children
      row.className = 'car';
      const classNames = [
        'modelImage',
        'price',
        'showroom',
        'modelName',
        'downloadIcon',
        'downloadBrochure',
      ];

      row.children.forEach((child, index) => {
        if (index < classNames.length) {
          child.className = classNames[index];
        }
      });
    }
  });
}
