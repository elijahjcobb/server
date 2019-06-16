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

import { ECArrayList } from "@elijahjcobb/collections";
import { ECErrorStack, ECError, ECErrorType, ECErrorOriginType } from "@elijahjcobb/error";
import { ECSRequest, ECSResponse, ECSRoute, ECSRouterPostProcessHandler } from "..";
import { ECSRequestType } from "..";
import Express = require("express");
import BodyParser = require("body-parser");
import { ECSServer } from "../ECSServer";

/**
 * An class to be extended on instantiated that handles different routes and acts as a router.
 */
export class ECSRouter extends ECSServer {

	public routes: ECArrayList<ECSRoute> = new ECArrayList<ECSRoute>();
	public router: Express.Router = Express.Router();

	/**
	 * Notify the error handler that the package has exposed.
	 * @param {ECErrorStack} stack An ECErrorStack instance.
	 */
	private notifyErrorHandler(stack: ECErrorStack): void {

		if (ECSRouter.errorHandler) ECSRouter.errorHandler(stack);

	}

	/**
	 * Handle an internal error.
	 * @param {Error} error An error.
	 * @param {Express.Response} res A Express Response instance.
	 */
	private handleInternalError(error: any, res: Express.Response): void {

		res.status(500).json({
			error: "Internal server error.",
			timeStamp: Date.now()
		});

		let errorMessage: string = error instanceof Error ? error.message : error + "";
		let stack: ECErrorStack = ECErrorStack.newWithMessageAndType(ECErrorOriginType.Unhandled, ECErrorType.InternalUnHandled, new Error(errorMessage));
		stack.print();

		ECSRouter.prototype.notifyErrorHandler(stack);

	}

	/**
	 * Mutate errors caused from Express package to follow same format as package.
	 * @param {Error} error An error.
	 * @param {Express.Response} res A Express Response instance.
	 */
	private checkErrorForExpressOrigin(error: Error, res: Express.Response): void {

		let msg: string = error.message;

		if (!msg) {
			return this.handleInternalError(error, res);
		}

		if (msg === "request entity too large") {

			let stack: ECErrorStack = ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.FileToLarge, new Error("The file you tried to upload is too large."));
			this.handleError(stack, res);

		} else if ((msg.indexOf("JSON") !== -1)) {

			console.error(msg);

			let stack: ECErrorStack = ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.FailedToParseJSON, new Error("The JSON you supplied was not valid."));
			this.handleError(stack, res);

		} else {

			this.handleInternalError(error, res);

		}

	}

	/**
	 * Handle an error that is created.
	 * @param error An error.
	 * @param {Express.Response} res A Express Response instance.
	 */
	private handleError(error: any, res: Express.Response): void {

		if (error instanceof ECErrorStack) {

			let errorStack: ECErrorStack = error as ECErrorStack;
			let clientError: ECError = errorStack.getErrorForClient();
			res.status(400).json({
				error: clientError.getMessage(),
				origin: {
					value: clientError.getOrigin(),
					readable: clientError.getOriginString(),
				},
				type: {
					value: clientError.getType(),
					readable: clientError.getTypeString(),
				},
				timeStamp: Date.now()
			});

			errorStack.print();
			ECSRouter.prototype.notifyErrorHandler(errorStack);

		} else if (error instanceof ECError) {

			res.status(400).json({
				error: error.getMessage(),
				origin: {
					value: error.getOrigin(),
					readable: error.getOriginString(),
				},
				type: {
					value: error.getType(),
					readable: error.getTypeString(),
				},
				timeStamp: Date.now()
			});


		} else {

			this.checkErrorForExpressOrigin(error, res);

		}

	}

	/**
	 * Handle an error that is caused from the post process handler.
	 * @param error The error.
	 */
	private handlePostProcessError(error: any): void {

		if (error instanceof ECErrorStack) {

			let errorStack: ECErrorStack = error as ECErrorStack;
			errorStack.print();
			ECSRouter.prototype.notifyErrorHandler(errorStack);

		} else {

			if (typeof error === "string") {

				let stack: ECErrorStack = ECErrorStack.newWithMessageAndType(ECErrorOriginType.Unhandled, ECErrorType.InternalUnHandled, new Error(error));
				stack.print();
				ECSRouter.prototype.notifyErrorHandler(stack);

			} else {

				let stack: ECErrorStack = ECErrorStack.newWithMessageAndType(ECErrorOriginType.Unhandled, ECErrorType.InternalUnHandled, new Error("There was an internal unhandled error in post processing that resulted in an unknown type."));
				console.error(error);
				stack.print();
				ECSRouter.prototype.notifyErrorHandler(stack);

			}

		}

	}

	/**
	 * This is the main function from a ECSRouter. Call this method after you have added routes the instance.
	 * This method will compile all ECS instances into a Express.Router instance that can be used in a HTTP/S server.
	 * @return {Express.Router} An Express.Router instance from the ECSRoute instances on this instance.
	 */
	public createRouter(): Express.Router {

		let rootHandler: Function = async (route: ECSRoute, req: Express.Request, res: Express.Response): Promise<void> => {


			let request: ECSRequest = await ECSRequest.initWithRequest(req);

			if (route.getIsRawBody()) {
				let contentType: string = request.getHeader("Content-Type");
				if (!route.getAllowedMime().isMimeStringAllowed(contentType)) {
					let stack: ECErrorStack = ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.FileIncorrectType, new Error("Incorrect file type."));
					return this.handleError(stack, res);
				}
			}

			// Call the auth middleware function.
			if (ECSRouter.authMiddleware !== undefined) request = await ECSRouter.authMiddleware(request);

			if (route.getValidator() !== null && route.getValidator() !== undefined) {

				try {

					await route.getValidator().validate(request);

				} catch (e) {

					return this.handleError(e, res);

				}
			}

			try {

				for (let i: number = 0; i < ECSRouter.middlewares.size(); i ++) {

					await ECSRouter.middlewares.get(i)(request);
				}

			} catch (e) {

				return this.handleError(e, res);

			}

			route.getHandler()(request).then((value: ECSResponse) => {

				res.setHeader("X-Powered-By", "@elijahjcobb/server on NPM");

				if (value.getIsRaw()) {

					let data: Buffer = value.getData() as Buffer;

					res.writeHead(200, {
						"Content-Type": value.getMime().toString(),
						"Content-Disposition": `inline; filename=${value.getName()}.${value.getMime().extension}`,
						"Content-Length": data.length
					});

					res.end(data);

				} else {

					res.json(value.getData());

				}

				if (route.hasPostProcessHandler()) route.getPostProcessHandler()(request).then(() => {}).catch((err: any) => ECSRouter.prototype.handlePostProcessError(err));

			}).catch((error: any) => {

				this.handleError(error, res);

			});
		};

		this.routes.forEach((route: ECSRoute) => {

			let parserMiddleware: Express.RequestHandler;

			if (route.getIsRawBody()) {
				parserMiddleware = BodyParser.raw({
					inflate: true,
					limit: route.getBodySizeLimit().toString(),
					type: route.getAllowedMime().toString()
				});
			} else {
				parserMiddleware = BodyParser.json();
			}

			switch (route.getMethod()) {
				case ECSRequestType.POST:
					this.router.post(route.getEndpoint(), parserMiddleware, (req: Express.Request, res: Express.Response) => {
						rootHandler(route, req, res).then(() => {}).catch((err: any) => this.handleError(err, res));
					});
					break;
				case ECSRequestType.PUT:
					this.router.put(route.getEndpoint(), parserMiddleware, (req: Express.Request, res: Express.Response) => {
						rootHandler(route, req, res).then(() => {}).catch((err: any) => this.handleError(err, res));
					});
					break;
				case ECSRequestType.DELETE:
					this.router.delete(route.getEndpoint(), parserMiddleware, (req: Express.Request, res: Express.Response) => {
						rootHandler(route, req, res).then(() => {}).catch((err: any) => this.handleError(err, res));
					});
					break;
				case ECSRequestType.OPTIONS:
					this.router.options(route.getEndpoint(), parserMiddleware, (req: Express.Request, res: Express.Response) => {
						rootHandler(route, req, res).then(() => {}).catch((err: any) => this.handleError(err, res));
					});
					break;
				default:
					this.router.get(route.getEndpoint(), parserMiddleware, (req: Express.Request, res: Express.Response) => {
						rootHandler(route, req, res).then(() => {}).catch((err: any) => this.handleError(err, res));
					});
					break;
			}
		});

		this.router.use((err: Error, req: Express.Request, res: Express.Response, next: Function) => {
			if (err) {
				this.handleError(err, res);
			} else {
				next();
			}
		});

		return this.router;
	}

	/**
	 * A required method on a ECSRouter instance. Add the routes for the router to this.routes property and then return
	 * this.createRouter() from this class.
	 * @return {Express.Router}
	 */
	public getRouter(): Express.Router {

		return this.createRouter();

	}

	public add(route: ECSRoute): void {

		this.routes.add(route);;

	}

}