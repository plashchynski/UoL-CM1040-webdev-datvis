/**
 * Pie chart as a 3D object
 * @class
 * @param {*} x X position of the pie on the canvas
 * @param {*} y X position of the pie on the canvas
 * @param {*} diameter diameter of the pie in pixels
 */
function PieChart3D(x, y, diameter) {
  var self = this;
  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 30;
  this.webgl = createGraphics(diameter, diameter, WEBGL);
  this.camera = this.webgl.createCamera();
  this.camera._orbit(0, -1, 10);

  this.draw = function(dataPoints, labels, colours, title) {
    validateDrawParameters(dataPoints, labels, colours);

    var angles = arcRadians(dataPoints);
    var isLegendItemHovered = false;
    var lastAngle = 0;
    var colour;
    var scale = 100;

    this.webgl.clear();

    for (var i = 0; i < angles.length; i++) {
      var height = 30;
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, angles.length, 0, 255);
      }

      var start = lastAngle;
      var stop = lastAngle + angles[i] + 0.001;

      if (labels) {
        label = labels[i];
        value = dataPoints[i];
        var x = this.x + 50 + this.diameter / 2;
        var y = this.y + (this.labelSpace * i) - this.diameter / 3;
        var boxWidth = this.labelSpace / 2;
        var boxHeight = this.labelSpace / 2;
    
        fill(colour);
        rect(x, y, boxWidth, boxHeight);
    
        fill('black');
        noStroke();
        textAlign('left', 'center');
    
        const labelFontSize = 12;
        if (mouseX >= x && mouseX <= x + boxWidth + 10 + label.length * 12 &&
            mouseY >= y && mouseY <= y + boxHeight)
        {
          isLegendItemHovered = true;
          height *= 2;
        }

        textSize(labelFontSize);
        text(label + ' ' + value.toFixed(2) + '%', x + boxWidth + 10, y + boxWidth / 2);
      }

      var segment = new CylinderSegment(this.webgl, start, stop, height, scale, colour);
      segment.draw();

      lastAngle += angles[i];
    }

    if (isLegendItemHovered) {
      cursor(HAND);
    } else {
      cursor(ARROW);
    }

    image(this.webgl, this.x-this.diameter/2, this.y-this.diameter/2);

    if (title) {
      noStroke();
      textAlign('center', 'center');
      textSize(24);
      text(title, this.x, this.y - this.diameter * 0.6);
    }

    orbitControl();
  };

  /**
   * Change the 3D object orbit with the mouse
   */
  function orbitControl() {
    if (!isChartHovered())
      return;

    cursor('grab');

    if (mouseIsPressed) {
      cursor('grabbing');

      let deltaTheta = -(mouseX - pmouseX) * 0.01;
      let deltaPhi = (mouseY - pmouseY) * 0.01;

      self.camera._orbit(deltaTheta, deltaPhi, 0);
    }
  }

  /**
   * @returns {boolean} true if the chart object hovered with a mouse
   */
  function isChartHovered() {
    return (
      mouseX >= self.x-self.diameter/2 && mouseX <= self.x+self.diameter/2 &&
      mouseY >= self.y-self.diameter/2 && self.y+self.diameter/2
    );
  }

  /**
   * Convert array of numbers to proportional arc radians
   * @param {array} data array of numbers
   * @returns {array}
   */
  function arcRadians(data) {
    var total = sum(data);
    var radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }

    return radians;
  }

  /**
   * Validate input parameters for the draw method
   * @param {array} dataPoints 
   * @param {array} labels 
   * @param {array} colours 
   */
  function validateDrawParameters(dataPoints, labels, colours) {
    // Test that data is not empty and that each input array is the
    // same length.
    if (dataPoints.length == 0) {
      alert('Data has length zero!');
    } else if (![labels, colours].every((array) => {
      return array.length == dataPoints.length;
    })) {
      alert(`Data (length: ${dataPoints.length})
            Labels (length: ${labels.length})
            Colours (length: ${colours.length})
            Arrays must be the same length!`);
    }
  }
}
