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
import { ECSTypeValidator } from "./ECSTypeValidator";
import { ECSRequest } from "../..";
import { ECSAuthValidator, ECSAuthValidatorHandler } from "./ECSAuthValidator";

/**
 * A class that is passed to a ECSRoute that acts as a validator to check both authorization and types on a request.
 */
export class ECSValidator extends ECPrototype {

	public typeValidator: ECSTypeValidator;
	public authorizationValidator: ECSAuthValidator;

	/**
	 * Create a new instance.
	 * @param {ECSTypeValidator} typeValidator A ECSTypeValidator instance.
	 * @param {ECSAuthValidator} authorizationValidator A ECSAuthValidator instance.
	 */
	public constructor(typeValidator?: ECSTypeValidator, authorizationValidator?: ECSAuthValidator) {

		super();

		this.typeValidator = typeValidator;
		this.authorizationValidator = authorizationValidator;

	}

	/**
	 * Set an auth validation handler so you don't have to make a class for just for an authorization validator if you
	 * don't want to.
	 *
	 * @param {ECSAuthValidatorHandler} handler A function that follows ECSAuthValidatorHandler interface.
	 */
	public setAuthorizationValidatorFromHandler(handler: ECSAuthValidatorHandler): void {

		this.authorizationValidator = {
			verifyRequest: handler
		};

	}

	/**
	 * Validate a request.
	 * @param {ECSRequest} request The request to be validated.
	 * @return {Promise<void>} A promise.
	 */
	public async validate(request: ECSRequest): Promise<void> {

		if (this.typeValidator !== null && this.typeValidator !== undefined) {

			await this.typeValidator.verifyRequest(request);

		}

		if (this.authorizationValidator !== null && this.authorizationValidator !== undefined) {

			await this.authorizationValidator.verifyRequest(request);

		}

	}
}