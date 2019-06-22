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
import { ECSMiddlewareHandler, ECSRequest, ECSResponse, ECSRoute, ECSRouterPostProcessHandler, ECSValidator } from "..";
import { ECSRequestType } from "..";
import Express = require("express");
import BodyParser = require("body-parser");
import { ECSServer } from "../ECSServer";
import { ECMime } from "@elijahjcobb/prototypes";
import { ECSError } from "../error/ECSError";

/**
 * An class to be extended on instantiated that handles different routes and acts as a router.
 */
export class ECSRouter extends ECSServer {

	public routes: ECArrayList<ECSRoute> = new ECArrayList<ECSRoute>();
	public router: Express.Router = Express.Router();

	public constructor() {

		super();

	}

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

		const errorMessage: string = error instanceof Error ? error.message + "\n" + error.stack : error + "";
		const stack: ECErrorStack = ECErrorStack.newWithMessageAndType(ECErrorOriginType.Unhandled, ECErrorType.InternalUnHandled, new Error(errorMessage));
		stack.print();

		ECSRouter.prototype.notifyErrorHandler(stack);

	}

	/**
	 * Mutate errors caused from Express package to follow same format as package.
	 * @param {Error} error An error.
	 * @param {Express.Response} res A Express Response instance.
	 */
	private checkErrorForExpressOrigin(error: Error, res: Express.Response): void {

		const msg: string = error.message;

		if (!msg) {
			return this.handleInternalError(error, res);
		}

		if (msg === "request entity too large") {

			const stack: ECErrorStack = ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.FileToLarge, new Error("The file you tried to upload is too large."));
			this.handleError(stack, res);

		} else if ((msg.indexOf("JSON") !== -1)) {

			console.error(msg);

			const stack: ECErrorStack = ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.FailedToParseJSON, new Error("The JSON you supplied was not valid."));
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

			const errorStack: ECErrorStack = error as ECErrorStack;
			const clientError: ECError = errorStack.getErrorForClient();
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


		} else if (error instanceof ECSError) {

			const values: { message: string, status: number } = error.get();
			res.status(values.status).json({ error: values.message });

		} else {

			this.checkErrorForExpressOrigin(error, res);

		}

	}

	/**
	 * This is the main function from a ECSRouter. Call this method after you have added routes the instance.
	 * This method will compile all ECS instances into a Express.Router instance that can be used in a HTTP/S server.
	 * @return {Express.Router} An Express.Router instance from the ECSRoute instances on this instance.
	 */
	public createRouter(): Express.Router {

		const rootHandler: (route: ECSRoute, req: Express.Request, res: Express.Response) => Promise<void> = async (route: ECSRoute, req: Express.Request, res: Express.Response): Promise<void> => {


			let request: ECSRequest = new ECSRequest(req);

			if (route.getIsRawBody()) {

				const contentType: string | undefined = request.getHeader("Content-Type");

				if (!contentType) {
					const stack: ECErrorStack = ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.NullOrUndefined, new Error("Content-Type header is not present."));
					return this.handleError(stack, res);
				}

				const mime: ECMime | undefined = route.getAllowedMime();
				if (mime === undefined || !mime.isMimeStringAllowed(contentType)) {
					const stack: ECErrorStack = ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.FileIncorrectType, new Error("Incorrect file type. Mime invalid."));
					return this.handleError(stack, res);
				}
			}

			// Call the auth middleware function. To set session information.
			if (ECSRouter.authMiddleware !== undefined) request = await ECSRouter.authMiddleware(request);

			const validator: ECSValidator | undefined = route.getValidator();
			if (validator) {

				let responseError: ECSResponse | undefined;

				try {

					responseError = await validator.validate(request);

				} catch (e) {

					return this.handleError(e, res);

				}

				if (responseError) {

					res.status(responseError.getStatus()).json(responseError.getData());
					return;
				}
			}

			try {

				await ECSRouter.middlewares.forEachSync( async (middleware: ECSMiddlewareHandler): Promise<void> => await middleware(request));

			} catch (e) {

				return this.handleError(e, res);

			}

			route.getHandler()(request).then((value: ECSResponse) => {

				value.getHeaders().forEach((key: string, value: string | number) => res.setHeader(key, value));
				res.setHeader("X-Powered-By", "@elijahjcobb/server on NPM");

				if (value.getIsRaw()) {

					const data: Buffer = value.getData() as Buffer;

					res.writeHead(value.getStatus(), {
						"Content-Type": value.getMime().toString(),
						"Content-Disposition": `inline; filename=${value.getName()}.${value.getMime().extension}`,
						"Content-Length": data.length
					});

					res.end(data);

				} else {

					res.status(value.getStatus()).json(value.getData());

				}

				const postProcessHandler: ECSRouterPostProcessHandler | undefined = route.getPostProcessHandler();
				if (postProcessHandler) {
					postProcessHandler(request)
						.then(() => {})
						.catch((err: any) => ECSRouter.handlePostProcessError(err));
				}

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

	/**
	 * Add a route to this router.
	 * @param route A n ECSQRoute instance.
	 */
	public add(route: ECSRoute): void {

		this.routes.add(route);

	}

	/**
	 * Handle an error that is caused from the post process handler.
	 * @param error The error.
	 */
	private static handlePostProcessError(error: any): void {

		if (error instanceof ECErrorStack) {

			const errorStack: ECErrorStack = error as ECErrorStack;
			errorStack.print();
			ECSRouter.prototype.notifyErrorHandler(errorStack);

		} else {

			if (typeof error === "string") {

				const stack: ECErrorStack = ECErrorStack.newWithMessageAndType(ECErrorOriginType.Unhandled, ECErrorType.InternalUnHandled, new Error(error));
				stack.print();
				ECSRouter.prototype.notifyErrorHandler(stack);

			} else {

				const stack: ECErrorStack = ECErrorStack.newWithMessageAndType(ECErrorOriginType.Unhandled, ECErrorType.InternalUnHandled, new Error("There was an internal unhandled error in post processing that resulted in an unknown type."));
				console.error(error);
				stack.print();
				ECSRouter.prototype.notifyErrorHandler(stack);

			}

		}

	}


}