"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("../../shared/config");
const auth_route_1 = require("../routes/auth/auth.route");
class Server {
    constructor() {
        this._app = (0, express_1.default)();
        this.configureMiddlewares();
        this.configureRoutes();
        this.configureErrorHandling();
    }
    configureMiddlewares() {
        this._app.use((0, morgan_1.default)(config_1.config.loggerStatus));
        this._app.use((0, helmet_1.default)());
        this._app.use((0, cors_1.default)({
            origin: config_1.config.cors.ALLOWED_ORGIN,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Authorization", "Content-Type"],
            credentials: true,
        }));
        this._app.use((req, res, next) => {
            express_1.default.json()(req, res, next);
        });
        this._app.use((0, cookie_parser_1.default)());
        this._app.use((0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000,
            max: 1000
        }));
    }
    configureRoutes() {
        this._app.use("/api/user/auth", new auth_route_1.AuthRoutes().router);
    }
    configureErrorHandling() {
        this._app.use((err, req, res, next) => {
            const statusCode = err.statusCode || 500;
            const message = err.message || "internal Server Error";
            res.status(statusCode).json({
                success: false,
                statusCode,
                message
            });
        });
    }
    getApp() {
        return this._app;
    }
}
exports.Server = Server;
