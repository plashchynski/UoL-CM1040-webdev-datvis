CylinderSegment = function(webgl, start, stop, height, scale, colour, details) {
  this.webgl = webgl;
  this.start = start;
  this.stop = stop;
  this.colour = colour;
  this.height = height;
  this.scale = scale;
  this.details = details || 25;

  this.draw = function() {
    // make a local copy of all variable to make a code less messy
    var start = this.start;
    var stop = this.stop;
    var webgl = this.webgl;
    var scale = this.scale;
    var height = this.height;
    var details = this.details;

    webgl.noStroke();
    webgl.fill(this.colour);

    // Top face
    webgl.beginShape();
    webgl.vertex(0, 0, 0);
    for (let j = 0; j <= details; j++) {
      var theta = (stop - start) * j / details + start;
      webgl.vertex(cos(theta) * scale, sin(theta) * scale, 0);
    }
    webgl.endShape(CLOSE);

    // Bottom face
    webgl.beginShape();
    webgl.vertex(0, 0, height);
    for (let j = 0; j <= details; j++) {
      theta = (stop - start) * j / details + start;
      webgl.vertex(cos(theta) * scale, sin(theta) * scale, height);
    }
    webgl.endShape(CLOSE);

    webgl.colorMode(HSL);
    var hue = webgl.hue(this.colour);
    var saturation = webgl.saturation(this.colour);
    var lightness = webgl.lightness(this.colour);
    webgl.fill(webgl.color(hue, saturation, lightness-10));

    // perimeter walls
    for (let j = 0; j <= details-1; j++) {
      webgl.beginShape();

      theta = (stop - start) * j / details + start;
      webgl.vertex(cos(theta) * scale, sin(theta) * scale, 0);

      theta = (stop - start) * (j+1) / details + start;
      webgl.vertex(cos(theta) * scale, sin(theta) * scale, 0);

      theta = (stop - start) * j / details + start;
      webgl.vertex(cos(theta) * scale, sin(theta) * scale, height);

      webgl.endShape(CLOSE);

      webgl.beginShape();

      theta = (stop - start) * j / details + start;
      webgl.vertex(cos(theta) * scale, sin(theta) * scale, height);

      theta = (stop - start) * (j+1) / details + start;
      webgl.vertex(cos(theta) * scale, sin(theta) * scale, height);

      theta = (stop - start) * (j+1) / details + start;
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
  };
};
