/**
 * Pie chart as a 3D object
 * @class
 * @param {*} x X position of the pie on the canvas
 * @param {*} y X position of the pie on the canvas
 * @param {*} diameter diameter of the pie in pixels
 */
function PieChart3D(x, y, diameter) {
  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 30;
  this.webgl = createGraphics(diameter, diameter, WEBGL);
  this.camera = this.webgl.createCamera();
  this.camera._orbit(0, -1, 10);

  this.draw = function(dataPoints, labels, colours, title) {

    // Test that data is not empty and that each input array is the
    // same length.
    if (dataPoints.length == 0) {
      alert('Data has length zero!');
    } else if (![labels, colours].every((array) => {
      return array.length == data.length;
    })) {
      alert(`Data (length: ${data.length})
Labels (length: ${labels.length})
Colours (length: ${colours.length})
Arrays must be the same length!`);
    }

    // https://p5js.org/examples/form-pie-chart.html

    var angles = arcRadians(dataPoints);
    var lastAngle = 0;
    var colour;
    var scale = 100;

    this.webgl.clear();

    var legendItemHovered = false;
    for (var i = 0; i < angles.length; i++) {
      var height = 30;
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }

      var start = lastAngle;
      var stop = lastAngle + angles[i] + 0.001;
      

      if (labels) {
        label = labels[i];
        value = data[i];
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
          legendItemHovered = true;
          height *= 2;
        }

        textSize(labelFontSize);
    
        text(label + ' ' + value.toFixed(2) + '%', x + boxWidth + 10, y + boxWidth / 2);
      }

      var segment = new CylinderSegment(this.webgl, start, stop, height, scale, colour);
      segment.draw();

      lastAngle += angles[i];
    }

    if (legendItemHovered) {
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

    if (mouseX >= this.x-this.diameter/2 && mouseX <= this.x+this.diameter/2 &&
        mouseY >= this.y-this.diameter/2 && this.y+this.diameter/2)
    {
      if (mouseIsPressed) {
        cursor('grabbing');

        let deltaTheta = -(mouseX - pmouseX) * 0.01;
        let deltaPhi = (mouseY - pmouseY) * 0.01;

        this.camera._orbit(deltaTheta, deltaPhi, 0);
      } else {
        cursor('grab');
      }
    }
  };

  /**
   * Convert array of numbers to arc radians
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

}
