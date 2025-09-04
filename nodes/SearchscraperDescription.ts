import type { INodeProperties } from 'n8n-workflow';

export const searchscraperOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['searchscraper'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Perform ai powered site wide search and structured data extraction ideal for knowledge retrieval',
				description: 'Perform AI-powered site-wide search and structured data extraction – ideal for knowledge retrieval',
			},
		],
		default: 'search',
	},
];

export const searchscraperFields: INodeProperties[] = [
	{
		displayName: 'User Prompt',
		name: 'userPrompt',
		type: 'string',
		required: true,
		default: '',
		description: 'Search query or instructions for what to search and extract',
		displayOptions: {
			show: {
				resource: ['searchscraper'],
				operation: ['search'],
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
				resource: ['searchscraper'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Output Schema',
		name: 'outputSchema',
		type: 'json',
		required: true,
		default: '{\n  "type": "object",\n  "title": "SearchResultSchema",\n  "properties": {\n    "articles": {\n      "type": "array",\n      "title": "articles",\n      "description": "List of articles",\n      "items": {\n        "$ref": "#/$defs/ArticleSchema"\n      }\n    }\n  },\n  "required": ["articles"],\n  "$defs": {\n    "ArticleSchema": {\n      "type": "object",\n      "title": "ArticleSchema",\n      "properties": {\n        "title": {\n          "type": "string",\n          "title": "title",\n          "description": "Article title"\n        },\n        "author": {\n          "type": "string",\n          "title": "author",\n          "description": "Author name"\n        },\n        "publishDate": {\n          "type": "string",\n          "title": "publishDate",\n          "description": "Publication date"\n        }\n      },\n      "required": ["title", "author"]\n    }\n  }\n}',
		description: 'JSON schema to structure the output. Define properties with types and descriptions.',
		displayOptions: {
			show: {
				resource: ['searchscraper'],
				operation: ['search'],
				useOutputSchema: [true],
			},
		},
	},
]; 