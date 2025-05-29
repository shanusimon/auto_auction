import cors from "cors";
import helmet from "helmet";
import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { Server as SocketIOServer } from "socket.io";
import { dataParser } from "../../interface-adapters/middlewares/dataParserMiddleware";
import { config } from "../../shared/config";
import { AuthRoutes } from "../routes/auth/auth.route";
import { PrivateRoutes } from "../routes/private/privateRoute";
import { bidController,chatController } from "../di/resolver";
import { createServer, Server as HTTPServer } from "http";


export class Server {
  private _app: Application;
  private _httpServer: HTTPServer;
  private _io: SocketIOServer;

  constructor() {
    this._app = express();
    this._httpServer = createServer(this._app);
    
    // Initialize a single Socket.IO server
    this._io = new SocketIOServer(this._httpServer, {
      cors: {
        origin: config.cors.ALLOWED_ORGIN,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
    this.configureSockets();
  }

  private configureMiddlewares(): void {
    this._app.use(morgan(config.loggerStatus));
    this._app.use(helmet());
    this._app.use(
      cors({
        origin: config.cors.ALLOWED_ORGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Authorization", "Content-Type"],
        credentials: true,
      })
    );
    this._app.use(cookieParser());
    this._app.use(dataParser);
    this._app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
      })
    );
  }

  private configureRoutes(): void {
    this._app.use("/api/v_1/auth", new AuthRoutes().router);
    this._app.use("/api/v_1/pvt", new PrivateRoutes().router);
  }

  private configureErrorHandling(): void {
    this._app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(statusCode).json({
          success: false,
          statusCode,
          message,
        });
      }
    );
  }

  private configureSockets(): void {
    bidController.initialize(this._io);
    chatController.initialize(this._io);
  }

  /**
   * Starts the HTTP & Socket.IO server on the given port
   */
  public start(port: number): void {
    this._httpServer.listen(port, () => {
      console.log(`🚀 Server is running at port ${port}`);
    });
  }

  public getServerInstance(): HTTPServer {
    return this._httpServer;
  }
  
  public getSocketIOInstance(): SocketIOServer {
    return this._io;
  }
}