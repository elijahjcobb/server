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

import { ECSRequest } from "../..";
import { ECTInput, ECTOutput, ECTValidator, ECTReport } from "@elijahjcobb/types";
import { ECPrototype } from "@elijahjcobb/collections";
import { ECErrorOriginType, ECErrorStack, ECErrorType } from "@elijahjcobb/error";

/**
 * A class to verify a request has a certain type signature.
 */
export class ECSTypeValidator extends ECPrototype {

	private readonly validator: ECTValidator;

	/**
	 * Provide a structure as an ECTInput instance from package @elijahjcobb/types.
	 * @param {ECTInput} structure An ECTInput instance.
	 */
	public constructor(structure: ECTInput) {

		super();

		this.validator = new ECTValidator(structure);

	}

	/**
	 * Verify a request.
	 * @param {ECSRequest} request The request.
	 * @return {Promise<void>} A promise.
	 */
	public async verifyRequest(request: ECSRequest): Promise<void> {

		this.validator.verify(request.getBody().toNativeObject());

	}

	/**
	 * Verify a object.
	 * @param {ECSRequest} object An object.
	 * @return {Promise<void>} A promise.
	 */
	public async verifyObject(object: object): Promise<void> {

		this.validator.verify(object);


	}
}