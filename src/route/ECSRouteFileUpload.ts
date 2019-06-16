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

import { ECMime, ECByteSize } from "@elijahjcobb/prototypes";
import { ECPrototype } from "@elijahjcobb/collections";

/**
 * A class handling file uploads.
 */
export class ECSRouteFileUpload extends ECPrototype {

	private readonly mime: ECMime;
	private readonly fileSize: ECByteSize;

	/**
	 * Create a new instance.
	 * @param {ECMime} mime The mime allowed for files.
	 * @param {ECByteSize} fileSize The maximum file size allowed.
	 */
	public constructor(mime: ECMime, fileSize: ECByteSize) {

		super();

		this.mime = mime;
		this.fileSize = fileSize;

	}

	/**
	 * Get the mime allowed for the upload.
	 * @return {ECMime} An ECMime instance.
	 */
	public getMime(): ECMime {

		return this.mime;

	}

	/**
	 * Get the file size allowed.
	 * @return { ECByteSize } An ECByteSize instance.
	 */
	public getFileSize(): ECByteSize {

		return this.fileSize;

	}

}