sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
], (Controller, Device) => {
	"use strict";

	// Extending the Controller class for our master view
	return Controller.extend("com.demo.ZDemo_MasterDetail.controller.master", {

		onInit: function () {

		},

		// This method is called when we want to set a new map location
		// It extracts the new location data from the event and publishes it on the EventBus
		setMapLocation: function (oEvent) {
			const oSource = oEvent.getSource();
			const oSelectedItem = oSource.getSelectedItem().getBindingContext().getObject();

			// Using object destructuring to extract lat, lng, and locName from the selected item
			const { locLat: lat, locLng: lng, locName: name } = oSelectedItem;

			// Get the EventBus of the owner component (likely the overall app component)
			const oEventBus = this.getOwnerComponent().getEventBus();

			// Create the data object that we want to publish
			// This contains the new map location that we want to set
			const oData = {
				lat,
				lng,
				locName: name
			};

			// Publish the new map location on the EventBus, using the channel "setMapLocation"
			oEventBus.publish("setMapLocation", oData);
		},

		// This method is called when the selection in the list changes
		// It extracts the drinkId of the selected item and uses it to navigate to the detail view
		onSelectionChange: (oEvent) => {
			const sLocId = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("locId");

			// Get the router from the owner component and navigate to the detail view
			// The detail view is expected to be found at the "drinkDetails" route
			// The drinkId of the selected item is passed as a parameter to the route
			// The third parameter defines whether we want to replace the history state
			// If the current device is a phone, this parameter is true (which means the history state is not replaced)
			this.getOwnerComponent().getRouter()
				.navTo("details",
					{ locId: sLocId },
					!Device.system.phone);
		},
	});
});
