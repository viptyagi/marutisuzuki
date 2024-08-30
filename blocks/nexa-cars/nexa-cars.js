console.log('nexa-cars.js loading...');

export default function decorate(block) {
  const div = document.querySelector('main > div.section.nexa-cars');
  const columns = div.children[1];
  const grid = columns.children[0].children[0];
  [...grid.children].forEach((row) => {
      console.log('row :', row);
      row.children[0].className = 'modelImage';
      row.children[1].className = 'price';
      row.children[2].className = 'showroom';
      row.children[3].className = 'modelName';
      row.children[4].className = 'downloadIcon';
      row.children[5].className = 'downloadBrochure';
  });
}
