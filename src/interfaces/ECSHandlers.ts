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

import { ECErrorStack } from "@elijahjcobb/error";
import { ECSRequest, ECSResponse } from "..";

/**
 * An interface to represent what is required of an error handler.
 */
export interface ECSErrorHandler {

	/**
	 * Take an ECErrorStack instance as input and do not return anything.
	 * @param {ECErrorStack} error
	 */
	(error: ECErrorStack): void;

}

/**
 * An interface to represent what is required of an router handler.
 */
export interface ECSRouterHandler {

	/**
	 * Take an ECSRequest instance as input and return a Promise that wraps an ECSResponse instance.
	 * @param {ECSRequest} request An ECSRequest instance.
	 * @return {Promise<ECSResponse>} A promise.
	 */
	(request: ECSRequest): Promise<ECSResponse>;

}

/**
 * An interface to represent what is required of an middleware handler.
 */
export interface ECSMiddlewareHandler {

	/**
	 * Take an ECSRequest instance as input and return a Promise.
	 * @param {ECSRequest} request An ECSRequest instance.
	 * @return {Promise<void>} A promise.
	 */
	(request: ECSRequest): Promise<void>;

}

/**
 * An interface to represent what is required of an post-process handler.
 */
export interface ECSRouterPostProcessHandler {

	/**
	 * Take an ECSRequest instance as input and return a Promise.
	 * @param {ECSRequest} request An ECSRequest instance.
	 * @return {Promise<void>} A promise.
	 */
	(request: ECSRequest): Promise<void>;

}

/**
 * An interface for an optional authorization middleware.
 */
export interface ECSAuthorizationMiddleware {

	/**
	 * Receive a request and return the request. You can use the request.setSession() method.
	 * @param {ECSRequest} request A request instance.
	 * @return {Promise<ECSRequest>} A request instance.
	 */
	(request: ECSRequest): Promise<ECSRequest>;

}