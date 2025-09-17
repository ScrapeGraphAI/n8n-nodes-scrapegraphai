import type { INodeProperties } from 'n8n-workflow';

export const smartcrawlerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
			},
		},
		options: [
			{
				name: 'Start Crawl',
				value: 'startCrawl',
				action: 'Start intelligent website crawling with AI-powered content extraction',
				description: 'Initiate intelligent website crawling with AI-powered content extraction or markdown conversion',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				action: 'Get smart crawling session status',
				description: 'Retrieve the status and results of a smart crawling session',
			},
			{
				name: 'Get All Sessions',
				value: 'getAllSessions',
				action: 'Get all smart crawling sessions',
				description: 'Retrieve all smart crawling sessions for the authenticated user',
			},
		],
		default: 'startCrawl',
	},
];

export const smartcrawlerFields: INodeProperties[] = [
	{
		displayName: 'Website URL',
		name: 'websiteUrl',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com',
		description: 'Starting URL for crawling',
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
				operation: ['startCrawl'],
			},
		},
	},
	{
		displayName: 'Input Queries',
		name: 'inputQueries',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Query',
		},
		placeholder: 'Add Query',
		default: { query: [{ text: '' }] },
		required: true,
		description: 'List of queries to answer during crawling (max 50)',
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
				operation: ['startCrawl'],
			},
		},
		options: [
			{
				name: 'query',
				displayName: 'Query',
				values: [
					{
						displayName: 'Text',
						name: 'text',
						type: 'string',
						default: '',
						placeholder: 'e.g., What are the main services offered?',
					},
				],
			},
		],
	},
	{
		displayName: 'Cache Website',
		name: 'cacheWebsite',
		type: 'boolean',
		default: true,
		description: 'Whether to cache the website',
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
				operation: ['startCrawl'],
			},
		},
	},
	{
		displayName: 'Extraction Mode',
		name: 'extractionMode',
		type: 'boolean',
		default: true,
		description: 'Use AI extraction (true) or markdown conversion (false)',
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
				operation: ['startCrawl'],
			},
		},
	},
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		default: '',
		description: 'Session identifier',
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
				operation: ['getStatus'],
			},
		},
	},
	{
		displayName: 'Filter by Status',
		name: 'filterStatus',
		type: 'options',
		options: [
			{
				name: 'All',
				value: '',
			},
			{
				name: 'Queued',
				value: 'queued',
			},
			{
				name: 'Processing',
				value: 'processing',
			},
			{
				name: 'Completed',
				value: 'completed',
			},
			{
				name: 'Failed',
				value: 'failed',
			},
		],
		default: '',
		description: 'Filter sessions by status',
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
				operation: ['getAllSessions'],
			},
		},
	},
]; 