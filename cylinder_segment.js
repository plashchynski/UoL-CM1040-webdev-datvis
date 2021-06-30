cylinderSegment = function(webgl, x, y, width, height, start, stop) {
  const detail = 25;

  let shape = 'cylinderSegment';
  let gId = `${shape}|${start}|${stop}|${detail}|`;

  if (!webgl._renderer.geometryInHash(gId)) {
    const _arc = function() {
      this.strokeIndices = [];

      // if the start and stop angles are not the same, push vertices to the array
      if (start.toFixed(10) !== stop.toFixed(10)) {
        this.vertices.push(new p5.Vector(0.5, 0.5, 0));
        this.uvs.push([0.5, 0.5]);

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

    webgl._renderer.createBuffers(gId, arcGeom);
  }

  const uMVMatrix = webgl._renderer.uMVMatrix.copy();

  try {
    webgl._renderer.uMVMatrix.translate([x, y, 0]);
    webgl._renderer.uMVMatrix.scale(width, height, 1);

    webgl._renderer.drawBuffers(gId);
  } finally {
    webgl._renderer.uMVMatrix = uMVMatrix;
  }

  return this;
};
