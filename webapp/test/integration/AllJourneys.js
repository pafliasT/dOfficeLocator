/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"com/demo/ZDemo_MasterDetail/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"com/demo/ZDemo_MasterDetail/test/integration/pages/App",
	"com/demo/ZDemo_MasterDetail/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.demo.ZDemo_MasterDetail.view.",
		autoWait: true
	});
});