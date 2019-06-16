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
 * A factory class to add middlewares and an error handler to a entire server.
 */
export class ECSServer extends ECPrototype {

	private expressServer: Express.Application;
	private httpServer: HTTPServer.Server;
	private httpsServer: HTTPSServer.Server;
	public httpConfig: ECSServerHTTPConfig;
	public httpsConfig: ECSServerHTTPSConfig;
	public routers: ECMap<string, ECSRouter> = new ECMap<string, ECSRouter>();
	public static middlewares: ECArrayList<ECSMiddlewareHandler> = new ECArrayList<ECSMiddlewareHandler>();
	public static errorHandler: ECSErrorHandler;
	public static authMiddleware: ECSAuthorizationMiddleware;

	public constructor(config?: { http: ECSServerHTTPConfig, https: ECSServerHTTPSConfig }) {

		super();

		if (!config) return;

		this.httpConfig = config.http;
		this.httpsConfig = config.https;

	}

	private initServer(): void {

		this.expressServer = Express();

		this.routers.forEach((mountingPoint: string, router: ECSRouter) => {

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

	public startHTTP(port?: number): void {

		this.initServer();

		if (port) this.httpConfig = { port };

		this.httpServer = HTTPServer.createServer(this.expressServer);
		this.httpServer.listen(this.httpConfig.port, () => console.log("Start Server: HTTP"));

	}

	public startHTTPS(config: ECSServerHTTPSConfig): void {

		this.initServer();

		if (config) this.httpsConfig = config;

		this.httpsServer = HTTPSServer.createServer({ cert: this.httpsConfig.certificate, key: this.httpsConfig.key }, this.expressServer);
		this.httpsServer.listen(this.httpsConfig.port, () => console.log("Start Server: HTTPS"));

	}

	public stopHTTP(): void {

		this.httpServer.close(() => console.log("Stop Server: HTTP"));

	}

	public stopHTTPS(): void {

		this.httpsServer.close(() => console.log("Stop Server: HTTPS"));

	}

}