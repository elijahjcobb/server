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

import { ECSRequest, ECSRequestType, ECSResponse, ECSRoute, ECSRouter, ECSServer } from "./index";
import * as Express from "express";

const server: ECSServer = new ECSServer();

class Child extends ECSRouter {

	private async handler(req: ECSRequest): Promise<ECSResponse> {

		return new ECSResponse({foo: 1});

	}

	public getRouter(): Express.Router {

		this.add(new ECSRoute(
			ECSRequestType.GET,
			"/",
			this.handler

		));

		return this.createRouter();
	}

}

class Parent extends ECSRouter {

	public getRouter(): Express.Router {

		this.use("/c", new Child());

		return this.createRouter();
	}

}

class Grandparent extends ECSRouter {

	private async handler(req: ECSRequest): Promise<ECSResponse> {

		return new ECSResponse({foo: 1});

	}

	public getRouter(): Express.Router {

		this.use("/p", new Parent());
		this.add(new ECSRoute(
			ECSRequestType.GET,
			"/foo",
			this.handler
		));

		return this.createRouter();
	}

}

server.use("/g", new Grandparent());
git
server.startHTTP(3000);