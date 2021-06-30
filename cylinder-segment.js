CylinderSegment = function(webgl, start, stop, colour) {
  this.webgl = webgl;
  this.start = start;
  this.stop = stop;
  this.colour = colour;

  this.draw = function() {
    var start = this.start;
    var stop = this.stop;
    var webgl = this.webgl;
    var scale = 100;
    var height = 20;

    webgl.fill(this.colour);

    // Top face

    webgl.beginShape();
    webgl.vertex(0, 0, 0);
    for (let j = 0; j <= 25; j++) {
      var theta = (stop - start) * j / 25 + start;
      webgl.vertex(cos(theta) * scale, sin(theta) * scale, 0);
    }
    webgl.endShape(CLOSE);

    // Bottom face

    webgl.beginShape();
    webgl.vertex(0, 0, height);
    for (let j = 0; j <= 25; j++) {
      var theta = (stop - start) * j / 25 + start;
      webgl.vertex(cos(theta) * scale, sin(theta) * scale, height);
    }
    webgl.endShape(CLOSE);

    // WALLS
    webgl.noStroke();

    for (let j = 0; j <= 25-1; j++) {
      webgl.beginShape();

      var theta = (stop - start) * j / 25 + start;
      webgl.vertex(cos(theta) * scale, sin(theta) * scale, 0);

      var theta = (stop - start) * (j+1) / 25 + start;
      webgl.vertex(cos(theta) * scale, sin(theta) * scale, 0);

      var theta = (stop - start) * j / 25 + start;
      webgl.vertex(cos(theta) * scale, sin(theta) * scale, height);

      webgl.endShape(CLOSE);

      webgl.beginShape();

      var theta = (stop - start) * j / 25 + start;
      webgl.vertex(cos(theta) * scale, sin(theta) * scale, height);

      var theta = (stop - start) * (j+1) / 25 + start;
      webgl.vertex(cos(theta) * scale, sin(theta) * scale, height);

      var theta = (stop - start) * (j+1) / 25 + start;
      webgl.vertex(cos(theta) * scale, sin(theta) * scale, 0);

      webgl.endShape(CLOSE);
    }

    // Inner walls

    webgl.beginShape();
    webgl.vertex(0, 0, 0);
    webgl.vertex(0, 0, height);
    webgl.vertex(cos(start) * scale, sin(start) * scale, height);
    webgl.endShape(CLOSE);

    webgl.beginShape();
    webgl.vertex(cos(start) * scale, sin(start) * scale, height);
    webgl.vertex(cos(start) * scale, sin(start) * scale, 0);
    webgl.vertex(0, 0, 0);
    webgl.endShape(CLOSE);

    webgl.beginShape();
    webgl.vertex(0, 0, 0);
    webgl.vertex(0, 0, height);
    webgl.vertex(cos(stop) * scale, sin(stop) * scale, height);
    webgl.endShape(CLOSE);

    webgl.beginShape();
    webgl.vertex(cos(stop) * scale, sin(stop) * scale, height);
    webgl.vertex(cos(stop) * scale, sin(stop) * scale, 0);
    webgl.vertex(0, 0, 0);
    webgl.endShape(CLOSE);
  }
};
