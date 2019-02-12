function TechDiversityGender() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Tech Diversity: Gender';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'tech-diversity-gender';

  // Locations of margin positions.
  this.pad = 5;
  this.leftMargin = 130;
  this.topMargin = 30;
  this.plotWidth = width - this.leftMargin;
  this.midX = (this.plotWidth / 2) + this.leftMargin;

  // Default visualisation colours.
  this.femaleColour = color(255, 0 ,0);
  this.maleColour = color(0, 255, 0);

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/tech-diversity/gender-2018.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });

  };

  this.setup = function() {
    // Font defaults.
    textSize(16);
  };

  this.destroy = function() {
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Draw Female/Male labels at the top of the plot.
    this.drawCategoryLabels();

    var lineHeight = (height - this.topMargin) / this.data.getRowCount();

    for (var i = 0; i < this.data.getRowCount(); i++) {

      // Calculate the y position for each company.
      var lineY = (lineHeight * i) + this.topMargin;

      // Create an object to store data for the current company.
      var company = {
        // Convert strings to numbers.
        'name': this.data.getString(i, 'company'),
        'female': this.data.getNum(i, 'female'),
        'male': this.data.getNum(i, 'male'),
      };

      // Draw the company name in the left margin.
      fill(0);
      noStroke();
      textAlign('right', 'top');
      text(company.name,
           this.leftMargin - this.pad,
           lineY);

      // Draw female rectangle.
      fill(this.femaleColour);
      rect(this.leftMargin,
           lineY,
           this.mapPercentToWidth(company.female),
           lineHeight - this.pad);

      // Draw male rectangle.
      fill(this.maleColour);
      rect(this.leftMargin + this.mapPercentToWidth(company.female),
           lineY,
           this.mapPercentToWidth(company.male),
           lineHeight - this.pad);
    }

    // Draw 50% line
    stroke(150);
    strokeWeight(1);
    line(this.midX,
         this.topMargin,
         this.midX,
         height);

  };

  this.drawCategoryLabels = function() {
    fill(0);
    noStroke();
    textAlign('left', 'top');
    text('Female',
         this.leftMargin,
         this.pad);
    textAlign('center', 'top');
    text('50%',
         this.midX,
         this.pad);
    textAlign('right', 'top');
    text('Male',
         width,
         this.pad);
  };

  this.mapPercentToWidth = function(percent) {
    return map(percent,
               0,
               100,
               0,
               this.plotWidth);
  };
}
