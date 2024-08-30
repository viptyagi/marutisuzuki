console.lg('nexa-cars.js loading...');

export default function decorate(block) {
  const div = document.querySelector('main > div.section.nexa-cars');
  const columns = [...div.children][1];
  const grid = columns.children[0].children[0];
  [...grid.children].forEach((row) => {
      row[0].addClass('price');
      row[1].addClass('showroom');
      row[2].addClass('modelName');
      row[3].addClass('downloadIcon');
      row[4].addClass('downloadBrochure');
  });
}
