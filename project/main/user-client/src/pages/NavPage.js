import React, {useCallback, useRef, useState} from "react";
import { StartStop } from "../components";
import L from "leaflet"
import "leaflet-routing-machine";

import { MapContainer, TileLayer} from "react-leaflet";
import Routing from "../components/Routing";

const maptiler = {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
}

const NavPage = () => {
    const [center, setCenter] = useState( [48.854539, 2.347756])
    const [route, setRoute] = useState(null);
    const ZOOM_LVL=9
    const ref = useRef()
  console.log("inb   home page");

    const renderMap = useCallback(() => {
        return(
            <div id='map'>
                <MapContainer style={{ height: "600px" }} center={center} zoom={13}>
                    <TileLayer
                        attribution={maptiler.attribution}
                        url={maptiler.url}
                    />
                    <Routing route={route}/>
                </MapContainer>
            </div>
            )
    }, [center])

  return (
    <>
      <StartStop setRoute={setRoute} />
        <div id='map'>
            {renderMap()}
        </div>

    </>
  );
};

export default NavPage;
