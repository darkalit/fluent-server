import config from "../../config/config";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "fluent API documentation",
    version: "1.0.0",
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api`,
      description: "Local server",
    },
    {
      url: "https://fluent-app.xyz/api",
      description: "Public server"
    }
  ],
};

export default swaggerDefinition;
