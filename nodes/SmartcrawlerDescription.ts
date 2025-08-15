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
				name: 'Crawl',
				value: 'crawl',
				action: 'Give it a single URL – the AI crawler will follow every internal link, going deep into the site to extract structured data across multiple pages.',
				description: 'Give it a single URL – the AI crawler will follow every internal link, going deep into the site to extract structured data across multiple pages.',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				action: 'Get the status and results of a crawl job using its task ID.',
				description: 'Get the status and results of a crawl job using its task ID.',
			},
		],
		default: 'crawl',
	},
];

export const smartcrawlerFields: INodeProperties[] = [
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		default: '',
		description: 'The task ID returned from a crawl operation',
		displayOptions: {
			show: {
				resource: ['smartcrawler'],
				operation: ['getStatus'],
			},
		},
	},
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
				operation: ['crawl'],
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
				operation: ['crawl'],
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
				operation: ['crawl'],
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
				operation: ['crawl'],
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
				operation: ['crawl'],
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
				operation: ['crawl'],
			},
		},
	},
]; 