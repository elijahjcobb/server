/**
 *
 * Elijah Cobb
 * elijah@elijahcobb.com
 * https://elijahcobb.com
 *
 *
 * Copyright 2019 Elijah Cobb
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

import { ECArrayList, ECMap } from "@elijahjcobb/collections";
import { ECPrototype } from "@elijahjcobb/collections";
import { ECSErrorHandler, ECSMiddlewareHandler, ECSAuthorizationMiddleware } from "./interfaces/ECSHandlers";
import * as Express from "express";
import * as HTTPServer from "http";
import * as HTTPSServer from "https";
import { ECSRouter } from "./router/ECSRouter";
import { ECSServerHTTPConfig, ECSServerHTTPSConfig } from "./interfaces/ECSTypes";

/**
 * A factory class to add middleware and an error handler to a entire server.
 */
export class ECSServer extends ECPrototype {


	private expressServer: Express.Application | undefined;
	private httpServer: HTTPServer.Server | undefined;
	private httpsServer: HTTPSServer.Server | undefined;
	public httpConfig: ECSServerHTTPConfig | undefined;
	public httpsConfig: ECSServerHTTPSConfig | undefined;
	public routers: ECMap<string, ECSRouter>;
	public static middlewares: ECArrayList<ECSMiddlewareHandler> = new ECArrayList<ECSMiddlewareHandler>();
	public static errorHandler: ECSErrorHandler;
	public static authMiddleware: ECSAuthorizationMiddleware;

	public constructor(config?: { http: ECSServerHTTPConfig, https: ECSServerHTTPSConfig }) {

		super();

		this.routers = new ECMap<string, ECSRouter>();

		if (!config) return;

		this.httpConfig = config.http;
		this.httpsConfig = config.https;

	}

	private initServer(): void {

		this.expressServer = Express();

		this.expressServer.use((req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

			res.set("Access-Control-Allow-Origin", req.get("origin"));
			res.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
			res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
			res.set("Access-Control-Allow-Credentials", "true");

			if (req.method === "OPTIONS") {

				res.sendStatus(200);

			} else {

				next();

			}

		});

		this.routers.forEach((mountingPoint: string, router: ECSRouter) => {

			if (!this.expressServer) throw new Error("Express server is undefined.");
			mountingPoint = mountingPoint.replace("/", "");
			this.expressServer.use("/" + mountingPoint, router.getRouter());

		});

	}

	/**
	 * Add a middleware to the middlewares on the server.
	 * @param {ECSMiddlewareHandler} middleware
	 */
	public addMiddleware(middleware: ECSMiddlewareHandler): void {

		if (!ECSServer.middlewares) ECSServer.middlewares = new ECArrayList<ECSMiddlewareHandler>();
		ECSServer.middlewares.add(middleware);

	}

	/**
	 * Set the function that will be called after a server responds with an error.
	 * @param {ECSErrorHandler} handler A function following the ECSErrorHandler interface.
	 */
	public setErrorHandler(handler: ECSErrorHandler): void {

		if (handler) ECSServer.errorHandler = handler;

	}

	/**
	 * Set an authorization validator handler.
	 * @param {ECSAuthorizationMiddleware} handler A function following ECSAuthorizationMiddleware interface.
	 */
	public setAuthorizationMiddleware(handler: ECSAuthorizationMiddleware): void {

		ECSServer.authMiddleware = handler;

	}

	public use(mountPoint: string, router: ECSRouter): void {

		this.routers.set(mountPoint, router);

	}

	public startHTTP(port: number = 3000): void {

		this.initServer();

		if (port) this.httpConfig = { port };

		this.httpServer = HTTPServer.createServer(this.expressServer);
		this.httpServer.listen(port, () => console.log("Start Server: HTTP"));

	}

	public startHTTPS(config: ECSServerHTTPSConfig): void {

		this.initServer();

		if (config) this.httpsConfig = config;

		this.httpsServer = HTTPSServer.createServer({ cert: config.certificate, key: config.key }, this.expressServer);
		this.httpsServer.listen(config.port, () => console.log("Start Server: HTTPS"));

	}

	public stopHTTP(): void {

		if (!this.httpServer) throw new Error("The HTTP server is undefined. Cannot close.");
		this.httpServer.close(() => console.log("Stop Server: HTTP"));

	}

	public stopHTTPS(): void {

		if (!this.httpsServer) throw new Error("The HTTPS server is undefined. Cannot close.");
		this.httpsServer.close(() => console.log("Stop Server: HTTPS"));

	}

}