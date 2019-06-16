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

import Express = require("express");
import { ECMap, ECDictionary, ECPrototype } from "@elijahjcobb/collections";
import { ECSRequestType, ECSRequestProtocol } from "..";

/**
 * A class representing a request to the server. All information provided to the server is evident on the instance.
 */
export class ECSRequest extends ECPrototype {

	private timeStamp: number;
	private ip: string;
	private endpoint: string;
	private body: ECMap<string, any>;
	private cookies: ECMap<string, any>;
	private method: ECSRequestType;
	private hostName: string;
	private url: string;
	private protocol: ECSRequestProtocol;
	private instance: Express.Request;
	private rawBody: Buffer;
	private session: any;

	public constructor() {

		super();

	}

	/**
	 * Get a value from the body of the request.
	 * @param {string} key The key to use.
	 * @return {any} The value in the body the key is paired to.
	 */
	public get(key: string): any {

		return this.body.get(key);

	}

	/**
	 * Get the timestamp the request was sent.
	 * @return {number}
	 */
	public getTimeStamp(): number {

		return this.timeStamp;

	}

	/**
	 * Get the ip address the request is from.
	 * If localhost, the ip will be '1.1.1.1'.
	 * @return {string}
	 */
	public getIP(): string {

		return this.ip;

	}

	/**
	 * Get the body of the request raw as a buffer.
	 * @return {Buffer} A buffer.
	 */
	public getRawBody(): Buffer {

		return this.rawBody;

	}

	/**
	 * Get the endpoint the request was sent to.
	 * @return {string}
	 */
	public getEndpoint(): string {

		return this.endpoint;

	}

	/**
	 * Get the body of the request.
	 * @return {ECDictionary<string, any>} The body of the request as an ECDictionary instance.
	 */
	public getBody(): ECDictionary<string, any> {

		return this.body.toDictionary();

	}

	/**
	 * Get the cookies of the request.
	 * @return {ECDictionary<string, any>} The cookies of the request as an ECDictionary instance.
	 */
	public getCookies(): ECDictionary<string, any> {

		return this.cookies.toDictionary();

	}

	/**
	 * Get the method type that the request is using.
	 * @return {ECSRequestType} A value from the ECSRequestType enum.
	 */
	public getMethodType(): ECSRequestType {

		return this.method;

	}

	/**
	 * Get the hostname the request was sent to.
	 * @return {string} The hostname of the request.
	 */
	public getHostName(): string {

		return this.hostName;

	}

	/**
	 * Get the url of the request.
	 * @return {string} The request.
	 */
	public getURL(): string {

		return this.url;

	}

	/**
	 * Get the protocol type of the request.
	 * @return {ECSRequestProtocol} A value from the ECSRequestProtocol enum.
	 */
	public getProtocolType(): ECSRequestProtocol {

		return this.protocol;

	}

	/**
	 * Get the protocol of the request as a string.
	 * @return {string} The protocol as a string.
	 */
	public getProtocolTypeString(): string {

		return ECSRequestProtocol[this.protocol];

	}

	/**
	 * Get a specific header by key.
	 * @param {string} header The key for the header.
	 * @return {string} The value for the header.
	 */
	public getHeader(header: string): string {

		return this.instance.get(header);

	}

	public setSession(session: any): void {

		this.session = session;

	}

	public getSession<T>(): T {

		return this.session as T;

	}

	/**
	 * Get the request method type from a string.
	 * @param {string} methodString The method string.
	 * @return {ECSRequestType} An ECSRequestType value.
	 */
	public static methodTypeFromString(methodString: string): ECSRequestType {

		switch (methodString.toUpperCase()) {
			case "GET":
				return ECSRequestType.GET;
			case "POST":
				return ECSRequestType.POST;
			case "PUT":
				return ECSRequestType.PUT;
			case "DELETE":
				return ECSRequestType.DELETE;
		}

	}

	/**
	 * Get the request protocol type from a string.
	 * @param {string} protocolString The protocol string.
	 * @return {ECSRequestProtocol} A ECSRequestProtocol value.
	 */
	public static protocolTypeFromString(protocolString: string): ECSRequestProtocol {

		switch (protocolString) {
			case "http":
				return ECSRequestProtocol.HTTP;
			case "https":
				return ECSRequestProtocol.HTTPS;
			case "ws":
				return ECSRequestProtocol.WS;
			case "wss":
				return ECSRequestProtocol.WSS;
		}
	}

	/**
	 * Create a new instance from a Express Request instance.
	 * @param {Express.Request} req A Express.Request instance.
	 * @return {Promise<ECSRequest>} A new ECSRequest instance.
	 */
	public static async initWithRequest(req: Express.Request): Promise<ECSRequest> {

		let request: ECSRequest = new ECSRequest();

		request.instance = req;
		request.timeStamp = Date.now();

		request.ip = req.ip === "::1" ? "1.1.1.1" : req.ip;
		request.ip = request.ip.replace("::ffff:", "");

		request.endpoint = req.path;
		request.rawBody = req["body"];

		request.cookies = ECMap.initWithNativeObject<string>(req["cookies"]);

		if (req["cookies"] == null) request.cookies = new ECMap<string, any>();

		request.method = ECSRequest.methodTypeFromString(req.method);
		request.hostName = req.hostname;
		request.url = req.originalUrl;
		request.protocol = ECSRequest.protocolTypeFromString(req.protocol);

		if (request.method === ECSRequestType.GET) {

			request.body = ECMap.initWithNativeObject<string>(req.query);
			if (req.query == null) request.body = new ECMap<string, any>();

		} else {

			request.body = ECMap.initWithNativeObject(req["body"]);
			if (req["body"] == null) request.body = new ECMap<string, any>();

		}


		return request;

	}

}