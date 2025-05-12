import React, { useState, useEffect } from "react";
import { Button, Modal, Menu, Layout, notification } from "antd";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, Stack, Box } from "@mui/material";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import "./App.css";

const { Header, Content } = Layout;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDateTime, setStartDateTime] = useState(dayjs().minute(0));
  const [endDateTime, setEndDateTime] = useState(null);
  const [activities, setActivities] = useState([]);
  const [currentTab, setCurrentTab] = useState("home");

  // Load activities from localStorage on initial load
  useEffect(() => {
    const storedActivities = localStorage.getItem("activities");
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    }
  }, []);

  // Save activities to localStorage whenever the activities array changes
  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities));
  }, [activities]);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleConfirm = () => {
    if (!startDateTime || !endDateTime) {
      console.log("Data is missing!!");
    } else {
      const newActivity = {
        start: startDateTime,
        end: endDateTime,
      };
      setActivities((prev) => [...prev, newActivity]);

      // Show success notification
      notification.success({
        message: "Activity Added",
        description: `Your activity from ${startDateTime.format(
          "YYYY-MM-DD HH:mm"
        )} to ${endDateTime.format(
          "YYYY-MM-DD HH:mm"
        )} has been added successfully.`,
        placement: "topRight",
      });

      setIsModalOpen(false);
    }
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
        >
          <Menu.Item key="home">Home</Menu.Item>
          <Menu.Item key="activities">Activities</Menu.Item>
          <Menu.Item key="algorithms">Algorithms</Menu.Item>
        </Menu>
      </Header>

      <Content
        style={{
          padding: "20px 50px",
          marginTop: 64, // Offset to avoid overlap with the fixed header
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
                style={{
                  width: "10%", // Explicitly set the width to auto
                  minWidth: "96px", // Optional: Ensure a minimum width for better appearance
                }}
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
                    <DateTimePicker
                      label="Start Date and Time"
                      value={startDateTime}
                      onChange={(newValue) => {
                        if (newValue) setStartDateTime(newValue.minute(0));
                      }}
                      views={["year", "month", "day", "hours"]}
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

                    <DateTimePicker
                      label="End Date and Time"
                      value={endDateTime}
                      onChange={(newValue) => {
                        if (newValue) setEndDateTime(newValue.minute(0));
                      }}
                      minDateTime={startDateTime}
                      views={["year", "month", "day", "hours"]}
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
              <ul>
                {activities.map((activity, index) => (
                  <li key={index}>
                    {activity.start.format("YYYY-MM-DD HH:mm")} -{" "}
                    {activity.end.format("YYYY-MM-DD HH:mm")}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {currentTab === "algorithms" && (
          <>
            <h2>Algorithms</h2>
            <Button
              type="primary"
              style={{
                width: "10%", // Explicitly set the width to auto
                minWidth: "96px",
              }}
            >
              Greedy
            </Button>
            <Button
              type="primary"
              style={{
                width: "10%", // Explicitly set the width to auto
                minWidth: "96px",
                marginTop: "8px",
              }}
            >
              DP
            </Button>
            <Button
              type="primary"
              style={{
                width: "10%", // Explicitly set the width to auto
                minWidth: "96px",
                marginTop: "8px",
              }}
            >
              Brute Force
            </Button>
          </>
        )}
      </Content>
    </Layout>
  );
}

export default App;
