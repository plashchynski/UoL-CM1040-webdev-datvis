function CovidMap() {
  // Name for the visualisation to appear in the menu bar.
  this.name = 'COVID-19 Map';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'covid-map';

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    // Calling loadTable() inside preload() guarantees to complete the operation before setup()
    // and draw() are called. https://p5js.org/reference/#/p5/loadTable
    this.covidGlobalData = loadTable('./data/covid-19/WHO-COVID-19-global-data.csv', 'csv', 'header');
    this.mapSvg = loadStrings('./data/covid-19/map.svg');
  };

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

    // set date slider
    this.days = Array.from(new Set(this.covidGlobalData.getColumn("Date_reported")));
    this.dateSlider = createSlider(1, this.days.length, this.days.length, 1);
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
    image(this.mapImg, 50, 100, 826, 419);

    // The Date constructor function accepts a set of ordered values that represent each part of a date:
    // the year, the month (starting from 0), the day, the hour, the minutes, seconds and milliseconds
    var date = new Date(this.date);
    fill('black');
    textAlign(LEFT, BASELINE);
    textSize(12);
    strokeWeight(0);
    textStyle(BOLD);
    text(date.toDateString(), 110, 50);
  };

  this.render_map = function() {
    var self = this;

    // generate an individual style for each country
    var countryColors = [];

    this.date = this.days[this.dateSlider.value()-1];
    this.dayData = this.covidGlobalData.findRows(this.date, "Date_reported");

    newCases = this.dayData.map(row => row.getNum('New_cases'));
    var maxValue = max(newCases);
    var minValue = min(newCases);

    this.dayData.forEach(function(row) {
      var countryCode = row.getString('Country_code').toLowerCase();
      if (countryCode == ' ')
        return;

      // set default colour for all countries
      self.map.querySelectorAll("#" + countryCode + ", #" + countryCode + " *").forEach(function(el) {
        el.style.fill = "#c0c0c0";
      });

      var value = Number(row.getNum('New_cases'));
      if (value <= 0)
        return;

      var c = color('red');
      c.setAlpha(map(value, minValue, maxValue, 50, 255));
      countryColors.push({
        countryCode: countryCode,
        colour: c.toString()
      });
    });

    // set every country an individual style
    countryColors.forEach(function(countryColor) {
      self.map.querySelectorAll("#" + countryColor.countryCode + ", #" + countryColor.countryCode + " *").forEach(function(el) {
        el.style.fill = countryColor.colour;
      });
    });

    // loadImage raise an unknown error for some reason
    // var svgText = self.map.querySelector('svg').textContent;
    // var encodedData = "data:image/svg+xml;base64," + window.btoa(svgText);
    // this.mapImg = loadImage(encodedData);

    // render map image to blob
    var svgElement = this.map.querySelector('svg');
    var clonedSvgElement = svgElement.cloneNode(true);
    var outerHTML = clonedSvgElement.outerHTML;
    var blob = new Blob([outerHTML],{type:'image/svg+xml'});
    var URL = window.URL || window.webkitURL || window;
    var blobURL = URL.createObjectURL(blob);
    this.mapImg = loadImage(blobURL);
  }
}
