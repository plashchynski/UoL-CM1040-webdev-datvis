/**
 * Pie chart as a 3D object
 * @class
 * @param {number} x X position of the pie on the canvas
 * @param {number} y X position of the pie on the canvas
 * @param {number} diameter diameter of the pie in pixels
 */
function PieChart3D(x, y, diameter) {
  let self = this;
  this.x = x;
  this.y = y;
  this.diameter = diameter;
  const labelsFontSize = 12;
  const labelsRightMargin = 10;
  // Rotate pi
  const initialRotateDeg = 110;

  // Compute radius and height proportionaly to the diameter
  this.radius = this.diameter / 3;
  this.height = this.diameter / 10;

  // Create an off-screen WEBGL buffer
  this.renderer = createGraphics(diameter, diameter, WEBGL);

  // Create a default camera to be able to rotate the object
  this.camera = this.renderer.createCamera();
  // this.camera.camera(0, 0, (this.height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  this.camera._orbit(0, -1, 10);

  this.draw = function (dataPoints, labels, colours, title) {
    validateDrawParameters(dataPoints, labels, colours);

    this.renderer.clear();

    let angles = arcRadians(dataPoints);
    let isLegendItemHovered = false;
    let lastAngle = radians(initialRotateDeg);

    for (let i = 0; i < angles.length; i++) {
      let colour;
      let height = this.height;
      let start = lastAngle;
      let stop = lastAngle + angles[i] + 0.001;

      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, angles.length, 0, 255);
      }

      if (labels) {
        let label = labels[i];
        let value = dataPoints[i];
        let ySpace = labelsFontSize * 2;
        let x = this.x + 50 + this.diameter / 2;
        let y = this.y + ySpace * i - this.diameter / 3;
        let boxWidth = ySpace / 2;
        let boxHeight = ySpace / 2;

        // render colour box
        fill(colour);
        rect(x, y, boxWidth, boxHeight);

        // render label
        fill('black');
        noStroke();
        textAlign('left', 'center');

        textSize(labelsFontSize);
        text(
          label + ' ' + formatNumber(value) + '%',
          x + boxWidth + labelsRightMargin,
          y + boxWidth / 2
        );

        // Check if label hovered with a mouse
        if (
          mouseX >= x &&
          mouseX <=
            x + boxWidth + labelsRightMargin + label.length * labelsFontSize &&
          mouseY >= y &&
          mouseY <= y + boxHeight
        ) {
          isLegendItemHovered = true;
          height *= 2;
        }
      }

      let slice = new PieSlice3D(this.renderer);
      slice.draw(start, stop, this.radius, height, colour);

      lastAngle += angles[i];
    }

    cursor(isLegendItemHovered ? HAND : ARROW);

    image(
      this.renderer,
      this.x - this.diameter / 2,
      this.y - this.diameter / 2
    );

    if (title) drawTitle(title);

    // Change the 3D object orbit with the mouse
    orbitControl();
  };

  /**
   * Draw a page title
   * @param {string} title
   */
  function drawTitle(title) {
    noStroke();
    textAlign('center', 'center');
    textSize(24);
    text(title, self.x, self.y - self.diameter * 0.6);
  }

  /**
   * Change the 3D object orbit with the mouse
   */
  function orbitControl() {
    if (!isChartHovered()) return;

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
      mouseX >= self.x - self.diameter / 2 &&
      mouseX <= self.x + self.diameter / 2 &&
      mouseY >= self.y - self.diameter / 2 &&
      self.y + self.diameter / 2
    );
  }

  /**
   * Convert array of numbers to proportional arc radians
   * @param {array} data array of numbers
   * @returns {array}
   */
  function arcRadians(data) {
    let total = sum(data);
    let radians = [];

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
    } else if (
      ![labels, colours].every((array) => {
        return array.length == dataPoints.length;
      })
    ) {
      alert(`Data (length: ${dataPoints.length})
            Labels (length: ${labels.length})
            Colours (length: ${colours.length})
            Arrays must be the same length!`);
    }
  }
}
