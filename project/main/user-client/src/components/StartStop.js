import { Button, Card, CardActions } from "@mui/material";
import React, { useCallback, useState } from "react";
import { NavigationService } from "../services/NavigationService";

const StartStop = () => {
  const [carMoving, setCarMoving] = useState(false);

  const handleStartNav = useCallback(() => {
    NavigationService.startNavigation().then(() => {
      setCarMoving(true);
    });
  }, []);

  const handleStopNav = useCallback(() => {
    NavigationService.stopNavigation().then(() => {
      setCarMoving(false);
    });
  }, []);

  return (
    <Card variant="contained">
      <CardActions>
        <Button size="small" color={"success"} onClick={() => handleStartNav()}>
          Start Navigation
        </Button>
        <Button size="small" color={"error"} onClick={() => handleStopNav()}>
          Stop Navigation
        </Button>
      </CardActions>
    </Card>
  );
};

export default StartStop;
