import React, { useCallback, useRef, useState } from "react";
import { StartStop } from "../components";
import { Button } from "@mui/material";
import { observer } from "mobx-react-lite";
import L from "leaflet";
import "leaflet-routing-machine";

import { Circle, MapContainer, TileLayer, Marker } from "react-leaflet";
import Routing from "../components/Routing";
import { BillsService } from "../services/BillsService";

const maptiler = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
};

const NavPage = observer(() => {
  const [center, setCenter] = useState([48.854539, 2.347756]);
  const [route, setRoute] = useState(null);
  const [payments, setPayments] = useState(null);
  const [licensePlate, setLicensePlate] = useState("");

  const ZOOM_LVL = 9;

  const getZoneColor = (zone) => {
    switch (zone.number) {
      case 1:
        return "red";
      case 2:
        return "yellow";
      case 3:
        return "green";
      default:
        return "";
    }
  };

  const loadBills = useCallback(() => {
    BillsService.getBills(licensePlate).then((resp) => {
      console.log(resp.data);
      setPayments(resp.data);
    });
  }, [licensePlate]);

  const payBill = useCallback((billId) => {
    BillsService.getBills(licensePlate).then((resp) => {
      console.log(resp.data);
      setPayments(resp.data);
    });
  }, [licensePlate]);

  return (
    <>
      <StartStop
        setRoute={setRoute}
        licensePlate={licensePlate}
        setLicensePlate={setLicensePlate}
      />
      <div id="map">
        <MapContainer style={{ height: "600px" }} center={center} zoom={13}>
          <TileLayer attribution={maptiler.attribution} url={maptiler.url} />
          <Routing route={route} />
          {route ? (
            route.zones.map((zone, i) => {
              return (
                <Marker
                  key={i}
                  opacity={0}
                  position={{ lat: zone.centerLat, lng: zone.centerLong }}
                >
                  <Circle
                    center={{ lat: zone.centerLat, lng: zone.centerLong }}
                    fillColor={getZoneColor(zone)}
                    opacity={0.5}
                    radius={zone.radiusEnd * 1000}
                  />
                </Marker>
              );
            })
          ) : (
            <></>
          )}
        </MapContainer>
        <Button
          size="small"
          color={"success"}
          variant="contained"
          onClick={loadBills}
        >
          Get Bills
        </Button>
        {payments?.bills.map(bill => {
          return(
              <div>
                <div>{bill.price}</div>
                <div>{bill.isPaid ? "Paid"
                    :
                    <Button
                        size="small"
                        color={"success"}
                        variant="contained"
                        onClick={() => payBill(bill.id)}
                    >
                      Pay
                    </Button>
                }</div>
              </div>
          )
        })}
      </div>
    </>
  );
});

export default NavPage;
