import type { INodeProperties } from 'n8n-workflow';

export const scrapeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['scrape'],
			},
		},
		options: [
			{
				name: 'Scrape',
				value: 'scrape',
				action: 'Scrape webpage content with optional javascript rendering',
				description: 'Scrape webpage content with optional JavaScript rendering',
			},
		],
		default: 'scrape',
	},
];

export const scrapeFields: INodeProperties[] = [
	{
		displayName: 'Website URL',
		name: 'websiteUrl',
		type: 'string',
		required: true,
		default: '',
		description: 'URL of the website to scrape',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['scrape'],
			},
		},
	},
	{
		displayName: 'Render Heavy JS',
		name: 'renderHeavyJs',
		type: 'boolean',
		default: false,
		description: 'Whether to render heavy JavaScript content on the page',
		displayOptions: {
			show: {
				resource: ['scrape'],
				operation: ['scrape'],
			},
		},
	},
];