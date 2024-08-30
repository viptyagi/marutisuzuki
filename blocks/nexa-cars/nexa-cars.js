console.log('nexa-cars.js loading...');

export default function decorate(block) {
  const div = document.querySelector('main > div.section.nexa-cars');
  const columns = [...div.children][1];
  const grid = columns.children[0].children[0];
  [...grid.children].forEach((row) => {
      row[0].className = 'price';
      row[1].className = 'showroom';
      row[2].className = 'modelName';
      row[3].className = 'downloadIcon';
      row[4].className = 'downloadBrochure';
  });
}
