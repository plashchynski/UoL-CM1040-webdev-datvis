function CovidMap() {
  var self = this;

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
    this.covidData = loadTable('./data/covid-19/WHO-COVID-19-global-data.csv', 'csv', 'header');
    this.worldMap = new WorldMap();
  };

  // Setup
  // This function is called automatically by the gallery when a visualisation is selected.
  this.setup = function() {
    this.worldMap.show();
    this.worldMap.position(350, 70);
    this.worldMap.onCountryHover = function(countryCode, countryName) {
      fill('black');
      text(countryName, mouseX+10, mouseY+20);

      text(self.dataPoints[countryCode] || 'Unknown', mouseX+10, mouseY+40);
    };

    this.dataSetSelector = createSelect();
    this.dataSetSelector.option('Daily cases');
    this.dataSetSelector.option('Total cases');
    this.dataSetSelector.option('Daily deaths');
    this.dataSetSelector.option('Total deaths');
    this.dataSetSelector.position(370, 30);
    this.dataSetSelector.input(updateData);

    // An array of dates for which statistics was reported
    this.dates = unique(this.covidData.getColumn('Date_reported'));

    this.dateSlider = createSlider(1, this.dates.length, this.dates.length, 1);
    this.dateSlider.position(700, 540);
    this.dateSlider.input(updateData);

    updateData();
  };

  this.destroy = function() {
    this.dateSlider.remove();
    this.dataSetSelector.remove();

    this.worldMap.hide();
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
    this.worldMap.draw();
  };

  function updateData() {
    self.date = self.dates[self.dateSlider.value()-1];
    self.dayData = self.covidData.findRows(self.date, 'Date_reported');
    self.dataPoints = {};

    var fieldName;
    if (self.dataSetSelector.value() == 'Daily cases') {
      fieldName = 'New_cases';
    } else if (self.dataSetSelector.value() == 'Total cases') {
      fieldName = 'Cumulative_cases';
    } else if (self.dataSetSelector.value() == 'Daily deaths') {
      fieldName = 'New_deaths';
    } else if (self.dataSetSelector.value() == 'Total deaths') {
      fieldName = 'Cumulative_deaths';
    }

    var values = self.dayData.map(row => row.getNum(fieldName));
    var maxValue = max(values);
    var minValue = min(values);

    self.dayData.forEach(function(row) {
      var countryCode = row.getString('Country_code').toLowerCase();
      if (countryCode == ' ')
        return;

      // set default colour for all countries
      self.worldMap.setCountryColor(countryCode, '#c0c0c0');

      var value = Number(row.getNum(fieldName));
      if (value <= 0)
        return;

      self.dataPoints[countryCode] = value;

      var c = color('red');
      c.setAlpha(map(value, minValue, maxValue, 50, 255));

      self.worldMap.setCountryColor(countryCode, c.toString());
    });
  }
}
