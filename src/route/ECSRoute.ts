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

import { ECPrototype } from "@elijahjcobb/collections";
import { ECByteSize, ECByteSizeUnit, ECMime } from "@elijahjcobb/prototypes";
import { ECSRouteFileUpload } from "./ECSRouteFileUpload";
import { ECSRequestType, ECSRouterHandler, ECSRouterPostProcessHandler } from "..";
import { ECSValidator } from "./validator/ECSValidator";
import { ECPrototypesByteSizeUnit } from "@elijahjcobb/prototypes/dist/ECPrototypesByteSizeUnit";
import { ECPrototypesMime } from "@elijahjcobb/prototypes/dist/ECPrototypesMime";

/**
 * A class representing a route on the server. Used by a ECSRouter.
 */
export class ECSRoute extends ECPrototype {

	private handler: ECSRouterHandler;
	private readonly method: ECSRequestType;
	private readonly endpoint: string;
	private readonly isRawBody: boolean;
	private readonly bodySizeLimit: ECByteSize | undefined;
	private readonly allowedMime: ECMime | undefined;
	private readonly validator: ECSValidator | undefined;
	private postProcessHandler: ECSRouterPostProcessHandler | undefined;

	/**
	 * Create a new ECSRoute instance (an endpoint).
	 * @param {ECSRequestType} method The HTTP method type as an ECSRequestType enum value.
	 * @param {string} endpoint The endpoint (does not need '/' prefix).
	 * @param {ECSRouterHandler} handler The handler that deals with the request.
	 * @param {ECSValidator} validator A validator to be used to validate the request before the handler operates.
	 * @param {ECSRouterPostProcessHandler} postProcessHandler A handler to be run after the response to the request is sent.
	 * @param {ECSRouteFileUpload} endpointUpload A configuration to allow a file upload.
	 */
	public constructor(method: ECSRequestType, endpoint: string, handler: ECSRouterHandler, validator?: ECSValidator, postProcessHandler?: ECSRouterPostProcessHandler, endpointUpload?: ECSRouteFileUpload) {

		super();

		this.method = method;
		this.endpoint = endpoint;
		this.handler = handler;
		this.validator = validator;
		this.postProcessHandler = postProcessHandler;
		if (endpointUpload !== undefined) {
			this.isRawBody = true;
			this.bodySizeLimit = endpointUpload.getFileSize() || new ECByteSize(5, ECByteSizeUnit.Megabyte);
			this.allowedMime = endpointUpload.getMime() || ECMime.initWithComponents("*", "*");
		} else {
			this.isRawBody = false;
		}

	}

	/**
	 * Set the handler for the request.
	 * @param {ECSRouterHandler} handler A function that follows ECSRouterHandler interface.
	 */
	public setHandler(handler: ECSRouterHandler): void {

		this.handler = handler;

	}

	/**
	 * Set the post process handler for the request.
	 * This handler is called after the response is sent.
	 * @param {ECSRouterPostProcessHandler} handler A function that follows ECSRouterPostProcessHandler interface.
	 */
	public setPostProcessHandler(handler: ECSRouterPostProcessHandler): void {

		this.postProcessHandler = handler;

	}

	/**
	 * Get the post process handler.
	 * @return {ECSRouterPostProcessHandler} A ECSRouterPostProcessHandler function.
	 */
	public getPostProcessHandler(): ECSRouterPostProcessHandler | undefined {

		return this.postProcessHandler;

	}

	/**
	 * Checks if a route has a post process handler.
	 * @return {boolean} A boolean.
	 */
	public hasPostProcessHandler(): boolean {

		return this.postProcessHandler !== undefined && this.postProcessHandler !== null;

	}

	/**
	 * Get the request type.
	 * @return {ECSRequestType} A ECSRequestType enum value.
	 */
	public getMethod(): ECSRequestType {

		return this.method;

	}

	/**
	 * Get the endpoint the route operates on.
	 * @return {string} A string.
	 */
	public getEndpoint(): string {

		let endpoint: string = this.endpoint;
		const firstChar: string = endpoint.charAt(0);
		if (firstChar === "/") endpoint = endpoint.substr(1, endpoint.length - 1);
		endpoint = "/" + endpoint;

		return endpoint;

	}

	/**
	 * Get the handler that operates on the request.
	 * @return {ECSRouterHandler} The handler.
	 */
	public getHandler(): ECSRouterHandler {

		return this.handler;

	}

	/**
	 * Checks if the route is a raw body route.
	 * @return {boolean} A boolean.
	 */
	public getIsRawBody(): boolean {

		return this.isRawBody;

	}

	/**
	 * Get the body size limit for the route.
	 * @return {ECByteSize} An ECByteSize instance.
	 */
	public getBodySizeLimit(): ECByteSize {

		return this.bodySizeLimit || new ECByteSize(100, ECPrototypesByteSizeUnit.Megabyte);

	}

	/**
	 * Gets the allowed mime for the route.
	 * @return {ECMime} An ECMime instance.
	 */
	public getAllowedMime(): ECMime {

		return this.allowedMime || ECMime.initWithComponents("application", "json");

	}

	/**
	 * Get the validator for the route.
	 * @return {ECSValidator} An ECSValidator instance.
	 */
	public getValidator(): ECSValidator | undefined {

		return this.validator;

	}

}