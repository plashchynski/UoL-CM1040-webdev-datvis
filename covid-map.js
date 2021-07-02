function CovidMap() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'COVID-19 Map';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'covid-map';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    // Calling loadTable() inside preload() guarantees to complete the operation before setup()
    // and draw() are called. https://p5js.org/reference/#/p5/loadTable
    this.countryCodes = loadTable('./data/covid-19/country-codes.csv', 'csv', 'header');
    this.dailyCases = loadTable('./data/covid-19/daily-cases.csv', 'csv', 'header');
    this.mapSvg = loadStrings('./data/covid-19/map.svg');
  };

  this.render_map = function() {
    var self = this;

    // generate individual style for each country
    var countryColors = [];

    this.date = this.dailyCases.columns[this.dateSlider.value()+2];
    var maxValue = max(this.dailyCases.getColumn(this.date).map(Number));
    var minValue = min(this.dailyCases.getColumn(this.date).map(Number));

    this.dailyCases.rows.forEach(function(row) {
      var Alpha3CountryCode = row.getString("id");
      var countryCodeRow = self.countryCodes.findRow(Alpha3CountryCode, "Alpha-3 code");
      if (!countryCodeRow) {
        return;
      }

      var countryCode = countryCodeRow.getString("Alpha-2 code").toLowerCase();

      self.map.querySelectorAll("#" + countryCode + ", #" + countryCode + " *").forEach(function(el) {
        el.style.fill = "#c0c0c0";
      });

      var value = Number(row.getNum(self.date));
      if (value <= 0) {
        return;
      }
      var c = color('red');
      c.setAlpha(map(value, minValue, maxValue, 50, 255));
      countryColors.push({
        countryCode: countryCode,
        colour: c.toString()
      });
    });

    // set country individual styles
    countryColors.forEach(function(countryColor) {
      self.map.querySelectorAll("#" + countryColor.countryCode + ", #" + countryColor.countryCode + " *").forEach(function(el) {
        el.style.fill = countryColor.colour;
      });
    });

    // update map image
    var svgElement = this.map.querySelector('svg');
    var clonedSvgElement = svgElement.cloneNode(true);
    var outerHTML = clonedSvgElement.outerHTML,
        blob = new Blob([outerHTML],{type:'image/svg+xml;charset=utf-8'});
    var URL = window.URL || window.webkitURL || window;
    var blobURL = URL.createObjectURL(blob);

    this.img = loadImage(blobURL);
  }


  this.setup = function() {
    // parse map svg sources to DOM document
    var parser = new DOMParser();
    this.map = parser.parseFromString(this.mapSvg.toString(), "image/svg+xml");

    // reset map styles
    this.map.querySelectorAll(".landxx,.subxx,.circlexx,.limitxx").forEach(function(el) {
      el.style.stroke = "#ffffff";
      el.style.strokeWidth = 0.5;
      el.style.fillRule = "evenodd";
      el.style.fill = "#c0c0c0";
    });

    var daysCount = this.dailyCases.columns.length - 3;
    this.dateSlider = createSlider(0, daysCount, daysCount, 1);
    this.dateSlider.position(400, 20);

    this.render_map();

    var self = this;
    this.dateSlider.input(function () {
      self.render_map();
    });
  };


  this.destroy = function() {
    this.dateSlider.remove();
  };

  this.draw = function() {
    image(this.img, 50, 100, 826, 419);

    var parts = this.date.split('/');
    var date = new Date(("20" + parts[2]), parts[0], parts[1]);
    fill('black');
    textAlign(LEFT, BASELINE);
    textSize(12);
    strokeWeight(0);
    textStyle(BOLD);
    text(date.toDateString(), 110, 50);
  };
}