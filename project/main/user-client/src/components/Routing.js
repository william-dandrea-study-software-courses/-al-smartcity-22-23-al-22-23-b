import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";
import NavPage from "../pages/NavPage";

L.Marker.prototype.options.icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png"
});

const routeMock = [[2.353761,48.856952],[2.351276,48.857538],[2.349551,48.857237],[2.347777,48.857724],[2.357507,48.874997],[2.359002,48.874911],[2.36043,48.875871],[2.362092,48.878573],[2.362902,48.879251],[2.364484,48.878435],[2.366294,48.877022],[2.368349,48.876005],[2.369912,48.877571],[2.370429,48.877672],[2.37353,48.874954],[2.373726,48.875049],[2.370681,48.87769]]

const Routing = (route) => {
    const map = useMap();
    console.log(route);
    useEffect(() => {
        if (!map) return;
        const points = []
        routeMock.forEach(point => {
            points.push(L.latLng(point[1], point[0]));
        })

        const routingControl = L.Routing.control({
            plan: new L.Routing.Plan(
                points,
                {
                    createMarker: (i, waypoint, n) => {
                        if (i === 0 || i === n - 1) {
                            // show markers
                            return L.marker(waypoint.latLng);
                        }
                        return false;
                    }
                })
        }).addTo(map);

        return () => map.removeControl(routingControl);
    }, [map]);

    return null;
}
export default Routing;