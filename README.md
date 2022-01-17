# Hack the Map 5

[<img src="./images/logo.png" width="300px">](https://jwmazzi.github.io/esri-hack-the-map)

## Exploring TestRouter

You can visit [TestRouter](https://jwmazzi.github.io/esri-hack-the-map) via GitHub Pages. If you don't live in Redlands, we suggest using the [demonstration version](https://jwmazzi.github.io/esri-hack-the-map?demo=true) of the application, where a predefined location is used to illustrate the routing capabilities.

## PopUp Interface

<img src="./images/popup.png" width="300px">
<br/>

In the PopUp for each of the provider locations, you will see the following [buttons](https://developers.arcgis.com/javascript/latest/api-reference/esri-support-actions-ActionButton.html) added to the default PopUp:

* Directions - Selecting this option will take the user's current location, generate a route to this location, and copy the address of that location to the user's clipboard. Additionally, the provider destiation will be written to a Hosted Feature Layer in ArcGIS Online so that it can be used in the SmartRoute logic (see below).
* Respond - Selecting this option will open a Modal that allows the user input their observations about a particular provider. Much like the Directions button, this input is stored in a Hosted Feature Layer in ArcGIS Online that will be fed into SmartRoute.

## SmartRoute

<img src="./images/smartroute.png" width="300px">
<br/>

SmartRoute is more than quickly finding a route COVID-19 test. Our hope is to build a tool for the ArcGIS ecosystem that improves decision making by incorporating routing artifacts that might normally be discarded and crowd-sources observations. At the moment, SmartRoute offers the following inputs:

* Testing Types
  * Testing Kits
  * Walk-in Availability
* Routing Options
  * Transportation Method
    * Driving
    * Walking
    * COMING SOON - Bicycle & More
  * Max Time
