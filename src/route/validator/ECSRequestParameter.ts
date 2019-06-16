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

import { ECPrototype, ECMap, ECArrayList } from "@elijahjcobb/collections";
import { ECSJSTypes } from "../..";

/**
 * Represent the different types of parameters that can be found on a request. Used by ECSTypeValidator.
 */
export class ECSRequestParameter extends ECPrototype {

	public readonly type: ECSJSTypes | ECMap<string, ECSJSTypes> | ECArrayList<ECSJSTypes>;
	public readonly optional: boolean;

	/**
	 * Create a new instance.
	 * @param {ECSJSTypes | ECMap<string, ECSJSTypes> | ECArrayList<ECSJSTypes>} type A valid type.
	 * @param {boolean} optional Whether the type can be optional.
	 */
	public constructor(type: ECSJSTypes | ECMap<string, ECSJSTypes> | ECArrayList<ECSJSTypes>, optional?: boolean) {

		super();

		this.type = type;

		if (optional === undefined || optional === null) {

			this.optional = false;

		} else {

			this.optional = optional;

		}

	}

}