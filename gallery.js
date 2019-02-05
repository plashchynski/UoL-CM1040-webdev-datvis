function Gallery() {

  this.figures = [];
  this.selectedFigure = null;

  // Add a new figure to the navigation bar.
  this.addFigure = function(fig) {

    // Check that the figure object has an id and name.
    if (!fig.hasOwnProperty('id')
        && !fig.hasOwnProperty('name')) {
      alert('Make sure your figure has an id and name!');
    }

    // Check that the figure object has a unique id.
    if (this.findFigureIndex(fig.id) != null) {
      alert(`Figure '${fig.name}' has a duplicate id: '${fig.id}'`);
    }

    this.figures.push(fig);

    // Create menu item.
    var menuItem = document.createElement('li');
    menuItem.classList.add('ui-menu-item');

    var menuItemWrapper = document.createElement('div');
    menuItemWrapper.classList.add('ui-menu-item-wrapper');
    menuItemWrapper.setAttribute('role', 'menuitem');
    menuItemWrapper.innerHTML = fig.name;

    menuItem.setAttribute('value', fig.id);

    menuItem.appendChild(menuItemWrapper);
    $('#figure-menu').append(menuItem);

    // Preload data if necessary.
    if (fig.hasOwnProperty('preload')) {
      fig.preload();
    }
  };

  this.findFigureIndex = function(figId) {
    // Search through the figures looking for one with the id
    // matching figId.
    for (var i = 0; i < this.figures.length; i++) {
      if (this.figures[i].id == figId) {
        return i;
      }
    }

    // Figure not found.
    return null;
  };

  this.selectFigure = function(figId){
    var figureIndex = this.findFigureIndex(figId);

    if (figureIndex != null) {
      // If the figure has a deselect method run it.
      if (this.selectedFigure != null
          && this.selectedFigure.hasOwnProperty('destroy')) {
        this.selectedFigure.destroy();
      }
      // Select the figure in the gallery.
      this.selectedFigure = this.figures[figureIndex];

      // Initialise visualisation if necessary.
      if (this.selectedFigure.hasOwnProperty('setup')) {
        this.selectedFigure.setup();
      }
    }
  };
}
