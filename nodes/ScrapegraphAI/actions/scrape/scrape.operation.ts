import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';
import { safeRequest } from '../../transport/request';
import { fetchConfigField, buildFetchConfig } from '../../transport/fetchConfig';
import { makeFormatsField, buildFormats } from '../../transport/formats';
import { makeOutputModeField, applyOutputMode } from '../../transport/output';

const RESOURCE = 'scrape';
const OPS = ['scrape'];

export const scrapeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [RESOURCE] } },
		options: [
			{
				name: 'Scrape',
				value: 'scrape',
				action: 'Scrape a page in one or more formats',
				description: 'Fetch a URL and return any combination of markdown, HTML, links, images, summary, JSON, branding, or screenshot',
			},
		],
		default: 'scrape',
	},
];

export const scrapeFields: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. https://example.com',
		description: 'Public URL of the page to fetch',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS } },
	},
	makeFormatsField(RESOURCE, OPS),
	{
		displayName: 'Content Type',
		name: 'contentType',
		type: 'string',
		default: '',
		placeholder: 'e.g. text/html',
		description: 'Override the auto-detected content type (e.g. for PDFs)',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS } },
	},
	{
		...fetchConfigField,
		displayOptions: { show: { resource: [RESOURCE], operation: OPS } },
	},
	...makeOutputModeField(RESOURCE, OPS),
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const url = this.getNodeParameter('url', itemIndex) as string;
	const contentType = this.getNodeParameter('contentType', itemIndex, '') as string;
	const outputMode = this.getNodeParameter('outputMode', itemIndex, 'simplified') as string;
	const outputFields = this.getNodeParameter('outputFields', itemIndex, '') as string;

	const body: IDataObject = {
		url,
		formats: buildFormats.call(this, itemIndex),
	};
	if (contentType) body.contentType = contentType;

	const fetchConfig = buildFetchConfig.call(this, itemIndex);
	if (Object.keys(fetchConfig).length > 0) body.fetchConfig = fetchConfig;

	const response = await safeRequest.call(this, itemIndex, 'POST', '/scrape', body);

	return {
		json: applyOutputMode(outputMode, outputFields, response),
		pairedItem: { item: itemIndex },
	};
}
