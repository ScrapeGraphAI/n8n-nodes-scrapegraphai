import type { INodeProperties } from 'n8n-workflow';

export const smartscraperOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['smartscraper'],
			},
		},
		options: [
			{
				name: 'Scrape',
				value: 'scrape',
				action: 'Autonomously extract live data from any website perfect for e commerce job boards lead capture and more',
				description: 'Autonomously extract live data from any website – perfect for e-commerce, job boards, lead capture and more',
			},
		],
		default: 'scrape',
	},
];

export const smartscraperFields: INodeProperties[] = [
	{
		displayName: 'Website URL',
		name: 'websiteUrl',
		type: 'string',
		required: true,
		default: '',
		description: 'URL of the website to scrape',
		displayOptions: {
			show: {
				resource: ['smartscraper'],
				operation: ['scrape'],
			},
		},
	},
	{
		displayName: 'User Prompt',
		name: 'userPrompt',
		type: 'string',
		required: true,
		default: '',
		description: 'Instructions for what data to extract from the website',
		displayOptions: {
			show: {
				resource: ['smartscraper'],
				operation: ['scrape'],
			},
		},
	},
	{
		displayName: 'Use Custom Output Schema',
		name: 'useOutputSchema',
		type: 'boolean',
		default: false,
		description: 'Enable to define a custom JSON schema for structured output',
		displayOptions: {
			show: {
				resource: ['smartscraper'],
				operation: ['scrape'],
			},
		},
	},
	{
		displayName: 'Output Schema',
		name: 'outputSchema',
		type: 'json',
		required: true,
		default: '{\n  "type": "object",\n  "title": "ProductSchema",\n  "properties": {\n    "title": {\n      "type": "string",\n      "title": "title",\n      "description": "Product title"\n    },\n    "price": {\n      "type": "number",\n      "title": "price",\n      "description": "Product price"\n    },\n    "description": {\n      "type": "string",\n      "title": "description",\n      "description": "Product description"\n    }\n  },\n  "required": ["title", "price", "description"]\n}',
		description: 'JSON schema to structure the output. Define properties with types and descriptions.',
		displayOptions: {
			show: {
				resource: ['smartscraper'],
				operation: ['scrape'],
				useOutputSchema: [true],
			},
		},
	},
	{
		displayName: 'Render Heavy JS',
		name: 'renderHeavyJs',
		type: 'boolean',
		default: false,
		description: 'Enable to render JavaScript-heavy websites (additional credits will be charged)',
		displayOptions: {
			show: {
				resource: ['smartscraper'],
				operation: ['scrape'],
			},
		},
	},
]; 