{
	// Convert Selected Properties to Markers.jsx
	// 
	// For each layer that contains selected properties, convert the value of the property at each
	// frame time to an event cue point.
	
	function ConvertSelectedPropertiesToMarkers()
	{
		var scriptName = "Convert Selected Properties to Markers";
		var propsSkipped = new Array();
		
		
		function ConvertPropertyToMarkers(markerStream, prop)
		{
			// Only do properties, not property groups.
			if (!(prop instanceof Property)) {
				return;
			}
		
			// Custom/No_Value property types are not supported, so skip gracefully (but log so we can display useful error message later).
			if ((prop.propertyValueType == PropertyValueType.CUSTOM_VALUE) || (prop.propertyValueType == PropertyValueType.NO_VALUE)) {
				// Log just the first 10 custom properties, as we don't want to display too big of an error message dialog to the user,
				if (propsSkipped.length <= 10) {
					propsSkipped[propsSkipped.length] = prop.parentProperty.name + " > " + prop.name;
				}
				return;
			}
			
			
			function GenerateIDPathForProp(prop)
			{
				return prop.parentProperty.name + "_" + prop.name;
			}
			
			
			function PrintPropToParmsAtTime(parms, prop, time)
			{
				parms[GenerateIDPathForProp(prop)] = prop.valueAtTime(time, false);
			}
			
			
			function SampleAtTime(markerStream, prop, time)
			{
				var existingMarker = markerStream.valueAtTime(time, false);
				var curParms = existingMarker.getParameters();
				PrintPropToParmsAtTime(curParms, prop, time);
				existingMarker.setParameters(curParms);
				existingMarker.cuePointName = time;			// added in 9.0.1 update
				markerStream.setValueAtTime(time, existingMarker); 		
			}
			
			
			// Sample the whole property,
			var owningLayer = prop;
			for (var depth = prop.propertyDepth; depth > 0; --depth) {
				owningLayer = owningLayer.parentProperty;
			}
			if (prop.expressionEnabled) {
				// For properties with enabled expressions, add markers at each frame between the In and Out points.
				var curTime = owningLayer.inPoint;
				var outTime = owningLayer.outPoint;
				for ( ; curTime <= outTime; curTime += owningLayer.containingComp.frameDuration) {
					SampleAtTime(markerStream, prop, curTime);
				}
			} else {
				// Look just between the first and last keyframes.
				if (prop.numKeys) {
					for (var i = 1; i <= prop.numKeys; ++i) {
						var keyTime = prop.keyTime(i);
						SampleAtTime(markerStream, prop, keyTime);
					}
				} else {
					SampleAtTime(markerStream, prop, owningLayer.startTime);
				}
			}
		}
		
		if (app.project && app.project.activeItem && app.project.activeItem instanceof CompItem) {
			// Process the active composition's layers that have selected properties.
			app.beginUndoGroup(scriptName);
			var layerColl = app.project.activeItem.layers;
			for (var i = 1; i <= layerColl.length; ++i) {
				var curLayer = layerColl[i];
				if (curLayer.selectedProperties && curLayer.selectedProperties.length > 0) {
					var selProps = curLayer.selectedProperties;
					for (var propIdx = 0; propIdx < selProps.length; ++propIdx ) {
						ConvertPropertyToMarkers(curLayer.marker, selProps[propIdx]);
					}
				}
			}
			app.endUndoGroup();
			
			// Display any errors to the user (show only the first 10).
			if (propsSkipped.length > 0) {
				var errorStr = "Custom properties and properties with no value are not supported at this time, and did not get converted.\r\rSelected properties skipped include:\r";
				for (var i=0; i<propsSkipped.length; i++) {
					errorStr += propsSkipped[i] + "\r";
				}
				alert(errorStr, scriptName);
			}
		}
	}
	
	
	ConvertSelectedPropertiesToMarkers();
}
