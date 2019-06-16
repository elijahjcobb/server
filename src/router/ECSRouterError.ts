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

import { ECErrorStack, ECErrorOriginType, ECErrorType } from "@elijahjcobb/error";

/**
 * A helper class providing lots of errors.
 */
export abstract class ECSRouterError {

	/**
	 * Throw an error because a parameter was not found that is required.
	 * @param {string} parameter The parameter name.
	 * @param {string} origin Where the parameter should be.
	 */
	public static throwParameterNotFoundError(parameter: string, origin?: string): void {

		let msg: string = ".";
		if (origin) {
			msg = ` in ${origin}.`;
		}

		throw ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.ParameterNotFound, new Error(`You must specify a '${parameter}'${msg}`));

	}

	/**
	 * Throw an error because a required file was not found.
	 */
	public static throwFileNotFoundError(): void {

		throw ECErrorStack.newWithMessageAndType(ECErrorOriginType.FrontEnd, ECErrorType.NullOrUndefined, new Error(`The file you are trying to access does not exist.`));

	}

	/**
	 * Throw an error because a date was invalid.
	 * @param {string} key The parameter name.
	 */
	public static throwInvalidDateError(key: string): void {

		throw ECErrorStack.newWithMessageAndType(ECErrorOriginType.FrontEnd, ECErrorType.AnswerNotValid, new Error(`The ${key} date you supplied was not valid.`));

	}

	/**
	 * Throw an error because a parameter was an incorrect format.
	 * @param {string} parameter The parameter name.
	 * @param {string} origin Where the parameter should be.
	 */
	public static throwParameterIncorrectFormatError(parameter: string, origin?: string): void {

		let msg: string = ".";

		if (origin) {
			msg = ` in ${origin}.`;
		}

		throw ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.ParameterIncorrectFormat, new Error(`'${parameter}' incorrect format${msg}`));

	}

	/**
	 * Throw an error because a parameter does not match a specific regex.
	 * @param {string} parameter The name of the parameter.
	 * @param {string} origin Where a parameter should be.
	 */
	public static throwParamaeterDoesNotMatchRegex(parameter: string, origin?: string): void {

		let msg: string = ".";

		if (origin) {
			msg = ` in ${origin}.`;
		}

		throw ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.ParameterDoesNotMatchRegex, new Error(`'${parameter}' does match regex${msg}`));

	}

	/**
	 * Throw an error because a parameter was an incorrect type.
	 * @param {string} parameter The parameter name.
	 * * @param {string} type The parameter type.
	 * @param {string} location Where the parameter should be.
	 */
	public static throwParameterIncorrectType(parameter: string, type: string, location: string): void {

		throw ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.ParameterIncorrectFormat, new Error(`${parameter} in ${location} is incorrect type. Should be '${type}'.`));

	}

	/**
	 * Throw an error because a password is required and not found.
	 */
	public static throwPasswordRequiredError(): void {

		throw ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.PasswordRequired, new Error(`You must specify "password" to make this request.`));

	}

	/**
	 * Throw an error because the password specified is incorrect.
	 */
	public static throwPasswordIncorrectError(): void {

		throw ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.PasswordIncorrect, new Error(`The "password" you specified is incorrect.`));

	}

	/**
	 * Throw an error because the request does not have permission to access a specific object.
	 * @param {string} object The object's name.
	 */
	public static throwPermissionDeniedError(object: string): void {

		throw ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.PermissionDenied, new Error(`You do not have access to this ${object}.`));

	}

}