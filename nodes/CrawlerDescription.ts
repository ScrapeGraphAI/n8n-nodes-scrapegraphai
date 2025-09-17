import type { INodeProperties } from 'n8n-workflow';

export const crawlerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['crawler'],
			},
		},
		options: [
			{
				name: 'Start Crawl',
				value: 'startCrawl',
				action: 'Start comprehensive website crawling with sitemap support',
				description: 'Initiate comprehensive website crawling with sitemap support and AI extraction or markdown conversion',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				action: 'Get crawl job status and results',
				description: 'Retrieve the status and results of a crawling job by task ID',
			},
		],
		default: 'startCrawl',
	},
];

export const crawlerFields: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com',
		description: 'Starting URL for crawling',
		displayOptions: {
			show: {
				resource: ['crawler'],
				operation: ['startCrawl'],
			},
		},
	},
	{
		displayName: 'Extraction Mode',
		name: 'extractionMode',
		type: 'boolean',
		default: false,
		description: 'Use AI extraction (true) or markdown conversion (false)',
		displayOptions: {
			show: {
				resource: ['crawler'],
				operation: ['startCrawl'],
			},
		},
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		default: '',
		description: 'Extraction prompt (required if extraction mode is enabled)',
		displayOptions: {
			show: {
				resource: ['crawler'],
				operation: ['startCrawl'],
				extractionMode: [true],
			},
		},
	},
	{
		displayName: 'Depth',
		name: 'depth',
		type: 'number',
		default: 1,
		description: 'Maximum crawl depth from starting URL',
		displayOptions: {
			show: {
				resource: ['crawler'],
				operation: ['startCrawl'],
			},
		},
	},
	{
		displayName: 'Max Pages',
		name: 'maxPages',
		type: 'number',
		default: 20,
		description: 'Maximum number of pages to crawl',
		displayOptions: {
			show: {
				resource: ['crawler'],
				operation: ['startCrawl'],
			},
		},
	},
	{
		displayName: 'Use Sitemap',
		name: 'sitemap',
		type: 'boolean',
		default: false,
		description: 'Use sitemap for crawling',
		displayOptions: {
			show: {
				resource: ['crawler'],
				operation: ['startCrawl'],
			},
		},
	},
	{
		displayName: 'Render Heavy JS',
		name: 'renderHeavyJs',
		type: 'boolean',
		default: false,
		description: 'Enable heavy JavaScript rendering',
		displayOptions: {
			show: {
				resource: ['crawler'],
				operation: ['startCrawl'],
			},
		},
	},
	{
		displayName: 'Same Domain Only',
		name: 'sameDomain',
		type: 'boolean',
		default: true,
		description: 'Restrict crawling to same domain',
		displayOptions: {
			show: {
				resource: ['crawler'],
				operation: ['startCrawl'],
			},
		},
	},
	{
		displayName: 'Use Custom Output Schema',
		name: 'useOutputSchema',
		type: 'boolean',
		default: false,
		description: 'Whether to define a custom JSON schema for structured output',
		displayOptions: {
			show: {
				resource: ['crawler'],
				operation: ['startCrawl'],
				extractionMode: [true],
			},
		},
	},
	{
		displayName: 'Output Schema',
		name: 'outputSchema',
		type: 'json',
		required: true,
		default: '{\n  "type": "object",\n  "properties": {\n    "title": {\n      "type": "string"\n    },\n    "content": {\n      "type": "string"\n    }\n  }\n}',
		description: 'JSON schema for extraction output',
		displayOptions: {
			show: {
				resource: ['crawler'],
				operation: ['startCrawl'],
				extractionMode: [true],
				useOutputSchema: [true],
			},
		},
	},
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		default: '',
		description: 'Celery task identifier',
		displayOptions: {
			show: {
				resource: ['crawler'],
				operation: ['getStatus'],
			},
		},
	},
];
