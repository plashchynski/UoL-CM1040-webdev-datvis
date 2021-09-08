function WorldMap() {
  var self = this;

  // Create an inline SVG object of a world map and hide it untill it explicitly show
  // An inline SVG is more flexible in terms of DOM manipulation than
  // an image or an object tag
  loadStrings('./data/covid-19/map.svg', function (svg) {
    self.mapDiv = createDiv(svg);
    self.mapDiv.style('visibility', 'hidden');
  });

  self.show = function(x, y) {
    // Make the world map image visible
    self.mapDiv.style('visibility', 'visible');
    self.mapDiv.position(350, 70);

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
    canvas.style.setProperty('pointer-events', 'none');
  };

  // Hide the map and return back all changed global parameters
  self.hide = function() {
    self.mapDiv.style('visibility', 'hidden');
    self.mapDiv.style('z-index', self.oldMapZIndex);
    canvas.style.setProperty('z-index', self.oldCanvasZIndex);
  };
}
