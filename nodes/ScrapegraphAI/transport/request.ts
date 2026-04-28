import type { IExecuteFunctions, IHttpRequestMethods, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { buildV2Error } from './errors';

export const API_BASE_URL = 'https://v2-api.scrapegraphai.com/api';

export async function apiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	path: string,
	body?: IDataObject,
): Promise<unknown> {
	return this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
		method,
		url: `${API_BASE_URL}${path}`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body,
		json: true,
	});
}

export async function safeRequest(
	this: IExecuteFunctions,
	itemIndex: number,
	method: IHttpRequestMethods,
	path: string,
	body?: IDataObject,
): Promise<unknown> {
	try {
		return await apiRequest.call(this, method, path, body);
	} catch (err) {
		throw buildV2Error.call(this, err, itemIndex);
	}
}

export function parseJsonParam(
	this: IExecuteFunctions,
	value: string,
	displayName: string,
	itemIndex: number,
): unknown {
	if (!value || value.trim() === '') return {};
	try {
		return JSON.parse(value);
	} catch (err) {
		throw new NodeOperationError(
			this.getNode(),
			`The '${displayName}' parameter must be valid JSON [item ${itemIndex}]`,
			{
				description:
					(err as Error).message +
					`. Check the JSON syntax in the '${displayName}' field — keys and string values need double quotes, no trailing commas.`,
				itemIndex,
			},
		);
	}
}

export function parseJsonObject(
	this: IExecuteFunctions,
	value: string,
	displayName: string,
	itemIndex: number,
): IDataObject {
	const parsed = parseJsonParam.call(this, value, displayName, itemIndex);
	if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new NodeOperationError(
			this.getNode(),
			`The '${displayName}' parameter must be a JSON object [item ${itemIndex}]`,
			{
				description: `Use {} for an empty object, or describe a key-value structure. Arrays and primitives are not accepted here.`,
				itemIndex,
			},
		);
	}
	return parsed as IDataObject;
}
