console.log('nexa-cars.js loading...');

export default function decorate(block) {
  const div = document.querySelector('main > div.section.nexa-cars');
  const columns = div.children[1];
  const grid = columns.children[0].children[0];
  [...grid.children].forEach((row) => {
      console.log('row :', row);
      row.children[0].className = 'price';
      row.children[1].className = 'showroom';
      row.children[2].className = 'modelName';
      row.children[3].className = 'downloadIcon';
      row.children[4].className = 'downloadBrochure';
  });
}
