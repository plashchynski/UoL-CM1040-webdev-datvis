function TechDiversityRace() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Tech Diversity: Race';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'tech-diversity-race';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/tech-diversity/race-2018.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  this.setup = function() {
    // TODO: Make select.
  };

  // Create a new pie chart object.
  this.pie = new PieChart(width / 2, height / 2, width * 0.4);

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    var row =this.data.findRow('Facebook', 'company');

    // Get the value of the first column (company name).
    var companyName = row.getString(0);

    // Convert the rest of the row data from strings to numbers.
    var rowData = sliceNumbers(row, 1);

    // Copy the data labels from the table (all the column names minus
    // the first one).
    var labels = this.data.columns.slice(1);

    var colours = ['blue', 'red', 'green', 'pink', 'purple', 'yellow'];

    this.pie.draw(rowData, labels, colours);
  };
}
