import React, { useState, useEffect } from "react";
import { Button, Modal, Menu, Layout, notification } from "antd";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, Stack, Box } from "@mui/material";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import "./App.css";

import GranttChart from "./grantt-chart";

const { Header, Content } = Layout;

const formatTime = (hour) => {
  const h = hour % 12 || 12;
  const ampm = hour < 12 || hour === 24 ? "AM" : "PM";
  return `${h}${ampm}`;
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startTime, setStartTime] = useState(dayjs().hour(6).minute(0));
  const [endTime, setEndTime] = useState(dayjs().hour(8).minute(0));
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setselectedActivities] = useState([]);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(null);
  const [currentAlgorithmSteps, setCurrentAlgorithmSteps] = useState([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [currentTab, setCurrentTab] = useState("home");
  const [timeScale, setTimeScale] = useState([0, 24]);
  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  useEffect(() => {
    if (localStorage.getItem("activities")) {
      try {
        setActivities(
          JSON.parse(localStorage.getItem("activities"), function (key, value) {
            if (key === "start" || key === "end") {
              return new dayjs(value);
            }
            return value;
          })
        );
      } catch (e) {
        setActivities([]);
        console.log(e);
      }
    }
  }, [setActivities]);

  useEffect(() => {
    if (activities.length > 0) {
      const minHour = Math.min(...activities.map((a) => a.start));
      const maxHour = Math.max(...activities.map((a) => a.end));
      setTimeScale([Math.max(0, minHour - 1), maxHour + 1]);
    }
    console.log(activities);
  }, [activities, currentAlgorithm]);

  const handleConfirm = () => {
    const startHour = startTime.hour();
    const endHour = endTime.hour();

    if (!startTime || !endTime) {
      console.log("Data is missing!!");
    } else if (startTime > endTime) {
      notification.error({
        message: "Error",
        description: `Start time cannot be greater than end time.`,
        placement: "topRight",
      });
    } else {
      console.log(startTime, endTime);
      const newActivity = {
        start: startTime,
        end: endTime,
      };
      const updatedActivities = [...activities, newActivity];
      setActivities(updatedActivities);
      localStorage.setItem("activities", JSON.stringify(updatedActivities));

      notification.success({
        message: "Activity Added",
        description: `Your activity from ${formatTime(
          startHour
        )} to ${formatTime(endHour)} has been added successfully.`,
        placement: "topRight",
      });
      setIsModalOpen(false);
    }
  };
  const clearActivities = () => {
    setActivities([]);
    setselectedActivities([]);
    localStorage.removeItem("activities");
    notification.info({
      message: "Activities Cleared",
      description: "All activities have been removed.",
      placement: "topRight",
    });
  };

  const greedyAlgorithm = () => {
    setCurrentAlgorithm("greedy");
    let sorted = activities.slice().sort((a, b) => a.end - b.end);
    const selected = [];
    const stepsSelected = [];
    const steps = [];

    let currentEnd = -Infinity;
    for (let i = 0; i < sorted.length; i++) {
      if (stepsSelected.length === 0)
        steps.push([{ activity: sorted[i], color: "yellow" }]);
      else
        steps.push([
          ...stepsSelected[stepsSelected.length - 1],
          { activity: sorted[i], color: "yellow" },
        ]);

      if (sorted[i].start >= currentEnd) {
        selected.push(sorted[i]);

        if (stepsSelected.length === 0)
          stepsSelected.push([{ activity: sorted[i], color: "green" }]);
        else
          stepsSelected.push([
            ...stepsSelected[stepsSelected.length - 1],
            { activity: sorted[i], color: "green" },
          ]);

        currentEnd = sorted[i].end;
      }
    }
    setCurrentAlgorithmSteps(steps);
    setselectedActivities(selected);
    console.log("Greedy Selected Activities:", selected);
    console.log("Greedy Time Taken:", timeTaken);
  };

  const dpAlgorithm = () => {
    const start = performance.now();
    setCurrentAlgorithm("dp");
    let sorted = activities.slice().sort((a, b) => a.end - b.end);

    const n = sorted.length;
    const dp = Array(n).fill(1);
    const prev = Array(n).fill(-1);

    const steps = [];
    const stepsSelected = [];

    for (let i = 1; i < n; i++) {
      let stepSnapshot = [];

      for (let j = 0; j < i; j++) {
        stepSnapshot.push({ activity: sorted[j], color: "yellow" });
        if (sorted[j].end <= sorted[i].start && dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          prev[i] = j;
        }
      }

      steps.push(stepSnapshot);
    }

    let idx = dp.indexOf(Math.max(...dp));
    const selected = [];
    while (idx !== -1) {
      selected.unshift(sorted[idx]);

      if (stepsSelected.length === 0)
        stepsSelected.push([{ activity: sorted[idx], color: "green" }]);
      else
        stepsSelected.push([
          ...stepsSelected[stepsSelected.length - 1],
          { activity: sorted[idx], color: "green" },
        ]);

      idx = prev[idx];
    }

    const end = performance.now();
    setCurrentAlgorithmSteps(steps.concat(stepsSelected));
    setselectedActivities(selected);
    setTimeTaken(end - start);
    console.log("DP Selected Activities:", selected);
    console.log("DP Time Taken:", timeTaken);
  };

  const bruteForceAlgorithm = () => {
    const start = performance.now();
    setCurrentAlgorithm("bruteforce");

    let choice = [];
    let bestSteps = [];
    let n = activities.length;

    for (let mask = 0; mask < 1 << n; ++mask) {
      const selected = [];
      const stepSnapshot = [];

      for (let i = 0; i < n; ++i) {
        if (mask & (1 << i)) {
          selected.push(activities[i]);
          stepSnapshot.push({ activity: activities[i], color: "yellow" });
        }
      }

      selected.sort((a, b) => a.end - b.end);
      let valid = true;
      for (let i = 1; i < selected.length; ++i) {
        if (selected[i - 1].end > selected[i].start) {
          valid = false;
          break;
        }
      }

      if (valid && selected.length > choice.length) {
        choice = selected;
        bestSteps = stepSnapshot.map((item) => ({ ...item, color: "green" }));
      }
    }

    const end = performance.now();
    setCurrentAlgorithmSteps([bestSteps]);
    setselectedActivities(choice);
    setTimeTaken(end - start);
    console.log("Brute-Force Selected Activities:", choice);
    console.log("Brute-Force Time Taken:", timeTaken);
  };

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Header style={{ position: "fixed", width: "100%", zIndex: 1 }}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentTab]}
          onClick={(e) => setCurrentTab(e.key)}
          style={{ lineHeight: "64px" }}
          items={[
            { label: "Home", key: "home" },
            { label: "Activities", key: "activities" },
            { label: "Algorithms", key: "algorithms" },
          ]}
        />
      </Header>

      <Content
        style={{
          padding: "20px 50px",
          marginTop: 64,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {currentTab === "home" && (
          <>
            <h2>Welcome to Activity Scheduler</h2>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <Button
                type="primary"
                onClick={showModal}
                style={{ width: "10%", minWidth: "96px" }}
              >
                Add Activity
              </Button>
            </div>

            <Modal
              title="Add New Activity"
              open={isModalOpen}
              onOk={handleConfirm}
              onCancel={handleCancel}
              okText="Add Activity"
            >
              <Box mt={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={2}>
                    <TimePicker
                      label="Start Date and Time"
                      value={startTime}
                      onChange={(newValue) => {
                        if (newValue) setStartTime(newValue.minute(0));
                      }}
                      views={["hours"]}
                      minutesStep={60}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{
                            width: "100%",
                            backgroundColor: "#f5f5f5",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#00b96b" },
                              "&:hover fieldset": { borderColor: "#00b96b" },
                              "&.Mui-focused fieldset": {
                                borderColor: "#00b96b",
                              },
                            },
                          }}
                        />
                      )}
                    />

                    <TimePicker
                      label="End Date and Time"
                      value={endTime}
                      onChange={(newValue) => {
                        if (newValue) setEndTime(newValue.minute(0));
                      }}
                      minDateTime={startTime}
                      views={["hours"]}
                      minutesStep={60}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{
                            width: "100%",
                            backgroundColor: "#f5f5f5",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#00b96b" },
                              "&:hover fieldset": { borderColor: "#00b96b" },
                              "&.Mui-focused fieldset": {
                                borderColor: "#00b96b",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Stack>
                </LocalizationProvider>
              </Box>
            </Modal>
          </>
        )}

        {currentTab === "activities" && (
          <>
            <h2>Activity List</h2>
            {activities.length === 0 ? (
              <p>No activities added yet.</p>
            ) : (
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {activities.map((activity, index) => (
                  <li
                    key={index}
                    style={{
                      padding: "12px",
                      margin: "8px 0",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "4px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <strong>{activity.name || `Activity ${index + 1}`}</strong>:{" "}
                    {formatTime(activity.start.hour())} -{" "}
                    {formatTime(activity.end.hour())}
                  </li>
                ))}
              </ul>
            )}
            <Button
              danger
              onClick={clearActivities}
              style={{ maxWidth: "120px", marginTop: "16px" }}
            >
              Clear All Activities
            </Button>
          </>
        )}

        {currentTab === "algorithms" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2>Algorithms</h2>
              <Button
                type="primary"
                style={{
                  width: "10%",
                  minWidth: "96px",
                  backgroundColor: "#4caf50",
                }}
                onClick={greedyAlgorithm}
              >
                Greedy
              </Button>
              <Button
                type="primary"
                style={{
                  width: "10%",
                  minWidth: "96px",
                  marginTop: "8px",
                  backgroundColor: "#1976d2",
                }}
                onClick={dpAlgorithm}
              >
                DP
              </Button>
              <Button
                type="primary"
                style={{
                  width: "10%",
                  minWidth: "96px",
                  marginTop: "8px",
                  backgroundColor: "#9c27b0",
                }}
                onClick={bruteForceAlgorithm}
              >
                Brute Force
              </Button>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2>Visualization</h2>
              <GranttChart
                activities={activities}
                selectedActivities={selectedActivities}
                timeScale={timeScale}
                color={
                  currentAlgorithm === "greedy"
                    ? "green"
                    : currentAlgorithm === "dp"
                    ? "blue"
                    : currentAlgorithm === "bruteforce"
                    ? "purple"
                    : "blue"
                }
                steps={currentAlgorithmSteps}
              />
            </div>
          </div>
        )}
      </Content>
    </Layout>
  );
}

export default App;
