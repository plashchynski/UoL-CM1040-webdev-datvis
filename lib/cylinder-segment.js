/**
 * Represents a segment of a cylinder
 * @class
 */
CylinderSegment = function() {
  /**
   * Number of graphic primitives used to draw the figure
   * @constant {number}
   * @default
   */
  const DETAILS = 25;

  /**
   * 
   * @param {p5.Renderer} webgl p5.js p5.Renderer object: https://p5js.org/reference/#/p5/createGraphics
   * @param {number} start 
   * @param {number} stop 
   * @param {number} radius
   * @param {number} height 
   * @param {string} colour 
   */
  this.draw = function(webgl, start, stop, radius, height, colour) {
    webgl.noStroke();
    webgl.fill(colour);

    // Top face
    webgl.beginShape();
    webgl.vertex(0, 0, 0);
    for (let j = 0; j <= DETAILS; j++) {
      var theta = (stop - start) * j / DETAILS + start;
      webgl.vertex(cos(theta) * radius, sin(theta) * radius, 0);
    }
    webgl.endShape(CLOSE);

    // Bottom face
    webgl.beginShape();
    webgl.vertex(0, 0, height);
    for (let j = 0; j <= DETAILS; j++) {
      theta = (stop - start) * j / DETAILS + start;
      webgl.vertex(cos(theta) * radius, sin(theta) * radius, height);
    }
    webgl.endShape(CLOSE);

    webgl.colorMode(HSL);
    var hue = webgl.hue(colour);
    var saturation = webgl.saturation(colour);
    var lightness = webgl.lightness(colour);
    webgl.fill(webgl.color(hue, saturation, lightness-10));

    // perimeter walls
    for (let j = 0; j <= DETAILS-1; j++) {
      webgl.beginShape();

      theta = (stop - start) * j / DETAILS + start;
      webgl.vertex(cos(theta) * radius, sin(theta) * radius, 0);

      theta = (stop - start) * (j+1) / DETAILS + start;
      webgl.vertex(cos(theta) * radius, sin(theta) * radius, 0);

      theta = (stop - start) * j / DETAILS + start;
      webgl.vertex(cos(theta) * radius, sin(theta) * radius, height);

      webgl.endShape(CLOSE);

      webgl.beginShape();

      theta = (stop - start) * j / DETAILS + start;
      webgl.vertex(cos(theta) * radius, sin(theta) * radius, height);

      theta = (stop - start) * (j+1) / DETAILS + start;
      webgl.vertex(cos(theta) * radius, sin(theta) * radius, height);

      theta = (stop - start) * (j+1) / DETAILS + start;
      webgl.vertex(cos(theta) * radius, sin(theta) * radius, 0);

      webgl.endShape(CLOSE);
    }

    // Inner walls

    webgl.beginShape();
    webgl.vertex(0, 0, 0);
    webgl.vertex(0, 0, height);
    webgl.vertex(cos(start) * radius, sin(start) * radius, height);
    webgl.endShape(CLOSE);

    webgl.beginShape();
    webgl.vertex(cos(start) * radius, sin(start) * radius, height);
    webgl.vertex(cos(start) * radius, sin(start) * radius, 0);
    webgl.vertex(0, 0, 0);
    webgl.endShape(CLOSE);

    webgl.beginShape();
    webgl.vertex(0, 0, 0);
    webgl.vertex(0, 0, height);
    webgl.vertex(cos(stop) * radius, sin(stop) * radius, height);
    webgl.endShape(CLOSE);

    webgl.beginShape();
    webgl.vertex(cos(stop) * radius, sin(stop) * radius, height);
    webgl.vertex(cos(stop) * radius, sin(stop) * radius, 0);
    webgl.vertex(0, 0, 0);
    webgl.endShape(CLOSE);
  };
};
