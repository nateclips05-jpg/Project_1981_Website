import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getSession, requireAuth, loginUser } from "./auth";
import { loginSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(getSession());

  // Auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      console.log("Login attempt:", req.body);
      const credentials = loginSchema.parse(req.body);
      console.log("Parsed credentials:", credentials);
      
      const user = await loginUser(credentials);
      console.log("Login result:", user ? "User found" : "User not found");
      
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      req.session.userId = user.id;
      res.json({ message: "Login successful", user });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Invalid credentials format" });
      }
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get('/api/auth/user', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // // Get user's recent games
  // app.get('/api/user/games', requireAuth, async (req, res) => {
  //   try {
  //     const userId = req.session.userId!;
  //     const sessions = await storage.getUserGameSessions(userId);
  //     res.json(sessions);
  //   } catch (error) {
  //     console.error("Error fetching user games:", error);
  //     res.status(500).json({ message: "Failed to fetch user games" });
  //   }
  // });

  // // Get all available games
  // app.get('/api/games', async (req, res) => {
  //   try {
  //     const games = await storage.getGames();
  //     res.json(games);
  //   } catch (error) {
  //     console.error("Error fetching games:", error);
  //     res.status(500).json({ message: "Failed to fetch games" });
  //   }
  // });

  const httpServer = createServer(app);
  return httpServer;
}
