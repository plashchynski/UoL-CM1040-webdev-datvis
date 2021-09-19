function CovidMap() {
  var self = this;

  const defaultCountyColour = '#c0c0c0';

  // A map between datasets and fields in the CSV file (covidData)
  const fieldNameMap = {};
  fieldNameMap['Daily cases'] = 'New_cases';
  fieldNameMap['Total cases'] = 'Cumulative_cases';
  fieldNameMap['Daily deaths'] = 'New_deaths';
  fieldNameMap['Total deaths'] = 'Cumulative_deaths';

  // Name for the visualisation to appear in the menu bar.
  this.name = 'COVID-19 Map';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'covid-map';

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    // Calling loadTable() inside preload() guarantees to complete the operation before setup()
    // and draw() are called. https://p5js.org/reference/#/p5/loadTable
    // A file from https://covid19.who.int/WHO-COVID-19-global-table-data.csv
    this.covidData = loadTable(
      './data/covid-19/WHO-COVID-19-global-data.csv',
      'csv',
      'header'
    );
    this.populationData = loadTable(
      './data/covid-19/population-by-country.csv',
      'csv',
      'header'
    );
    this.worldMap = new WorldMap();
  };

  // Setup
  // This function is called automatically by the gallery when a visualisation is selected.
  this.setup = function () {
    this.worldMap.show();
    this.worldMap.position(350, 70);
    this.worldMap.onCountryHover = function (countryCode, countryName) {
      fill('black');
      text(countryName, mouseX + 10, mouseY + 20);

      if (self.dataPoints[countryCode])
        text(
          formatNumber(self.dataPoints[countryCode]),
          mouseX + 10,
          mouseY + 40
        );
    };

    this.dataSetSelector = createSelect();
    Object.keys(fieldNameMap).forEach((key) =>
      this.dataSetSelector.option(key)
    );
    this.dataSetSelector.position(370, 30);
    this.dataSetSelector.input(updateData);

    // An array of dates for which statistics was reported
    this.dates = unique(this.covidData.getColumn('Date_reported'));

    this.dateSlider = createSlider(1, this.dates.length, this.dates.length, 1);
    this.dateSlider.position(
      this.worldMap.position().x + this.worldMap.size().width / 2 - 60,
      this.worldMap.position().y + this.worldMap.size().height + 20
    );
    this.dateSlider.input(updateData);

    this.perCapitaCheckbox = createCheckbox('Per 1M capita', false);

    // position it relative to dataSetSelector
    this.perCapitaCheckbox.position(
      this.dataSetSelector.position().x +
        this.dataSetSelector.size().width +
        10,
      this.dataSetSelector.position().y - 3
    );

    this.perCapitaCheckbox.changed(updateData);

    updateData();
  };

  this.destroy = function () {
    this.dateSlider.remove();
    this.dataSetSelector.remove();
    this.perCapitaCheckbox.remove();

    this.worldMap.hide();
  };

  this.draw = function () {
    clear();

    // parse a date string from this.date and display it on the page
    drawDate(
      this.worldMap.position().x + 60,
      this.dateSlider.position().y + 30,
      this.date
    );

    // draw the map
    this.worldMap.draw();
  };

  /**
   * parse a date from the string and display it on the page at x and y possition
   * @param {number} x
   * @param {number} y
   * @param {string} dateString
   */
  function drawDate(x, y, dateString) {
    fill('black');
    textAlign(LEFT, BASELINE);
    textSize(12);
    strokeWeight(0);
    textStyle(BOLD);
    let date = new Date(dateString);
    text(date.toDateString(), x, y);
  }

  function updateData() {
    self.date = self.dates[self.dateSlider.value() - 1];
    self.dayData = self.covidData.findRows(self.date, 'Date_reported');
    self.dataPoints = {};

    let fieldName = fieldNameMap[self.dataSetSelector.value()];

    let values = self.dayData.map((row) => row.getNum(fieldName));
    let maxValue = max(values);
    let minValue = min(values);

    self.dayData.forEach(function (row) {
      let countryCode = row.getString('Country_code');
      if (countryCode == ' ') return;

      let value = row.getNum(fieldName);
      if (!value || value <= 0) return;

      // set default colour for all countries
      self.worldMap.setCountryColor(countryCode, defaultCountyColour);

      // if the "Per 1M capita" checbox checked, then divide all values on country population
      if (self.perCapitaCheckbox.checked()) {
        let populationRow = self.populationData.findRow(countryCode, 'ISO');
        if (!populationRow) return;
        let population = populationRow.getNum('Population');
        value = value / population;
      }

      // Seve values for each country to use in this.worldMap.onCountryHover callback
      self.dataPoints[countryCode] = value;

      // Set colour alpha according to the value
      let c = color('red');
      c.setAlpha(map(value, minValue, maxValue, 50, 255));

      // Set an individual style for each country
      self.worldMap.setCountryColor(countryCode, c.toString());
    });
  }
}
