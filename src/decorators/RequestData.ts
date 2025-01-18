/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

import IRequestData from "../interfaces/IRequestData";

export default function RequestData(data: IRequestData): ClassDecorator {
	return (target: Function): void => {
		(target as any).requestData = data;
	};
}
