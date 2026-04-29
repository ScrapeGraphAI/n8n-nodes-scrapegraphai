import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';
import { safeRequest, parseJsonObject } from '../../transport/request';
import { fetchConfigField, buildFetchConfig } from '../../transport/fetchConfig';
import { makeOutputModeField, applyOutputMode } from '../../transport/output';

const RESOURCE = 'extract';
const OPS = ['extract'];

export const extractOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [RESOURCE] } },
		options: [
			{
				name: 'Extract',
				value: 'extract',
				action: 'Extract structured data with an LLM prompt',
				description: 'Run an AI extraction over a URL, raw HTML, or markdown',
			},
		],
		default: 'extract',
	},
];

export const extractFields: INodeProperties[] = [
	{
		displayName: 'Source',
		name: 'source',
		type: 'options',
		default: 'url',
		description: 'Where the content to extract comes from',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS } },
		options: [
			{ name: 'URL', value: 'url', description: 'Fetch a URL and extract from it' },
			{ name: 'HTML', value: 'html', description: 'Extract from raw HTML you provide' },
			{ name: 'Markdown', value: 'markdown', description: 'Extract from markdown you provide' },
		],
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. https://example.com',
		description: 'Public URL of the page to extract from',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS, source: ['url'] } },
	},
	{
		displayName: 'HTML',
		name: 'html',
		type: 'string',
		typeOptions: { rows: 6 },
		required: true,
		default: '',
		description: 'Raw HTML content to extract from (max 2 MB)',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS, source: ['html'] } },
	},
	{
		displayName: 'Markdown',
		name: 'markdown',
		type: 'string',
		typeOptions: { rows: 6 },
		required: true,
		default: '',
		description: 'Markdown content to extract from (max 2 MB)',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS, source: ['markdown'] } },
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: { rows: 3 },
		required: true,
		default: '',
		placeholder: 'e.g. extract product name and price',
		description: 'Natural-language description of what to extract',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS } },
	},
	{
		displayName: 'Use JSON Schema',
		name: 'useSchema',
		type: 'boolean',
		default: false,
		description: 'Whether to constrain the LLM output to a JSON schema',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS } },
	},
	{
		displayName: 'Schema (JSON)',
		name: 'schema',
		type: 'json',
		default:
			'{\n  "type": "object",\n  "properties": {\n    "title": { "type": "string" }\n  },\n  "required": ["title"]\n}',
		description: 'JSON schema describing the desired output shape',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS, useSchema: [true] } },
	},
	{
		displayName: 'HTML Mode',
		name: 'mode',
		type: 'options',
		default: 'normal',
		description: 'Pre-processing applied to the source HTML',
		displayOptions: { show: { resource: [RESOURCE], operation: OPS, source: ['url', 'html'] } },
		options: [
			{ name: 'Normal', value: 'normal' },
			{ name: 'Reader', value: 'reader' },
			{ name: 'Prune', value: 'prune' },
		],
	},
	{
		...fetchConfigField,
		displayOptions: { show: { resource: [RESOURCE], operation: OPS, source: ['url'] } },
	},
	...makeOutputModeField(RESOURCE, OPS),
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const source = this.getNodeParameter('source', itemIndex) as 'url' | 'html' | 'markdown';
	const prompt = this.getNodeParameter('prompt', itemIndex) as string;
	const useSchema = this.getNodeParameter('useSchema', itemIndex) as boolean;
	const mode = this.getNodeParameter('mode', itemIndex, 'normal') as string;
	const outputMode = this.getNodeParameter('outputMode', itemIndex, 'simplified') as string;
	const outputFields = this.getNodeParameter('outputFields', itemIndex, '') as string;

	const body: IDataObject = { prompt };

	if (source === 'url') {
		body.url = this.getNodeParameter('url', itemIndex) as string;
		const fetchConfig = buildFetchConfig.call(this, itemIndex);
		if (Object.keys(fetchConfig).length > 0) body.fetchConfig = fetchConfig;
	} else if (source === 'html') {
		body.html = this.getNodeParameter('html', itemIndex) as string;
	} else {
		body.markdown = this.getNodeParameter('markdown', itemIndex) as string;
	}

	if ((source === 'url' || source === 'html') && mode !== 'normal') body.mode = mode;
	if (useSchema) {
		const schemaRaw = this.getNodeParameter('schema', itemIndex) as string;
		body.schema = parseJsonObject.call(this, schemaRaw, 'Schema', itemIndex);
	}

	const response = await safeRequest.call(this, itemIndex, 'POST', '/extract', body);

	return {
		json: applyOutputMode(outputMode, outputFields, response),
		pairedItem: { item: itemIndex },
	};
}
