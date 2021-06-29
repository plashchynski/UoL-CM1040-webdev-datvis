function PieChart3D(x, y, diameter) {

  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 30;
  this.webgl = createGraphics(diameter, diameter, WEBGL);
  // this.webgl.rotateX(-radians(30));

  this.get_radians = function(data) {
    var total = sum(data);
    var radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }

    return radians;
  };

  this.draw = function(data, labels, colours, title) {

    // Test that data is not empty and that each input array is the
    // same length.
    if (data.length == 0) {
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

    var angles = this.get_radians(data);
    var lastAngle = 0;
    var colour;

    this.webgl.clear();
    this.webgl.stroke(0);
    this.webgl.strokeWeight(1);

    for (var i = 0; i < data.length; i++) {
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }

      this.webgl.fill(colour);

      cylinderSegment(this.webgl, -this.webgl.width/2, -this.webgl.height/2,
        this.diameter, this.diameter,
        lastAngle, lastAngle + angles[i] + 0.001);

      if (labels) {
        this.makeLegendItem(labels[i], data[i], i, colour);
      }

      lastAngle += angles[i];
    }

    image(this.webgl, this.x-this.diameter/2, this.y-this.diameter/2);

    if (title) {
      noStroke();
      textAlign('center', 'center');
      textSize(24);
      text(title, this.x, this.y - this.diameter * 0.6);
    }
  };

  this.makeLegendItem = function(label, value, i, colour) {
    var x = this.x + 50 + this.diameter / 2;
    var y = this.y + (this.labelSpace * i) - this.diameter / 3;
    var boxWidth = this.labelSpace / 2;
    var boxHeight = this.labelSpace / 2;

    fill(colour);
    rect(x, y, boxWidth, boxHeight);

    fill('black');
    noStroke();
    textAlign('left', 'center');
    textSize(12);
    text(label + " " + value.toFixed(2) + "%", x + boxWidth + 10, y + boxWidth / 2);
  };
}
