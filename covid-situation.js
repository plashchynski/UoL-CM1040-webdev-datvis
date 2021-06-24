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

    this.isoCountryCodes = loadTable(
      './data/covid-19/wikipedia-iso-country-codes.csv', 'csv', 'header',
      function(table) {
        self.isoCountryCodesLoaded = true;
      });


    this.dailyConfirmedCovidCasesData = loadTable(
      './data/covid-19/daily_confirmed_covid_cases.csv', 'csv', 'header',
      function(table) {
        self.dailyConfirmedCovidCasesDataLoaded = true;
      });

    this.worldMapSource = loadStrings(
      'lib/BlankMap-World.svg',
      function () {
        // parse map svg sources to DOM document
        var parser = new DOMParser();
        self.worldMapSvg = parser.parseFromString(self.worldMapSource.toString(), "image/svg+xml");
        self.worldMapSourceLoaded = true;

        // reset map styles
        self.worldMapSvg.querySelectorAll(".landxx,.subxx,.circlexx,.limitxx").forEach(function(el) {
          el.style.stroke = "#ffffff";
          el.style.strokeWidth = 0.5;
          el.style.fillRule = "evenodd";
          el.style.fill = "#c0c0c0";
        });
      }
    );
  };

  this.render_map = function() {
    var self = this;


    // generate individual style for each country
    var mapData = [];

    this.date = this.dailyConfirmedCovidCasesData.columns[this.dateSlider.value()+2];
    var maxValue = max(this.dailyConfirmedCovidCasesData.getColumn(this.date).map(Number));
    var minValue = min(this.dailyConfirmedCovidCasesData.getColumn(this.date).map(Number));

    this.dailyConfirmedCovidCasesData.rows.forEach(function(row) {
      var Alpha3CountryCode = row.getString("id");
      var countryCodeRow = self.isoCountryCodes.findRow(Alpha3CountryCode, "Alpha-3 code");
      if (countryCodeRow) {
        var Alpha2CountryCode = countryCodeRow.getString("Alpha-2 code");

        var countryCode = Alpha2CountryCode.toLowerCase();

        self.worldMapSvg.querySelectorAll("#" + countryCode + ", #" + countryCode + " *").forEach(function(el) {
          el.style.fill = "#c0c0c0";
        });

        var value = Number(row.getNum(self.date));
        if (value <= 0) {
          return;
        }
        var c = color('red');
        c.setAlpha(map(value, minValue, maxValue, 50, 255));
        mapData.push({
          countryCode: countryCode,
          colour: c.toString()
        });
      }
    });

    // set country individual styles
    mapData.forEach(function(countryData) {
      self.worldMapSvg.querySelectorAll("#" + countryData.countryCode + ", #" + countryData.countryCode + " *").forEach(function(el) {
        el.style.fill = countryData.colour;
      });
    });

    // update map image
    var svgElement = this.worldMapSvg.querySelector('svg');
    var clonedSvgElement = svgElement.cloneNode(true);
    var outerHTML = clonedSvgElement.outerHTML,
        blob = new Blob([outerHTML],{type:'image/svg+xml;charset=utf-8'});
    var URL = window.URL || window.webkitURL || window;
    var blobURL = URL.createObjectURL(blob);

    this.img = loadImage(blobURL);
  }


  this.setup = function() {
    var self = this;

    if (!this.worldMapSourceLoaded || !this.isoCountryCodesLoaded || !this.dailyConfirmedCovidCasesDataLoaded) {
      console.log('Data not yet loaded');
      return;
    }

    var daysCount = this.dailyConfirmedCovidCasesData.columns.length - 3;
    this.dateSlider = createSlider(0, daysCount, daysCount, 1);
    this.dateSlider.position(400, 20);

    this.render_map();

    this.dateSlider.input(function () {
      self.render_map();
    });
  };
  

  this.destroy = function() {

  };

  this.draw = function() {
    image(this.img, 50, 100, 826, 419);

    var parts = this.date.split('/');
    var date = new Date(("20" + parts[2]), parts[0], parts[1])
    text(date.toDateString(), 110, 50);
  };
}
