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
        self.worldMapSourceLoaded = true;
      }
    );
  };

  this.render_map = function() {
    self = this;

    // parse map svg sources to DOM document
    var parser = new DOMParser();
    this.worldMapSvg = parser.parseFromString(this.worldMapSource.toString(), "image/svg+xml");


    // reset map styles
    this.worldMapSvg.querySelectorAll(".landxx").forEach(function(el) {
      el.style.stroke = "#ffffff";
      el.style.strokeWidth = 0.5;
      el.style.fillRule = "evenodd";
      el.style.fill = "#c0c0c0";
    });


    // generate individual style for each country
    var mapData = [];

    var lastDate = this.dailyConfirmedCovidCasesData.columns[this.dailyConfirmedCovidCasesData.columns.length-1];
    var maxValue = max(this.dailyConfirmedCovidCasesData.getColumn(lastDate).map(Number));
    var minValue = min(this.dailyConfirmedCovidCasesData.getColumn(lastDate).map(Number));

    this.dailyConfirmedCovidCasesData.rows.forEach(function(row) {
      var Alpha3CountryCode = row.getString("id");
      var countryCodeRow = self.isoCountryCodes.findRow(Alpha3CountryCode, "Alpha-3 code");
      if (countryCodeRow) {
        var Alpha2CountryCode = countryCodeRow.getString("Alpha-2 code");

        var value = Number(row.getNum(lastDate));

        var c = color('red');
        c.setAlpha(map(value, minValue, maxValue, 100, 255));
        mapData.push({
          countryCode: Alpha2CountryCode.toLowerCase(),
          colour: c.toString()
        });
      }
    });

    // set country individual styles
    mapData.forEach(function(countryData) {
      self.worldMapSvg.querySelector("#" + countryData.countryCode).style.fill = countryData.colour;

      self.worldMapSvg.querySelectorAll("#" + countryData.countryCode + " *").forEach(function(el) {
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
    if (!this.worldMapSourceLoaded || !this.isoCountryCodesLoaded || !this.dailyConfirmedCovidCasesDataLoaded) {
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
