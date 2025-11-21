import "expo-router/entry";
import { createServer, Response } from "miragejs";

// Entry point for Expo Router

// Mock server setup for development
if (__DEV__) {
  if (window.server) {
    window.server.shutdown();
  }
}

window.server = createServer({
  routes() {
    this.post("/login", (schema, request) => {
      const { userId, userPw } = JSON.parse(request.requestBody);
      if (userId === "crezipsa" && userPw === "1111") {
        return {
          accessToken: "access-token",
          refreshToken: "refresh-token",
          user: {
            id: "crezipsa",
            name: "CrezipsaDemo"
          }
        }
      } else {
        return new Response(401, {}, { message: "Invalid credentials" });
      }
    });
  }
})