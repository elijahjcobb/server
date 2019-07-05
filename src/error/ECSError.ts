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

export class ECSError {

	private message: string | undefined;
	private readonly genericMessage: string = "Internal server error.";
	private statusCode: number | undefined;
	private shouldObfuscate: boolean = true;

	public msg(value: string): ECSError {

		this.message = value;
		return this;

	}

	public code(value: number): ECSError {

		this.statusCode = value;
		return this;

	}

	public hide(): ECSError {

		this.shouldObfuscate = true;
		return this;

	}

	public show(): ECSError {

		this.shouldObfuscate = false;
		return this;

	}

	public get(): { status: number, message: string } {

		const res: { status: number, message: string } = {
			message: this.shouldObfuscate ? this.genericMessage : this.message as string,
			status: this.statusCode === undefined ? 500 : this.statusCode
		};

		console.error(`ECSError (${new Date().toString()}) {\n\tCODE: ${res.status}\n\tMESSAGE: ${res.message}\n}`);

		return res;
	}

	public static init(): ECSError { return new ECSError(); }

}