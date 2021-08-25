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
    this.covidGlobalData = loadTable('./data/covid-19/WHO-COVID-19-global-data.csv', 'csv', 'header');
    loadStrings('./data/covid-19/map.svg', function (svg) {
      self.map = createDiv(svg);
      self.map.style('visibility', 'hidden');
    });
  };

  this.setup = function() {
    this.map.style('visibility', 'visible');

    // set date slider
    this.days = Array.from(new Set(this.covidGlobalData.getColumn("Date_reported")));

    this.dataSetSelector = createSelect();
    this.dataSetSelector.position(370, 30);
    this.dataSetSelector.option('Daily cases');
    this.dataSetSelector.option('Total cases');
    this.dataSetSelector.option('Daily deaths');
    this.dataSetSelector.option('Total deaths');

    this.dateSlider = createSlider(1, this.days.length, this.days.length, 1);
    this.dateSlider.position(700, 540);

    this.map.position(350, 70);

    this.dataSetSelector.input(this.render_map);

    this.dateSlider.input(this.render_map);

    this.render_map();
  };

  this.destroy = function() {
    this.dateSlider.remove();
    this.dataSetSelector.remove();
    this.map.style('visibility', 'hidden');
  };

  this.draw = function() {
    // The Date constructor function accepts a set of ordered values that represent each part of a date:
    // the year, the month (starting from 0), the day, the hour, the minutes, seconds and milliseconds
    var date = new Date(this.date);
    fill('black');
    textAlign(LEFT, BASELINE);
    textSize(12);
    strokeWeight(0);
    textStyle(BOLD);
    text(date.toDateString(), 410, 570);
  };

  this.render_map = function() {
    var self = this;

    this.date = this.days[this.dateSlider.value()-1];
    this.dayData = this.covidGlobalData.findRows(this.date, "Date_reported");

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
      document.querySelectorAll("#" + countryCode + ", #" + countryCode + " *").forEach(function(el) {
        el.style.fill = "#c0c0c0";
      });

      var value = Number(row.getNum(fieldName));
      if (value <= 0)
        return;

      var c = color('red');
      c.setAlpha(map(value, minValue, maxValue, 50, 255));
      // Set an individual style for each country
      document.querySelectorAll("#" + countryCode + ", #" + countryCode + " *").forEach(function(el) {
        el.style.fill = c.toString();
      });
    });
  }
}
