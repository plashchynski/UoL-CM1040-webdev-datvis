p5.RendererGL.prototype.cylinderSegment = function(args) {
  const x = arguments[0];
  const y = arguments[1];
  const width = arguments[2];
  const height = arguments[3];
  const start = arguments[4];
  const stop = arguments[5];
  const mode = arguments[6];
  const detail = arguments[7] || 25;

  let shape;
  let gId;

  // check if it is an ellipse or an arc
  if (Math.abs(stop - start) >= constants.TWO_PI) {
    shape = 'ellipse';
    gId = `${shape}|${detail}|`;
  } else {
    shape = 'arc';
    gId = `${shape}|${start}|${stop}|${mode}|${detail}|`;
  }

  if (!this.geometryInHash(gId)) {
    const _arc = function() {
      this.strokeIndices = [];

      // if the start and stop angles are not the same, push vertices to the array
      if (start.toFixed(10) !== stop.toFixed(10)) {
        // if the mode specified is PIE or null, push the mid point of the arc in vertices
        if (mode === constants.PIE || typeof mode === 'undefined') {
          this.vertices.push(new p5.Vector(0.5, 0.5, 0));
          this.uvs.push([0.5, 0.5]);
        }

        // vertices for the perimeter of the circle
        for (let i = 0; i <= detail; i++) {
          const u = i / detail;
          const theta = (stop - start) * u + start;

          const _x = 0.5 + Math.cos(theta) / 2;
          const _y = 0.5 + Math.sin(theta) / 2;

          this.vertices.push(new p5.Vector(_x, _y, 0));
          this.uvs.push([_x, _y]);

          if (i < detail - 1) {
            this.faces.push([0, i + 1, i + 2]);
            this.strokeIndices.push([i + 1, i + 2]);
          }
        }

        // check the mode specified in order to push vertices and faces, different for each mode
        switch (mode) {
          case constants.PIE:
            this.faces.push([
              0,
              this.vertices.length - 2,
              this.vertices.length - 1
            ]);
            this.strokeIndices.push([0, 1]);
            this.strokeIndices.push([
              this.vertices.length - 2,
              this.vertices.length - 1
            ]);
            this.strokeIndices.push([0, this.vertices.length - 1]);
            break;

          case constants.CHORD:
            this.strokeIndices.push([0, 1]);
            this.strokeIndices.push([0, this.vertices.length - 1]);
            break;

          case constants.OPEN:
            this.strokeIndices.push([0, 1]);
            break;

          default:
            this.faces.push([
              0,
              this.vertices.length - 2,
              this.vertices.length - 1
            ]);
            this.strokeIndices.push([
              this.vertices.length - 2,
              this.vertices.length - 1
            ]);
        }
      }
    };

    const arcGeom = new p5.Geometry(detail, 1, _arc);
    arcGeom.computeNormals();

    if (detail <= 50) {
      arcGeom._makeTriangleEdges()._edgesToVertices(arcGeom);
    } else if (this._doStroke) {
      console.log(
        `Cannot apply a stroke to an ${shape} with more than 50 detail`
      );
    }

    this.createBuffers(gId, arcGeom);
  }

  const uMVMatrix = this.uMVMatrix.copy();

  try {
    this.uMVMatrix.translate([x, y, 0]);
    this.uMVMatrix.scale(width, height, 1);

    this.drawBuffers(gId);
  } finally {
    this.uMVMatrix = uMVMatrix;
  }

  return this;
};


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

    for (var i = 0; i < data.length; i++) {
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }
      // arc(this.x, this.y,
      //     this.diameter, this.diameter,
      //     lastAngle, lastAngle + angles[i] + 0.001); // Hack for 0!

      this.webgl.clear();
      // this.webgl.cylinder(150, 30, 24, 1, true, true);
      // this.webgl.arc

      this.webgl.fill(colour);
      this.webgl.stroke(0);
      this.webgl.strokeWeight(1);

      cylinderSegment(this.webgl, this.x-this.diameter-100, this.y-this.diameter+100,
        this.diameter-40, this.diameter-40,
        lastAngle, lastAngle + angles[i] + 0.001);

      // var geom = new p5.Geometry(24, 1);

      // var ringRadius = 150;
      // var detailX = 24;
      // for (var ii = 0; ii < detailX; ++ii) {

      //   const u = ii / (detailX - 1);
      //   const ur = 2 * Math.PI * u;
      //   const sur = Math.sin(ur);
      //   const cur = Math.cos(ur);

      //   geom.vertices.push(new p5.Vector(sur * ringRadius, y, cur * ringRadius));
      // }

      // geom._makeTriangleEdges()._edgesToVertices();
      // this.webgl._renderer.createBuffers('test', geom);
      // this.webgl._renderer.drawBuffersScaled('test', 150, 30, 1);


      image(this.webgl, this.x-this.diameter/2, this.y-this.diameter/2);

      if (labels) {
        this.makeLegendItem(labels[i], data[i], i, colour);
      }

      lastAngle += angles[i];
    }

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
