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
]; 