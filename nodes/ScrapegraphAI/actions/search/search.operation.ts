import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';
import { safeRequest, parseJsonObject } from '../../transport/request';
import { fetchConfigField, buildFetchConfig } from '../../transport/fetchConfig';
import { makeOutputModeField, applyOutputMode } from '../../transport/output';

const RESOURCE = 'search';
const OPS = ['search'];

export const searchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [RESOURCE] } },
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Run a web search and fetch the top results',
				description: 'Returns top pages with content inline; optional AI rollup across all results',
			},
		],
		default: 'search',
	},
];

export const searchFields: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. best programming languages 2026',
		description: 'The search query',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS } },
	},
	{
		displayName: 'Number of Results',
		name: 'numResults',
		type: 'number',
		default: 3,
		typeOptions: { minValue: 1, maxValue: 20 },
		description: 'How many results to fetch (1–20)',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS } },
	},
	{
		displayName: 'Result Format',
		name: 'format',
		type: 'options',
		default: 'markdown',
		description: 'Format used for each result\'s inline content',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS } },
		options: [
			{ name: 'Markdown', value: 'markdown' },
			{ name: 'HTML', value: 'html' },
		],
	},
	{
		displayName: 'Use AI Rollup',
		name: 'useRollup',
		type: 'boolean',
		default: false,
		description: 'Whether to run an AI extraction across all fetched results',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS } },
	},
	{
		displayName: 'Rollup Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		placeholder: 'e.g. summarize the top recommendations',
		description: 'Prompt run across the fetched pages to produce a single structured summary',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS, useRollup: [true] } },
	},
	{
		displayName: 'Use JSON Schema',
		name: 'useSchema',
		type: 'boolean',
		default: false,
		description: 'Whether to constrain the AI rollup to a JSON schema',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS, useRollup: [true] } },
	},
	{
		displayName: 'Schema (JSON)',
		name: 'schema',
		type: 'json',
		default: '{\n  "type": "object",\n  "properties": {}\n}',
		description: 'JSON schema for the rollup output',
		displayOptions: {
			show: { resource: [RESOURCE], operation: OPS, useRollup: [true], useSchema: [true] },
		},
	},
	{
		displayName: 'Time Range',
		name: 'timeRange',
		type: 'options',
		default: '',
		description: 'Filter results to a recent time window',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS } },
		options: [
			{ name: 'Any Time', value: '' },
			{ name: 'Past 24 Hours', value: 'past_24_hours' },
			{ name: 'Past Hour', value: 'past_hour' },
			{ name: 'Past Month', value: 'past_month' },
			{ name: 'Past Week', value: 'past_week' },
			{ name: 'Past Year', value: 'past_year' },
		],
	},
	{
		displayName: 'Location (Country Code)',
		name: 'locationGeoCode',
		type: 'string',
		default: '',
		placeholder: 'e.g. us',
		description: 'Two-letter ISO country code for localized results',
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
	const query = this.getNodeParameter('query', itemIndex) as string;
	const numResults = this.getNodeParameter('numResults', itemIndex) as number;
	const format = this.getNodeParameter('format', itemIndex) as string;
	const useRollup = this.getNodeParameter('useRollup', itemIndex) as boolean;
	const timeRange = this.getNodeParameter('timeRange', itemIndex, '') as string;
	const locationGeoCode = this.getNodeParameter('locationGeoCode', itemIndex, '') as string;
	const outputMode = this.getNodeParameter('outputMode', itemIndex, 'simplified') as string;
	const outputFields = this.getNodeParameter('outputFields', itemIndex, '') as string;

	const body: IDataObject = { query, numResults };
	if (format !== 'markdown') body.format = format;
	if (timeRange) body.timeRange = timeRange;
	if (locationGeoCode) body.locationGeoCode = locationGeoCode;

	if (useRollup) {
		body.prompt = this.getNodeParameter('prompt', itemIndex) as string;
		const useSchema = this.getNodeParameter('useSchema', itemIndex) as boolean;
		if (useSchema) {
			const schemaRaw = this.getNodeParameter('schema', itemIndex) as string;
			body.schema = parseJsonObject.call(this, schemaRaw, 'Schema', itemIndex);
		}
	}

	const fetchConfig = buildFetchConfig.call(this, itemIndex);
	if (Object.keys(fetchConfig).length > 0) body.fetchConfig = fetchConfig;

	const response = await safeRequest.call(this, itemIndex, 'POST', '/search', body);

	return {
		json: applyOutputMode(outputMode, outputFields, response),
		pairedItem: { item: itemIndex },
	};
}
