import { Button, Card, CardActions, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { NavigationService } from "../services/NavigationService";
import { SocketService } from "../services/Socket";

const StartStop = observer(({ setRoute, licensePlate, setLicensePlate }) => {
  const [carMoving, setCarMoving] = useState(false);
  const [connected, setConnected] = useState(false);

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

  const TIMER_MS = 2000;

  useEffect(() => {
    if (carMoving) {
      const interval = setInterval(() => {
        console.log("send position");
        NavigationService.sendPosition(licensePlate);
      }, TIMER_MS);
      return () => clearInterval(interval);
    }
  }, [carMoving, licensePlate]);

  useEffect(() => {
    if (carMoving) {
      const interval = setInterval(() => {
        console.log("ask route");
        NavigationService.askRoute(licensePlate);
      }, TIMER_MS * 6);
      return () => clearInterval(interval);
    }
  }, [carMoving]);

  const connectToSocket = useCallback(async () => {
    await SocketService.connectSocket(licensePlate);
  }, [licensePlate]);

  const handleConnect = useCallback(() => {
    if (licensePlate) {
      connectToSocket();
      setConnected(true);
    }
  }, [connectToSocket, licensePlate]);

  const handleStart = useCallback(() => {
    if (connected) {
      NavigationService.startNavigation(licensePlate).then(() => {
        setCarMoving(true);
      });
    }
  }, [connected]);

  const handleStop = useCallback(() => {
    NavigationService.stopNavigation(licensePlate).then(() => {
      setRoute(null);
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
      <Button
        size="small"
        color={"success"}
        variant="contained"
        onClick={handleConnect}
      >
        Connect
      </Button>
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
