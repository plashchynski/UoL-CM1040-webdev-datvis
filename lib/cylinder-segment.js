/**
 * Represents a segment of a cylinder
 * @class
 */
CylinderSegment = function () {
  /**
   * Number of graphic primitives used to draw the figure
   * @constant {number}
   * @default
   */
  const DETAILS = 25;

  /**
   * Draw a cylinder segment
   * @param {p5.Renderer} renderer p5 renderer object provided by [createGraphics](https://p5js.org/reference/#/p5/createGraphics)
   * @param {number} start Staring angle in radians
   * @param {number} stop Ending angle in radians
   * @param {number} radius
   * @param {number} height
   * @param {string} colour
   */
  this.draw = function (renderer, start, stop, radius, height, colour) {
    renderer.noStroke();
    renderer.fill(colour);

    buildTopFaceShape(renderer, start, stop, radius);
    buildBottomFaceShape(renderer, start, stop, radius, height);

    // Darker colour for walls
    let wallColour = changeColourLightness(renderer, colour, -10);
    renderer.fill(wallColour);

    buildRadialWalls(renderer, start, stop, radius, height);
    buildInnerWalls(renderer, start, stop, radius, height);
  };

  /**
   * Change lightness value for colour
   * @param {p5.Renderer} renderer p5 renderer object provided by [createGraphics](https://p5js.org/reference/#/p5/createGraphics)
   * @param {p5.Color} colour colour object to change
   * @param {number} difference lightness difference (could be negative)
   * @returns {p5.Color} changed colour object
   */
  function changeColourLightness(renderer, colour, difference) {
    renderer.colorMode(HSL);
    let hue = renderer.hue(colour);
    let saturation = renderer.saturation(colour);
    let lightness = renderer.lightness(colour);

    return renderer.color(hue, saturation, lightness + difference);
  }

  /**
   * Build top face shape
   * @param {p5.Renderer} renderer p5 renderer object provided by [createGraphics](https://p5js.org/reference/#/p5/createGraphics)
   * @param {number} start Staring angle in radians
   * @param {number} stop Ending angle in radians
   * @param {number} radius
   */
  function buildTopFaceShape(renderer, start, stop, radius) {
    renderer.beginShape();
    renderer.vertex(0, 0, 0);
    for (let j = 0; j <= DETAILS; j++) {
      let theta = ((stop - start) * j) / DETAILS + start;
      renderer.vertex(cos(theta) * radius, sin(theta) * radius, 0);
    }
    renderer.endShape(CLOSE);
  }

  /**
   * Build bottom face shape
   * @param {p5.Renderer} renderer p5 renderer object provided by [createGraphics](https://p5js.org/reference/#/p5/createGraphics)
   * @param {number} start Staring angle in radians
   * @param {number} stop Ending angle in radians
   * @param {number} radius
   * @param {number} height
   */
  function buildBottomFaceShape(renderer, start, stop, radius, height) {
    renderer.beginShape();
    renderer.vertex(0, 0, height);
    for (let j = 0; j <= DETAILS; j++) {
      let theta = ((stop - start) * j) / DETAILS + start;
      renderer.vertex(cos(theta) * radius, sin(theta) * radius, height);
    }
    renderer.endShape(CLOSE);
  }

  /**
   * Build radial (cylindrical) walls
   * https://stackoverflow.com/questions/5608208/generate-coordinates-for-cylinder
   * @param {p5.Renderer} renderer p5 renderer object provided by [createGraphics](https://p5js.org/reference/#/p5/createGraphics)
   * @param {number} start Staring angle in radians
   * @param {number} stop Ending angle in radians
   * @param {number} radius
   * @param {number} height
   */
  function buildRadialWalls(renderer, start, stop, radius, height) {
    for (let j = 0; j <= DETAILS - 1; j++) {
      renderer.beginShape();

      let theta = ((stop - start) * j) / DETAILS + start;
      renderer.vertex(cos(theta) * radius, sin(theta) * radius, 0);

      theta = ((stop - start) * (j + 1)) / DETAILS + start;
      renderer.vertex(cos(theta) * radius, sin(theta) * radius, 0);

      theta = ((stop - start) * j) / DETAILS + start;
      renderer.vertex(cos(theta) * radius, sin(theta) * radius, height);

      renderer.endShape(CLOSE);

      renderer.beginShape();

      theta = ((stop - start) * j) / DETAILS + start;
      renderer.vertex(cos(theta) * radius, sin(theta) * radius, height);

      theta = ((stop - start) * (j + 1)) / DETAILS + start;
      renderer.vertex(cos(theta) * radius, sin(theta) * radius, height);

      theta = ((stop - start) * (j + 1)) / DETAILS + start;
      renderer.vertex(cos(theta) * radius, sin(theta) * radius, 0);

      renderer.endShape(CLOSE);
    }
  }

  /**
   * Build inner walls
   * @param {p5.Renderer} renderer p5 renderer object provided by [createGraphics](https://p5js.org/reference/#/p5/createGraphics)
   * @param {number} start Staring angle in radians
   * @param {number} stop Ending angle in radians
   * @param {number} radius
   * @param {number} height
   */
  function buildInnerWalls(renderer, start, stop, radius, height) {
    renderer.beginShape();
    renderer.vertex(0, 0, 0);
    renderer.vertex(0, 0, height);
    renderer.vertex(cos(start) * radius, sin(start) * radius, height);
    renderer.endShape(CLOSE);

    renderer.beginShape();
    renderer.vertex(cos(start) * radius, sin(start) * radius, height);
    renderer.vertex(cos(start) * radius, sin(start) * radius, 0);
    renderer.vertex(0, 0, 0);
    renderer.endShape(CLOSE);

    renderer.beginShape();
    renderer.vertex(0, 0, 0);
    renderer.vertex(0, 0, height);
    renderer.vertex(cos(stop) * radius, sin(stop) * radius, height);
    renderer.endShape(CLOSE);

    renderer.beginShape();
    renderer.vertex(cos(stop) * radius, sin(stop) * radius, height);
    renderer.vertex(cos(stop) * radius, sin(stop) * radius, 0);
    renderer.vertex(0, 0, 0);
    renderer.endShape(CLOSE);
  }
};
