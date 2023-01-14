import React, {useRef, useState} from "react";
import { StartStop } from "../components";
import { TestDebug } from "../components/TestDebug";

import { MapContainer, TileLayer} from "react-leaflet";

const maptiler = {
    url: "https://api.maptiler.com/maps/basic-2154/?key=KcNMZD3S4dFh93cyStfs#9.9/48.86758/2.32928",
    attribution:
    '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}

const NavPage = () => {
    const [center, setCenter] = useState({lat: 48.234578, lon:2.76932})
    const ZOOM_LVL=9
    const ref = useRef()
  console.log("inb   home page");

  return (
    <>
      <StartStop />
      <div>
          <MapContainer
          center={center}
          zoom={ZOOM_LVL}
          ref={ref}
          >
            <TileLayer url={maptiler.url} attribution = {maptiler.attribution}/>
          </MapContainer>
      </div>
    </>
  );
};

export default NavPage;
