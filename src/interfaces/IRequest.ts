/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

export default interface IRequest {

	handler(): Response | Promise<Response>;

}