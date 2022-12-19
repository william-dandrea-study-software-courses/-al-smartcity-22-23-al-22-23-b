import { Button, Card, CardActions, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import { NavigationService } from "../services/NavigationService";

const StartStop = observer(() => {
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
    <div>
      {/* <Typography textAlign={"center"} marginBottom={2}>
        Liste des tables
      </Typography> */}
      <Card>
        <CardActions>
          <Button
            size="small"
            color={"success"}
            variant="contained"
            onClick={() => handleStartNav()}
          >
            Start Navigation
          </Button>
          <Button
            size="small"
            color={"error"}
            variant="contained"
            onClick={() => handleStopNav()}
          >
            Stop Navigation
          </Button>
        </CardActions>
      </Card>
    </div>
  );
});

export default StartStop;
