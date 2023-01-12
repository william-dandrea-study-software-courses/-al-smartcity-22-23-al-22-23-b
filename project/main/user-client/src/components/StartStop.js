import { Button, Card, CardActions, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { NavigationService } from "../services/NavigationService";
import { SocketService } from "../services/Socket";

const StartStop = observer(() => {
  const [carMoving, setCarMoving] = useState(false);
  const [licensePlate, setLicensePlate] = useState("");
  const [route, setRoute] = useState(null);

  const generateRandomCoordinatesInParis = () => {
    // Coordonnées de bordures de Paris (rectangle)
    const minLat = 48.813;
    const maxLat = 48.905;
    const minLng = 2.224;
    const maxLng = 2.460;

    // Génération des coordonnées aléatoires
    const lat = minLat + Math.random() * (maxLat - minLat);
    const lng = minLng + Math.random() * (maxLng - minLng);

    return [lat, lng];
  }

  useEffect(() => {
    SocketService.socket.on("message_to_user", (message) => {
      console.log(message);
    });

    SocketService.socket.on("new_frequency", (message) => {
      console.log(message);
    });

    SocketService.socket.on("new_route", (message) => {
      console.log(message);
      setRoute(message);
    });
  }, []);

  const TIMER_MS = 5000;

  useEffect(() => {
    if (carMoving) {
      const interval = setInterval(() => {
        console.log("send position");
        NavigationService.sendPosition(licensePlate);
      }, TIMER_MS);

      return () => clearInterval(interval);
    }
  }, [carMoving, licensePlate]);

  const connectToSocket = useCallback(async () => {
    await SocketService.connectSocket(licensePlate);
  }, [licensePlate]);

  const handleStart = useCallback(() => {
    connectToSocket();
    NavigationService.startNavigation(licensePlate).then(() => {
      setCarMoving(true);
    });
  }, [connectToSocket, licensePlate]);

  const handleStop = useCallback(() => {
    NavigationService.stopNavigation(licensePlate).then(() => {
      setCarMoving(false);
    });
  }, [licensePlate]);

  const askRoute = useCallback(() => {
    NavigationService.askRoute(licensePlate);
  }, [licensePlate]);

  return (
    <div>
      <input
        type="text"
        value={licensePlate}
        onChange={(e) => setLicensePlate(e.target.value)}
        placeholder="Your license plate"
      />
      <Card>
        <CardActions>
          <Button
            size="small"
            color={"success"}
            variant="contained"
            onClick={handleStart}
          >
            Start Navigation
          </Button>
          <Button
            size="small"
            color={"error"}
            variant="contained"
            onClick={handleStop}
          >
            Stop Navigation
          </Button>
          <Button
            onClick={() => {
              askRoute();
            }}
          >
            ask route
          </Button>
        </CardActions>
      </Card>
    </div>
  );
});

export default StartStop;
