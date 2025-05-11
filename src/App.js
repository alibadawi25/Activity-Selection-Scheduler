// App.jsx
import React, { useState } from "react";
import { Button, Modal } from "antd";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, Stack, Box } from "@mui/material";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import "./App.css";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDateTime, setStartDateTime] = useState(dayjs());
  const [endDateTime, setEndDateTime] = useState(null);

  const showModal = () => setIsModalOpen(true);
  const handleConfirm = () => {
    if (startDateTime == null || endDateTime == null) {
      console.log("Data is missing!!");
    } else {
      // Add your activity logic here
      console.log("Activity Added:", { startDateTime, endDateTime });
      setIsModalOpen(false);
    }
  };
  const handleCancel = () => setIsModalOpen(false);

  return (
    <div className="App">
      <header className="App-header">
        <Button type="primary" onClick={showModal}>
          Add Activity
        </Button>

        <Modal
          title="Add New Activity"
          open={isModalOpen}
          onOk={handleConfirm} // Call handleConfirm on OK
          onCancel={handleCancel}
          okText="Add Activity" // Change button text
        >
          <Box mt={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={2}>
                <DateTimePicker
                  label="Start Date and Time"
                  value={startDateTime}
                  onChange={setStartDateTime}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        width: "100%",
                        backgroundColor: "#f5f5f5",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#00b96b" },
                          "&:hover fieldset": { borderColor: "#00b96b" },
                          "&.Mui-focused fieldset": { borderColor: "#00b96b" },
                        },
                      }}
                    />
                  )}
                />

                <DateTimePicker
                  label="End Date and Time"
                  value={endDateTime}
                  onChange={setEndDateTime}
                  minDateTime={startDateTime}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        width: "100%",
                        backgroundColor: "#f5f5f5",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#00b96b" },
                          "&:hover fieldset": { borderColor: "#00b96b" },
                          "&.Mui-focused fieldset": { borderColor: "#00b96b" },
                        },
                      }}
                    />
                  )}
                />
              </Stack>
            </LocalizationProvider>
          </Box>
        </Modal>
      </header>
    </div>
  );
}

export default App;
