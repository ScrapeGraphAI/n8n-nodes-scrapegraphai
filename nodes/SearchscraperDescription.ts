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
		displayName: 'Number of Results',
		name: 'numResults',
		type: 'options',
		default: 3,
		description: 'Number of websites to search and scrape',
		displayOptions: {
			show: {
				resource: ['searchscraper'],
				operation: ['search'],
			},
		},
		options: [
			{
				name: 'Standard (3 websites - 30 credits)',
				value: 3,
			},
			{
				name: 'Enhanced (5 websites - 50 credits)',
				value: 5,
			},
			{
				name: 'Deep Research (10 websites - 100 credits)',
				value: 10,
			},
			{
				name: 'Maximum (20 websites - 200 credits)',
				value: 20,
			},
		],
	},
	{
		displayName: 'Number of Scrolls',
		name: 'numberOfScrolls',
		type: 'number',
		default: 0,
		description: 'Number of times to scroll down the page to load more content (infinite scrolling)',
		displayOptions: {
			show: {
				resource: ['searchscraper'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Total Pages',
		name: 'totalPages',
		type: 'number',
		default: 1,
		description: 'Total number of pages to scrape for pagination',
		displayOptions: {
			show: {
				resource: ['searchscraper'],
				operation: ['search'],
			},
		},
	},
]; 