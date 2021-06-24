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
    var parser = new DOMParser();
    this.worldMapSvg = parser.parseFromString(this.worldMapSource.toString(), "image/svg+xml");


    this.worldMapSvg.querySelectorAll(".landxx").forEach(function(el) {
      el.style.stroke = "#ffffff";
      el.style.strokeWidth = 0.5;
      el.style.fillRule = "evenodd";
      el.style.fill = "#c0c0c0";
    });

    this.dailyConfirmedCovidCasesData.rows.forEach(function(row) {
      var Alpha3CountryCode = row.getString("id");
      var countryCodeRow = self.isoCountryCodes.findRow(Alpha3CountryCode, "Alpha-3 code");
      if (countryCodeRow) {
        var Alpha2CountryCode = countryCodeRow.getString("Alpha-2 code");
        console.log(Alpha2CountryCode.toLowerCase());

        self.worldMapSvg.querySelector("#" + Alpha2CountryCode.toLowerCase()).style.fill = "red";

        self.worldMapSvg.querySelectorAll("#" + Alpha2CountryCode.toLowerCase() + " *").forEach(function(el) {
          el.style.fill = "red";
        });
      } else {
        console.log(Alpha3CountryCode);
      }
    });

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
