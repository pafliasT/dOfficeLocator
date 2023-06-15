sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel",
	],
	(Controller, MessageBox, JSONModel) => {
		"use strict";

		// Extend the base Controller
		return Controller.extend("com.demo.ZDemo_MasterDetail.controller.detail", {
			// Initialization function called when the Controller instance is created
			onInit: function () {
				// Initialize instance variables
				this.lattitude;
				this.longitude;
				this.map;
				this.marker;

				// Define the possible terrains
				const oTerrains = {
					Terrains: [
						{
							TerrainID: "roadmap",
							Name: "Normal",
						},
						{
							TerrainID: "satellite",
							Name: "Satellite",
						},
						{
							TerrainID: "hybrid",
							Name: "Cities and Satellite",
						},
						{
							TerrainID: "terrain",
							Name: "Mountain and Rivers",
						},
					],
				};

				// Set the Terrains model
				this.getView().setModel(new JSONModel(oTerrains), "Terrains");

				// Set the Offices model from the locations.json file
				this.getOwnerComponent().setModel(new JSONModel("model/locations.json"), "Offices");

				// Register the setMapLocation function to be called when the "setMapLocation" event is published
				const oEventBus = this.getOwnerComponent().getEventBus();
				oEventBus.subscribe("setMapLocation", this.setMapLocation.bind(this));
			},

			// Function to start the map
			startMap: function () {
				// Initialize the map
				this.map = new google.maps.Map(
					this.byId(this.getView().createId("map")).getDomRef(),
					{
						center: { lat: 40.573493620199734, lng: 22.997747531410702 },
						zoom: 15,
					}
				);

				// Define the image for the marker
				const image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

				// Initialize the marker
				const marker = new google.maps.Marker({
					position: { lat: 40.573493620199734, lng: 22.997747531410702 },
					map: this.map,
					animation: google.maps.Animation.DROP,
					title: "DACC",
					icon: image,
				});

				// Show a MessageBox with the location
				MessageBox.show(
					"Latitude: 40.573493620199734 & Longitude: 22.997747531410702",
					{
						icon: MessageBox.Icon.INFORMATION,
						title: "Location: DACC",
					}
				);

				// Enable zooming in on the marker
				this.enableZoom(marker);
			},

			// Function to get the user's location
			getLocation: function () {
				if (navigator.geolocation) {
					// Geolocation options
					const options = {
						enableHighAccuracy: true,
						timeout: 5000,
						maximumAge: 0,
					};

					// Request the current position
					navigator.geolocation.getCurrentPosition(
						this.onFindingLocation.bind(this), // Success handler
						this.error.bind(this), // Error handler
						options // Options
					);
				} else {
					x.innerHTML = "Geolocation is not supported by this browser.";
				}
			},

			// Handler function called when the location has been found
			onFindingLocation: function (pos) {
				// Save the latitude and longitude
				this.lattitude = pos.coords.latitude;
				this.longitude = pos.coords.longitude;

				// Center the map on the new location
				this.map.setCenter({ lat: this.lattitude, lng: this.longitude });
				this.map.setZoom(15);

				// Define the image for the marker
				const image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

				// Initialize the marker
				const marker = new google.maps.Marker({
					position: { lat: this.lattitude, lng: this.longitude },
					map: this.map,
					animation: google.maps.Animation.DROP,
					title: "User Location",
					icon: image,
				});

				// Show a MessageBox with the location
				MessageBox.show(
					`Latitude: ${this.lattitude} & Longitude: ${this.longitude}`,
					{
						icon: MessageBox.Icon.SUCCESS,
						title: "User Location Found",
					}
				);

				// Enable zooming in on the marker
				this.enableZoom(marker);
			},

			// Function to enable zooming in on a marker when it is clicked
			enableZoom: function (marker) {
				google.maps.event.addListener(
					marker,
					"click",
					() => {
						const pos = this.map.getZoom();
						this.map.setZoom(18);
						this.map.setCenter(marker.getPosition());
						window.setTimeout(
							() => {
								this.map.setZoom(pos);
							},
							3000
						);
					}
				);
			},

			// Function to handle terrain changes
			onTerrainChange: function (oEvent) {
				// Set the map type ID to the selected item's key
				this.map.setMapTypeId(oEvent.getParameters().selectedItem.getKey());
			},

			// Function to set the map location
			setMapLocation: function (oEvent, sName, oData) {
				// Extract the latitude, longitude, and location name from the event data
				const lat = oData.lat;
				const lng = oData.lng;
				const name = oData.locName;

				// Update the page title
				this.getView().byId("page").setTitle(`${name} Office`);

				// Center the map on the new location
				this.map.setCenter({ lat: lat, lng: lng });

				// Define the image for the marker
				const image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

				// Initialize the marker
				const marker = new google.maps.Marker({
					position: { lat: lat, lng: lng },
					map: this.map,
					animation: google.maps.Animation.DROP,
					title: name,
					icon: image,
				});

				// Show a MessageBox with the location
				MessageBox.show(
					`Latitude: ${lat} & Longitude: ${lng}`,
					{
						icon: MessageBox.Icon.INFORMATION,
						title: `Delloite Office: ${name}`,
					}
				);

				// Enable zooming in on the marker
				this.enableZoom(marker);
			},

			// Function to toggle the bouncing animation of the marker
			toggleBounce: function () {
				if (marker.getAnimation() !== null) {
					// If the marker is currently animated, stop the animation
					marker.setAnimation(null);
				} else {
					// If the marker is not currently animated, start the bounce animation
					marker.setAnimation(google.maps.Animation.BOUNCE);
				}
			},
		});
	}
);
