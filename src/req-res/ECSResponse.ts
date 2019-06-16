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
import { ECPrototype } from "@elijahjcobb/collections";
import { ECMime } from "@elijahjcobb/prototypes";

/**
 * A class representing a response from the server.
 */
export class ECSResponse extends ECPrototype {

	private readonly data: any;
	private readonly mime: ECMime;
	private readonly isRaw: boolean;
	private readonly name: string;

	/**
	 * Create a new response instance. Provide data of any type and an optional mime and name.
	 * @param data Any data type.
	 * @param {ECMime} mime An ECMime instance. Defaults to application/json.
	 * * @param {string} name The name of the file.
	 */
	public constructor(data: any, mime?: ECMime, name?: string) {

		super();

		this.data = data;
		this.isRaw = mime !== undefined;
		this.mime = mime || ECMime.initWithComponents("application", "json");
		this.name = name || ECGenerator.randomId();

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

}