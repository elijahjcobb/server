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

import { ECSRequest, ECSResponse } from "../..";
import { ECArray, ECPrototype } from "@elijahjcobb/collections";
import { ObjectType, MalformedObjectError } from "typit";

/**
 * A class to verify a request has a certain type signature.
 */
export class ECSTypeValidator extends ECPrototype {

	private readonly validator: ObjectType;

	/**
	 * Provide a validator as an ECTInput instance from package @elijahjcobb/types.
	 * @param validator An ECTInput instance.
	 */
	public constructor(validator: ObjectType) {

		super();

		this.validator = validator;

	}

	/**
	 * Get all errors for the given object.
	 * @param object The object to be tested.
	 */
	public getErrors(object: object): ECArray<MalformedObjectError> {

		return ECArray.initFromNativeArray(this.validator.listNonConformities(object));

	}

	/**
	 * Verify a request.
	 * @param {ECSRequest} request The request.
	 * @return {Promise<void>} A promise.
	 */
	public verifyRequest(request: ECSRequest): ECSResponse | undefined {

		const errors: ECArray<MalformedObjectError> = this.getErrors(request.getBody().toNativeObject());
		if (errors.isEmpty()) return undefined;

		return new ECSResponse({
			data: {
				errors: {
					type: errors.map((error: MalformedObjectError): object => {

						return {
							path: error.readablePath,
							type: {
								expected: error.expectedType.getTypeName(),
								actual: error.actualType.getTypeName()
							},
							value: error.actualValue
						};

					})
				}
			},
			status: 406
		});

	}
}