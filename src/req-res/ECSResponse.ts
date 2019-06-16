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

import { ECGenerator } from "@elijahjcobb/encryption";
import { ECDictionary, ECPrototype } from "@elijahjcobb/collections";
import { ECMime } from "@elijahjcobb/prototypes";

/**
 * @param data The data to be returned.
 * @param status The status to be returned.
 * @param name The name of the file to be returned.
 * @param mime The mime of the file to be returned.
 */
export type ECSResponseConstructor = {
	mime?: ECMime;
	name?: string;
	status?: number;
	headers?: ECSHeader;
};

export type ECSHeader = {
	[key: string]: string | number
};

/**
 * A class representing a response from the server.
 */
export class ECSResponse extends ECPrototype {

	private readonly data: any;
	private readonly mime: ECMime;
	private readonly isRaw: boolean;
	private readonly name: string;
	private readonly status: number;
	private readonly headers: ECSHeader;

	/**
	 * Create a new response instance. Provide data of any type and an optional mime and name.
	 * @param data The data to respond with.
	 * @param object An object conforming to ECSResponseConstructor.
	 */
	public constructor(data: any, object: ECSResponseConstructor = {}) {

		super();

		this.data = data;
		this.isRaw = object.mime !== undefined;
		this.mime = object.mime || ECMime.initWithComponents("application", "json");
		this.name = object.name || ECGenerator.randomId();
		this.status = object.status || 200;
		this.headers = object.headers || {};

	}

	/**
	 * Get the data from the response.
	 * @return {any}
	 */
	public getData(): any {

		return this.data;

	}

	/**
	 * Get the mime of the response.
	 * @return {ECPrototypesMime}
	 */
	public getMime(): ECMime {

		return this.mime;

	}

	/**
	 * Check whether or not the data is raw.
	 * @return {boolean}
	 */
	public getIsRaw(): boolean {

		return this.isRaw;

	}

	/**
	 * Get the name of the file for the resposne.
	 * @return {string}
	 */
	public getName(): string {

		return this.name;

	}

	/**
	 * Get the status of the response.
	 */
	public getStatus(): number {

		return this.status;

	}

	public getHeaders(): ECDictionary<string, string | number> {

		return ECDictionary.initWithNativeObject(this.headers);

	}

}