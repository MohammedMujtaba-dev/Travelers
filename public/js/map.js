const map = new mapboxgl.Map({
  // TO MAKE THE MAP APPEAR YOU MUST
  // ADD YOUR ACCESS TOKEN FROM
  // https://account.mapbox.com
  accessToken: mapToken,
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v12", // Use the standard style for the map
  //        projection: 'globe', // display the map as a globe
  zoom: 10, // initial zoom level, 0 is the world view, higher values zoom in
  center: listing.geometry.coordinates, // center the map on this longitude and latitude
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title}<sub>${listing.location},${listing.country}</sub></h4><p>Exact location provided after booking</p>`,
    ),
  )
  .addTo(map);
