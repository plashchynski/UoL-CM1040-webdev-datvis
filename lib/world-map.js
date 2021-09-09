/**
 * A political map of Earth in SVG format with countries, borders and
 * methods to colour countries in different colours.
 * @class
 */
function WorldMap() {
  var self = this;

  // Create an inline SVG object of a world map and hide it untill it explicitly show
  // An inline SVG is more flexible in terms of DOM manipulation than
  // an image or an object tag
  loadStrings('./lib/map.svg', function (svg) {
    self.mapDiv = createDiv(svg);
    self.mapDiv.style('visibility', 'hidden');
  });

  /**
   * A callback called from the draw() method when a country hovered with a mouse.
   * @param {string} countryCode
   * @param {string} countryName
   */
  var onCountryHover;

  /**
   * display a map on the p5.js canvas, should be called during setup
   */
  self.show = function() {
    // Make the world map image visible
    self.mapDiv.style('visibility', 'visible');

    // By default, HTML elements overlap p5.js graphics.
    // We need to render p5.js text over the world map to display country-specific statistics.
    // So we change z-order of the map and the p5.js canvas to render the canvas over the map.
    self.oldMapZIndex = self.mapDiv.style('z-index');
    self.oldCanvasZIndex = canvas.style['z-index'];

    const mapZIndex = 1;
    self.mapDiv.style('z-index', mapZIndex);
    canvas.style.setProperty('z-index', mapZIndex+1);

    // Even though we render the p5.js canvas over the map, we need the map to continue receiving
    // mouse hover events to have specified in CSS border decoration work
    // So we make the p5.js canvas transparent to mouse events
    self.oldCanvasPointerEventsValue = canvas.style['pointer-events'];
    canvas.style.setProperty('pointer-events', 'none');
  };

  /**
   * Place map in the specific position on the canvas
   * @param {number} x 
   * @param {number} y 
   */
  self.position = function(x, y) {
    if (!x && !y) {
      return self.mapDiv.position();
    }

    return self.mapDiv.position(x, y);
  };

  /**
   * @returns [{object}] object's size
   */
  self.size = function() {
    return self.mapDiv.size();
  };

  /**
   * Hide the map and return back all changed global parameters
   */
  self.hide = function() {
    self.mapDiv.style('visibility', 'hidden');
    self.mapDiv.style('z-index', self.oldMapZIndex);

    canvas.style.setProperty('z-index', self.oldCanvasZIndex);
    canvas.style.setProperty('pointer-events', self.oldCanvasPointerEventsValue);
  };

  /**
   * Colour a country in a specific colour
   * @param {string} countryCode two-letter country codes
   * @param {string} colour colour in CSS format
   */
  self.setCountryColor = function(countryCode, colour) {
    countryCode = countryCode.toLocaleLowerCase();
    var elements = selectAll('#' + countryCode + ', #' + countryCode + ' *', self.mapDiv);
    for (var i = 0; i < elements.length; i++) {
      elements[i].style('fill', colour);
    }
  };

  self.draw = function() {
    // if a onCountryHover callback function is assigned, check if any country is hovered by
    // mouse and call the callback
    if (self.onCountryHover) {
      checkCountryHover();
    }
  };

  /**
   * check if any country region is hovered by mouse, call the callback
   */
  function checkCountryHover() {
    var hoveredRegion = select('svg>path:hover,svg>g:hover', self.mapDiv);
    if (!hoveredRegion)
      return;

    var countryNameTag = select('name', hoveredRegion);
    var countryCode = hoveredRegion.id();
    if (!countryNameTag || !countryCode)
      return;

    var countryName = countryNameTag.html();
    self.onCountryHover(countryCode.toUpperCase(), countryName);
  }
}
