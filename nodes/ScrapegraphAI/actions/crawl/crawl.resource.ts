import type { INodeProperties } from 'n8n-workflow';

export const CRAWL_RESOURCE = 'crawl';

export const crawlOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [CRAWL_RESOURCE] } },
		options: [
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a crawl permanently',
				description: 'Permanently remove a crawl record and its stored pages',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				action: 'Retrieve a crawl job',
				description: 'Poll a crawl job for progress and per-page results',
			},
			{
				name: 'Resume',
				value: 'resume',
				action: 'Resume a stopped crawl',
				description: 'Continue a stopped crawl from its last frontier',
			},
			{
				name: 'Start',
				value: 'start',
				action: 'Start an async multi page crawl',
				description: 'Kick off a new crawl job and return its ID',
			},
			{
				name: 'Stop',
				value: 'stop',
				action: 'Stop a crawl in progress',
				description: 'Halt an in-flight crawl; already-fetched pages remain available',
			},
		],
		default: 'start',
	},
];

export const crawlIdLocator: INodeProperties = {
	displayName: 'Crawl Job',
	name: 'crawlId',
	type: 'resourceLocator',
	required: true,
	default: { mode: 'id', value: '' },
	description: 'The crawl job to act on',
	displayOptions: {
		show: { resource: [CRAWL_RESOURCE], operation: ['getStatus', 'stop', 'resume', 'delete'] },
	},
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Select a crawl…',
			typeOptions: {
				searchListMethod: 'listCrawls',
				searchable: true,
			},
		},
		{
			displayName: 'By ID',
			name: 'id',
			type: 'string',
			placeholder: 'e.g. 79694e03-f2ea-43f2-93cc-7c6fc26f999a',
			validation: [
				{
					type: 'regex',
					properties: {
						regex: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
						errorMessage: 'Crawl ID must be a UUID',
					},
				},
			],
		},
	],
};
