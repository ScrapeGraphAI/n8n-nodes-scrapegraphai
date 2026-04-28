import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { parseJsonObject } from './request';

export const fetchConfigField: INodeProperties = {
	displayName: 'Fetch Config',
	name: 'fetchConfig',
	type: 'collection',
	placeholder: 'Add Fetch Option',
	default: {},
	description: 'Controls how the page is fetched before processing',
	options: [
		{
			displayName: 'Cookies (JSON)',
			name: 'cookies',
			type: 'json',
			default: '',
			description: 'Cookies sent with the request as a JSON object',
		},
		{
			displayName: 'Country',
			name: 'country',
			type: 'string',
			default: '',
			placeholder: 'e.g. us',
			description: 'Two-letter ISO country code for geo-targeted proxy routing',
		},
		{
			displayName: 'Headers (JSON)',
			name: 'headers',
			type: 'json',
			default: '',
			description: 'Custom HTTP headers as a JSON object',
		},
		{
			displayName: 'Mode',
			name: 'mode',
			type: 'options',
			default: 'auto',
			description: 'Fetch strategy used to retrieve the page',
			options: [
				{ name: 'Auto', value: 'auto', description: 'Server picks the best provider chain' },
				{ name: 'Fast', value: 'fast', description: 'Direct HTTP fetch, no JS rendering' },
				{ name: 'JS', value: 'js', description: 'Headless browser with JavaScript rendering' },
			],
		},
		{
			displayName: 'Scrolls',
			name: 'scrolls',
			type: 'number',
			default: 0,
			typeOptions: { minValue: 0, maxValue: 100 },
			description: 'Number of times to scroll the page after load (for infinite-scroll content)',
		},
		{
			displayName: 'Stealth',
			name: 'stealth',
			type: 'boolean',
			default: false,
			description: 'Whether to enable residential proxy and anti-bot headers (uses extra credits)',
		},
		{
			displayName: 'Timeout (Ms)',
			name: 'timeout',
			type: 'number',
			default: 30000,
			typeOptions: { minValue: 1000, maxValue: 60000 },
			description: 'Request timeout in milliseconds',
		},
		{
			displayName: 'Wait (Ms)',
			name: 'wait',
			type: 'number',
			default: 0,
			typeOptions: { minValue: 0, maxValue: 30000 },
			description: 'Milliseconds to wait after the page loads before extracting',
		},
	],
};

export function buildFetchConfig(this: IExecuteFunctions, itemIndex: number): IDataObject {
	const raw = this.getNodeParameter('fetchConfig', itemIndex, {}) as IDataObject;
	const out: IDataObject = {};

	if (raw.mode && raw.mode !== 'auto') out.mode = raw.mode;
	if (raw.stealth) out.stealth = true;
	if (typeof raw.scrolls === 'number' && raw.scrolls > 0) out.scrolls = raw.scrolls;
	if (typeof raw.wait === 'number' && raw.wait > 0) out.wait = raw.wait;
	if (typeof raw.timeout === 'number' && raw.timeout !== 30000) out.timeout = raw.timeout;
	if (raw.country) out.country = raw.country;

	if (raw.headers) {
		const headers = parseJsonObject.call(this, raw.headers as string, 'Headers', itemIndex);
		if (Object.keys(headers).length > 0) out.headers = headers;
	}
	if (raw.cookies) {
		const cookies = parseJsonObject.call(this, raw.cookies as string, 'Cookies', itemIndex);
		if (Object.keys(cookies).length > 0) out.cookies = cookies;
	}

	return out;
}
