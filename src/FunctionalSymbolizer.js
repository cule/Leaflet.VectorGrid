import { VTCircle } from './VTCircle.js'
import { VTPolyline } from './VTPolyline.js'
import { VTPolygon } from './VTPolygon.js'
import { Symbolizer } from './Symbolizer.js'

// This is mostly for compatibility with the `vectorTileLayerStyles`.
// It will be quite inefficient, because new instances need to be created
// rather frequently.

export default const FunctionalSymbolizer = Symbolizer.extend({

	// The constructor takes in a function. This function, in turn, takes in
	// a vector tile feature and outputs one style or an array of styles.
	initialize: function(styleFunction, zoomLevel) {
		this._styleFunction = styleFunction;
		this._zoomLevel = zoomLevel
	}

	render: function(vtFeature, pxPerExtent, renderer) {
		let symbol;
		if (vtFeature.type === 1) { // geometry dimension 1 = point
			symbol = new VTCircle(vtFeature, pxPerExtent);
		} else if (vtFeature.type === 2) { // geometry dimension 2 = line
			symbol = new VTPolyline(vtFeature, pxPerExtent);
		} else if (vtFeature.type === 3) { // geometry dimension 3 = polygon
			symbol = new VTPolygon(vtFeature, pxPerExtent);
		} else {
			throw new Error("Vector tile feature has a non-valid dimension (1 for point, 2 for line, 3 for polygon)");
		}

		// The FunctionalSymbolizer recalculates the styles on every
		// call to render (i.e. on each feature), which is not
		// the most efficient :-(
		let style = this._styleFunction(vtFeature.properties, this._zoomLevel, vtFeature.type);

		/// TODO: run addEventParent here somehow!!!

		this._renderSymbolWithStyles(symbol, renderer, this._circleStyles);

		/// TODO: run addEventParent here somehow!!!
	}

});
