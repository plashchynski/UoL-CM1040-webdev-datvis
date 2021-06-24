function CovidSituation() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Covid Situation';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'covid-situation';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    // this.data = loadTable(
    //   './data/tech-diversity/race-2018.csv', 'csv', 'header',
    //   // Callback function to set the value
    //   // this.loaded to true.
    //   function(table) {
    //     self.loaded = true;
    //   });
    this.worldMapSource = loadStrings(
      'lib/BlankMap-World.svg',
      function () {
        self.loaded = true;
      }
    );
  };

  this.render_map = function() {
    var parser = new DOMParser();
    this.worldMapSvg = parser.parseFromString(this.worldMapSource.toString(), "image/svg+xml");

    this.worldMapSvg.querySelectorAll(".landxx").forEach(el => el.style = "fill: #c0c0c0;stroke: #ffffff;stroke-width: 0.5;fill-rule: evenodd;");

    var svgElement = this.worldMapSvg.querySelector('svg');
    var clonedSvgElement = svgElement.cloneNode(true);
    var outerHTML = clonedSvgElement.outerHTML,
        blob = new Blob([outerHTML],{type:'image/svg+xml;charset=utf-8'});
    var URL = window.URL || window.webkitURL || window;
    var blobURL = URL.createObjectURL(blob);

    this.img = loadImage(blobURL);
  }

  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    this.render_map();
  };

  this.destroy = function() {

  };

  this.draw = function() {
    image(this.img, 0, 0, 826, 419);

  };
}
