import React, { useCallback, useRef, useState } from "react";
import { StartStop } from "../components";
import {Button, Divider, List, ListItem, ListItemText, Typography} from "@mui/material";
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
  const [tickets, setTickets] = useState([]);
  const [bills, setBills] = useState([]);
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
      setBills(resp.data.bills)
      setTickets(resp.data.tickets);
      console.log(resp.data)
    });
  }, [licensePlate]);

  const payBill = (id) => {
    BillsService.payBill(licensePlate, id).then(r => {
      console.log(r.data)
      loadBills()
    })
  }

  const payTicket = (id) => {
    BillsService.payTicket(licensePlate, id).then(r => {
      console.log(r.data)
      loadBills()
    })
  }

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

        <Divider></Divider>
        <Button size="small" color={"success"} variant="contained" onClick={loadBills}>Update Bills</Button>

        <h2>Your bills</h2>
        {bills.length > 0
            ? <List>

              {bills.map(b => {
                return <ListItem>
                  <ListItemText primary={`${b.price} EUR`}></ListItemText>
                  <ListItemText primary={b.date}></ListItemText>
                  <Button disabled={b.is_paid} onClick={() => payBill(b._id)}>Payer</Button>
                </ListItem>
              })}

            </List>
            : <div>No bills</div>
        }

        <h2>Your tickets</h2>
        {tickets.length > 0
            ? <div>
              {tickets.map(t => {
                return <ListItem>
                  <ListItemText primary={`${t.price} EUR`}></ListItemText>
                  <ListItemText primary={t.date}></ListItemText>
                  <Button disabled={t.is_paid} onClick={() => payTicket(t._id)}>Payer</Button>
                </ListItem>
              })}


            </div>
            : <div>No tickets</div>
        }


      </div>
    </>
  );
});

export default NavPage;
