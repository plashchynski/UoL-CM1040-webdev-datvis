function CovidMap() {
  // Name for the visualisation to appear in the menu bar.
  this.name = 'COVID-19 Map';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'covid-map';

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;

    // Calling loadTable() inside preload() guarantees to complete the operation before setup()
    // and draw() are called. https://p5js.org/reference/#/p5/loadTable
    this.covidData = loadTable('./data/covid-19/WHO-COVID-19-global-data.csv', 'csv', 'header');

    // Create an inline SVG object of a world map and hide it untill an extension has loaded
    // An inline SVG is more flexible in terms of DOM manipulation than
    // an image or an object tag
    loadStrings('./data/covid-19/map.svg', function (svg) {
      self.map = createDiv(svg);
      self.map.style('visibility', 'hidden');
    });
  };

  // Setup
  // This function is called automatically by the gallery when a visualisation is selected.
  this.setup = function() {
    var self = this;

    // Make the world map image visible
    this.map.style('visibility', 'visible');
    this.map.position(350, 70);

    // By default, HTML elements overlap p5.js graphics.
    // We need to render p5.js text over the world map to display country-specific statistics.
    // So we change z-order of the map and the p5.js canvas to render the canvas over the map.
    this.oldMapZIndex = this.map.style('z-index');
    this.oldCanvasZIndex = canvas.style['z-index'];
    this.map.style('z-index', '1');
    canvas.style.setProperty('z-index', '2');

    // Even though we render the p5.js canvas over the map, we need the map to continue receiving
    // mouse hover events to have specified in CSS border decoration work
    // So we make the p5.js canvas transparent to mouse events
    canvas.style.setProperty('pointer-events', 'none');


    this.dataSetSelector = createSelect();
    this.dataSetSelector.option('Daily cases');
    this.dataSetSelector.option('Total cases');
    this.dataSetSelector.option('Daily deaths');
    this.dataSetSelector.option('Total deaths');
    this.dataSetSelector.position(370, 30);
    this.dataSetSelector.input(function () {
      self.render_map();
    });

    // An array of dates for which statistics was reported
    this.dates = unique(this.covidData.getColumn('Date_reported'));

    this.dateSlider = createSlider(1, this.dates.length, this.dates.length, 1);
    this.dateSlider.position(700, 540);
    this.dateSlider.input(function () {
      self.render_map();
    });

    this.render_map();
  };

  this.destroy = function() {
    this.dateSlider.remove();
    this.dataSetSelector.remove();

    // Hide the map and return back all changed global parameters
    this.map.style('visibility', 'hidden');
    this.map.style('z-index', this.oldMapZIndex);
    canvas.style.setProperty('z-index', this.oldCanvasZIndex);
  };

  this.draw = function() {
    clear();
    // The Date constructor function accepts a set of ordered values that represent each part of a date:
    // the year, the month (starting from 0), the day, the hour, the minutes, seconds and milliseconds
    var date = new Date(this.date);
    fill('black');
    textAlign(LEFT, BASELINE);
    textSize(12);
    strokeWeight(0);
    textStyle(BOLD);
    text(date.toDateString(), 410, 570);

    var hoveredRegion = select('#worldMap>path:hover,#worldMap>g:hover');
    if (hoveredRegion) {
      var countryNameTag = select('name', hoveredRegion);
      var countryCode = hoveredRegion.id();
      if (countryNameTag && countryCode) {
        var countryName = countryNameTag.html();

        fill('black');
        text(countryName, mouseX+10, mouseY+20);

        text(this.dataPoints[countryCode] || 'Unknown', mouseX+10, mouseY+40);
      }
    }
  };

  this.render_map = function() {
    var self = this;

    this.date = this.dates[this.dateSlider.value()-1];
    this.dayData = this.covidData.findRows(this.date, 'Date_reported');
    this.dataPoints = {};

    var fieldName;
    if (this.dataSetSelector.value() == 'Daily cases') {
      fieldName = 'New_cases';
    } else if (this.dataSetSelector.value() == 'Total cases') {
      fieldName = 'Cumulative_cases';
    } else if (this.dataSetSelector.value() == 'Daily deaths') {
      fieldName = 'New_deaths';
    } else if (this.dataSetSelector.value() == 'Total deaths') {
      fieldName = 'Cumulative_deaths';
    }

    var values = this.dayData.map(row => row.getNum(fieldName));
    var maxValue = max(values);
    var minValue = min(values);

    this.dayData.forEach(function(row) {
      var countryCode = row.getString('Country_code').toLowerCase();
      if (countryCode == ' ')
        return;

      // set default colour for all countries
      document.querySelectorAll('#' + countryCode + ', #' + countryCode + ' *').forEach(function(el) {
        el.style.fill = '#c0c0c0';
      });

      var value = Number(row.getNum(fieldName));
      if (value <= 0)
        return;

      self.dataPoints[countryCode] = value;

      var c = color('red');
      c.setAlpha(map(value, minValue, maxValue, 50, 255));

      // Set an individual style for each country
      document.querySelectorAll('#' + countryCode + ', #' + countryCode + ' *').forEach(function(el) {
        el.style.fill = c.toString();
      });
    });
  };
}
