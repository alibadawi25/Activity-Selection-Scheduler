import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const timeScaleItemStyle = {
  flexGrow: 1,
  textAlign: "center",
  fontSize: "0.75rem",
  color: "#616161",
};

const activityRowStyle = {
  position: "relative",
  marginBottom: "8px",
};

const activityBackgroundStyle = {
  position: "absolute",
  top: 0,
  bottom: 0,
  width: "100%",
  backgroundColor: "#f5f5f5",
};

const legendItemStyle = {
  display: "flex",
  alignItems: "center",
  marginLeft: "16px",
};

const legendColorStyle = (bgcolor) => ({
  width: 12,
  height: 12,
  borderRadius: 2,
  marginRight: "4px",
  backgroundColor: bgcolor,
});

const formatTime = (hour) => {
  const h = hour % 12 || 12;
  const ampm = hour < 12 || hour === 24 ? "AM" : "PM";
  return `${h}${ampm}`;
};

export default function GanttChart({
  activities,
  selectedActivities,
  timeScale = null,
  color = "blue",
  steps,
}) {
  const [minTime, maxTime] = [0, 24];
  const timeRange = maxTime - minTime;
  const [currentlySelected, setCurrentlySelected] = useState([]);

  useEffect(() => {
    for (let i = 0; i < steps.length; i++) {
      setTimeout(() => {
        console.log("here");
        setCurrentlySelected(steps[i]);
      }, i * 1000 + 1000);
    }
    setTimeout(() => {
      setCurrentlySelected(
        selectedActivities.map((a) => ({ activity: a, color }))
      );
    }, steps.length * 1000 + 1000);
  }, [steps, selectedActivities, color]);

  const getColor = (isSelectedColor) => {
    if (!isSelectedColor) return "#a0a0a0";

    switch (isSelectedColor) {
      case "green":
        return "#4caf50";
      case "blue":
        return "#1976d2";
      case "purple":
        return "#9c27b0";
      case "yellow":
        return "#f7dc6f";
      case "gray":
        return "#808080";
      case "orange":
        return "#ffa726";
      case "red":
        return "#ef5350";
      case "pink":
        return "#ec407a";
      case "brown":
        return "#795548";
      default:
        return color;
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <Box sx={{ width: "100%", height: "100%", p: 2, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No activities to display
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflowX: "auto",
        minWidth: "820px",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            borderBottom: "1px solid",
            borderColor: "divider",
            mb: 1,
          }}
        >
          {Array.from({ length: timeRange + 1 }, (_, i) => (
            <Box
              key={i}
              sx={{
                ...timeScaleItemStyle,
                width: `${(1 / timeRange) * 100}%`,
              }}
            >
              {formatTime(minTime + i)}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        {activities
          .slice()
          .sort((a, b) => a.end - b.end)
          .map((activity, index) => {
            if (!activity) return null;

            const startHour = activity.start.hour();
            const endHour = activity.end.hour();

            const currentlySelectedActivity = currentlySelected.filter(
              (a) =>
                a.activity &&
                a.activity.start.hour() === startHour &&
                a.activity.end.hour() === endHour
            )[0];
            const isSelected =
              currentlySelectedActivity !== undefined
                ? currentlySelectedActivity.activity === activity
                : false;

            // Calculate positions based on fixed width
            const width = Math.max(
              0,
              Math.min(100, ((endHour - startHour) / timeRange) * 100)
            );
            const left = Math.max(
              0,
              Math.min(100, ((startHour - minTime) / timeRange) * 100)
            );

            return (
              <Box key={index} sx={{ ...activityRowStyle, height: 48 }}>
                <Box sx={activityBackgroundStyle} />
                <motion.div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: `${width}%`,
                    left: `${left}%`,
                    backgroundColor:
                      currentlySelectedActivity !== undefined
                        ? getColor(currentlySelectedActivity.color)
                        : getColor(false),
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 4,
                    fontSize: { xs: 12, sm: 14 },
                    fontWeight: 500,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    padding: "0 4px",
                    transform: "translateZ(0)",
                    willChange: "transform", // Optimize for animations
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: isSelected ? 1 : 0.5,
                    scale: isSelected ? 1 : 0.95,
                    y: isSelected ? -2 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {activity.name || `Activity ${index + 1}`}
                </motion.div>
              </Box>
            );
          })}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Box sx={legendItemStyle}>
            <Box sx={legendColorStyle("#e0e0e0")} />
            <Typography variant="body2">Not Selected</Typography>
          </Box>
          <Box sx={legendItemStyle}>
            <Box sx={legendColorStyle(getColor(true))} />
            <Typography variant="body2">Selected</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
