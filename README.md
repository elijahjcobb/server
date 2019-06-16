# Server
Create a HTTP/S server easily with advances features and functionality.

## Import
#### Separately
```typescript
import { ECSServer, etc... } from "@elijahjcobb/server";
```
#### Combined
```typescript
import ECS from "@elijahjcobb/server";
let s: ECS.ECSServer;
```

## Initialize
At this point you can specify an error handler and add middleware to the server.

##### Error Handler:
The error handler you specify must follow the type specified by the `ECSErrorHandler` interface.

**NOTE**: The error handler will be called **after** an error is sent back to the request.

##### Middleware:
You can add middleware handlers to the server. The order in which you add them will be the order in which they are
called. These handlers will be called on every request before it is sent to the `AFRoute` instance's
`ECSRouterHandler` function.

#### Example:
```typescript
import {
	ECSServer,
	ECSErrorHandler,
	ECSMiddlewareHandler,
	ECSRequest
} from "@elijahjcobb/server";

import { 
	ECErrorStack 
} from "@elijahjcobb/error";

ECSServer.setErrorHandler((error: ECErrorStack) => {
	
	error.print();
	
});

ECSServer.addMiddleware(async (request: ECSRequest): Promise<void> => {
	
	console.log(request.getEndpoint());
	
});
```
## Creating a Router
Creating a router is very easy. Just create a class and extend `ECSRouter`. You will be required to specify a
`getRouter()` function. Inside the function you can return `this.createRouter()`. The reason this functions this
way is so you can also just return your own version of an `Express.Router` if you don't want to use this packages
`ECSRoute` method of creating a router.
```typescript
import { ECSRouter } from "@elijahjcobb/server";
import Express = require("express");

class MyRouter extends ECSRouter {
	
	public getRouter(): Express.Router {
		
		return this.createRouter();
		
	}
	

}
```
## Creating a Route
Once you have a router built, you can easily add routes to it. Extending `ECSRouter` will give your class a `routes`
property. The `routes` property has type: `ECArrayList<ECSRoute>`. View documentation on `ECArrayList` in the package
[`@elijahjcobb/collections`](https://www.npmjs.com/package/@elijahjcobb/collections).

> There are many different ways to make routes. In the example below there are few.

```typescript
import { ECSRequest, ECSRequestType, ECSResponse, ECSRoute, ECSRouter, ECSRouterHandler } from "@elijahjcobb/server";
import Express = require("express");

class MyRouter extends ECSRouter {
	
	// Route 3
	private async anotherWayToMakeAHandler(request: ECSRequest): Promise<ECSResponse> {

		let valueForKeyFooInBody: string = request.get("foo"); // or request.getBody().get("foo");

		//do stuff

		return new ECSResponse({ foo: valueForKeyFooInBody });
		
	}

	public getRouter(): Express.Router {
		
		// Route 1
		let route: ECSRoute = new ECSRoute(ECSRequestType.GET, "/route1",  async (request: ECSRequest): Promise<ECSResponse> => {
			
			let valueForKeyFooInBody: string = request.get("foo"); // or request.getBody().get("foo");
			
			//do stuff
			
			return new ECSResponse({ foo: valueForKeyFooInBody });
			
		});
		
		// Route 1
		this.routes.add(route);
		
		// Route 2
		this.routes.add(((): ECSRoute => {
			
			let yetAnotherWayToMakeHandler: ECSRouterHandler = async (request: ECSRequest): Promise<ECSResponse> => {

				let valueForKeyFooInBody: string = request.get("foo"); // or request.getBody().get("foo");

				//do stuff

				return new ECSResponse({ foo: valueForKeyFooInBody });
				
			};
			
			return new ECSRoute(ECSRequestType.GET, "/route2", yetAnotherWayToMakeHandler);
			
		})());
		
		// Route 3
		this.routes.add(new ECSRoute(ECSRequestType.GET, "/route3", this.anotherWayToMakeAHandler));

		return this.createRouter();

	}


}
```
## Responding to a Request
Every handler requires returning a Promise containing an `ECSResponse` instance. Make a response instance and return it.
The example below would take a number as `foo` in the body and return `foo + 1`.
```typescript
private async handlerForARequest(request: ECSRequest): Promise<ECSResponse> {

	let foo: number = request.get("foo");
		
	foo ++;
	
	return new ECSResponse({ foo });
		
}
```
## Starting Server
Once you create a router, just create a new instance of it and call the `getRouter()` method.
```typescript
let server: ECSServer = new ECSServer();

server.use("/", router); // An ECSRouter instance or subclass instance.

server.startHTTP(3000);
server.startHTTPS({
	port: 443,
	key: undefined,
	certificate: undefined
});

```
## Receiving Uploaded Files
When you create an `ECSRoute` you can set a `ECSRouteFileUpload` instance. Specify a mime and byte size. View
documentation on [`ECMime` here](https://github.com/elijahjcobb/prototypes/blob/master/dist/ECPrototypesMime.d.ts) or [`ECByteSize` here](https://github.com/elijahjcobb/prototypes/blob/master/dist/ECPrototypesByteSize.d.ts).
```typescript
this.routes.add(((): ECSRoute => {

	let upload: ECSRouteFileUpload = new ECSRouteFileUpload(ECMime.initWithComponents("image", "jpeg"), new ECByteSize(5, ECByteSizeUnit.Megabyte));
	return new ECSRoute(ECSRequestType.GET, "/route2", this.requestHandler, undefined, undefined, upload);

})());
```
## Sending Files
You can send files using the `ECSResponse` class. Just create a instance like you would for sending `JSON` but specify
a mime and name optionally.

```typescript
private async requestHandler(request: ECSRequest): Promise<ECSResponse> {
    
	let file: Buffer; // get your data
		
	return new ECSResponse(file, ECMime.initWithComponents("image", "jpeg"), "profile-picture.jpeg");
		
}
``` 

## Type Checking Requests
> documentation coming very very very soon...
## Authorization Validation
There are two main ways you can do this. You can either make or class, or just set a handler. It is up to you.

#### Setting Auth Handler
Just make a validator and use the `setAuthorizationValidatorFromHandler()` method.
```typescript
let validator: ECSValidator = new ECSValidator();

validator.setAuthorizationValidatorFromHandler(async (request: ECSRequest): Promise<void> => {
	
	// here is how to get a header.
	let authHeader: string = request.getHeader("Authorization");
			
    // just throw an ECErrorStack instance if it fails authorization, if it is good, just don't do anything.
    throw ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.PasswordIncorrect, new Error("Example error."));
			
});

let route: ECSRoute =  new ECSRoute(ECSRequestType.GET, "/route2", this.requestHandler, validator);
```

#### Making an Auth Class
Making a class is another way to handle authorization. Just implement `ECSAuthValidator`.

```typescript
class AuthValidator implements ECSAuthValidator {

	public async verifyRequest(request: ECSRequest): Promise<void> {
		
		// here is how to get a header.
		let authHeader: string = request.getHeader("Authorization");

		// just throw an ECErrorStack instance if it fails authorization, if it is good, just don't do anything.
		throw ECErrorStack.newWithMessageAndType(ECErrorOriginType.User, ECErrorType.PasswordIncorrect, new Error("Example error."));
		
	}
	
}

class MyRouter extends ECSRouter {


	public getRouter(): Express.Router {

		let validator: ECSValidator = new ECSValidator(undefined, new AuthValidator());

		let route: ECSRoute =  new ECSRoute(ECSRequestType.GET, "/route2", this.requestHandler, validator);

		return this.createRouter();

	}


}
```

## Post-Process Handling
A post-process handler is called after the response is sent. It is meant to be use when you want to compute things
without making the request just wait. It could be used for things like sending emails, transcoding files, etc. Just set
post-process handler on an `ECSRoute` instance.
```typescript
class MyRouter extends ECSRouter {

	private async requestHandler(request: ECSRequest): Promise<ECSResponse> {

		let valueForKeyFooInBody: string = request.get("foo"); // or request.getBody().get("foo");

		//do stuff

		return new ECSResponse({ foo: valueForKeyFooInBody });

	}
	
	private async requestPostProcessHandler(request: ECSRequest): Promise<void> {}
	
	public getRouter(): Express.Router {

		let route: ECSRoute =  new ECSRoute(ECSRequestType.GET, "/route2", this.requestHandler);
		route.setPostProcessHandler(this.requestPostProcessHandler);
		
		this.routes.add(route);
		return this.createRouter();

	}

}
```

## Error Handling
You can throw an `ECErrorStack` instance anywhere in the handlers and it will catch and send an error back to the
request. If you don't want the error to say `'Internal Server Error.'` just surround different methods around
`try {} catch ()` blocks and in the catch and throw an `ECErrorStack` instance with the error message you want to send
to the user.

## Documentation
Everything is completely documented. You can view the [declaration files](https://github.com/elijahjcobb/server/tree/master/dist) or even the [source code](https://github.com/elijahjcobb/server/tree/master/ts) on GitHub.

## Bugs
If you find any bugs please [create an issue on GitHub](https://github.com/elijahjcobb/server/issues) or if you are old fashioned, email me at [elijah@elijahcobb.com](mailto:elijah@elijahcobb.com).