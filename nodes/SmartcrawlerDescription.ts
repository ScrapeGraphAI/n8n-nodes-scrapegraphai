import type { INodeProperties } from 'n8n-workflow';

export const smartcrawlerOperations: INodeProperties[] = [];

export const smartcrawlerFields: INodeProperties[] = [
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		description: 'The URL to crawl',
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
			},
		},
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		required: true,
		default: '',
		description: 'AI prompt for content extraction',
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
			},
		},
	},
	{
		displayName: 'Cache Website',
		name: 'cacheWebsite',
		type: 'boolean',
		default: true,
		description: 'Whether to cache the website content',
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
			},
		},
	},
	{
		displayName: 'Depth',
		name: 'depth',
		type: 'number',
		default: 2,
		description: 'Crawling depth (number of levels)',
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
			},
		},
	},
	{
		displayName: 'Max Pages',
		name: 'maxPages',
		type: 'number',
		default: 2,
		description: 'Maximum number of pages to crawl',
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
			},
		},
	},
	{
		displayName: 'Same Domain Only',
		name: 'sameDomainOnly',
		type: 'boolean',
		default: true,
		description: 'Whether to crawl only pages from the same domain',
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
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
				resource: ['smartcrawler'],
			},
		},
	},
	{
		displayName: 'Output Schema',
		name: 'outputSchema',
		type: 'json',
		required: true,
		default: '{\n  "type": "object",\n  "title": "CrawlResultSchema",\n  "properties": {\n    "companies": {\n      "type": "array",\n      "title": "companies",\n      "description": "List of companies",\n      "items": {\n        "$ref": "#/$defs/CompanySchema"\n      }\n    }\n  },\n  "required": ["companies"],\n  "$defs": {\n    "CompanySchema": {\n      "type": "object",\n      "title": "CompanySchema",\n      "properties": {\n        "name": {\n          "type": "string",\n          "title": "name",\n          "description": "Company name"\n        },\n        "description": {\n          "type": "string",\n          "title": "description",\n          "description": "Company description"\n        },\n        "website": {\n          "type": "string",\n          "title": "website",\n          "description": "Company website URL"\n        }\n      },\n      "required": ["name", "description"]\n    }\n  }\n}',
		description: 'JSON schema to structure the output. Define properties with types and descriptions.',
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
				useOutputSchema: [true],
			},
		},
	},
	{
		displayName: 'Render Heavy JS',
		name: 'renderHeavyJs',
		type: 'boolean',
		default: false,
		description: 'Whether to render JavaScript-heavy websites (additional credits will be charged)',
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
			},
		},
	},
]; 