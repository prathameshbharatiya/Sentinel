import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { exec } from "child_process";
import { SerialPort } from "serialport";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: Verify ROS2 Connection
  app.get("/api/hardware/verify-ros2", (req, res) => {
    exec("ros2 topic list", (error, stdout, stderr) => {
      if (error) {
        return res.json({ 
          success: false, 
          message: error.message.includes("not found") ? "ROS2 not installed" : "ROS2 not running" 
        });
      }
      
      const topics = stdout.split("\n");
      const required = ["/cmd_vel_raw", "/joint_states"];
      const missing = required.filter(t => !topics.includes(t));

      if (missing.length > 0) {
        return res.json({ 
          success: false, 
          message: `Missing topics: ${missing.join(", ")}` 
        });
      }

      res.json({ success: true, message: "ROS2 connected" });
    });
  });

  // API: Scan for Arduino
  app.get("/api/hardware/scan-arduino", async (req, res) => {
    try {
      const ports = await SerialPort.list();
      const arduinoPorts = ports.filter(p => 
        p.manufacturer?.includes("Arduino") || 
        p.vendorId === "2341" || // Arduino
        p.vendorId === "1a86"    // CH340
      );

      if (arduinoPorts.length === 0) {
        return res.json({ success: false, message: "No Arduino detected" });
      }

      res.json({ 
        success: true, 
        message: `Arduino found on ${arduinoPorts[0].path}`,
        port: arduinoPorts[0].path 
      });
    } catch (err) {
      res.json({ success: false, message: "Serial scan failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
