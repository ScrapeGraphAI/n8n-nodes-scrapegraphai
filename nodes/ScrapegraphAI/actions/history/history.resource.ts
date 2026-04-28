import type { INodeProperties } from 'n8n-workflow';

export const HISTORY_RESOURCE = 'history';

export const historyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [HISTORY_RESOURCE] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Retrieve a history entry',
				description: 'Fetch one entry by ID, including the full result payload (e.g. crawled page content via scrapeRefId)',
			},
			{
				name: 'Get Many',
				value: 'list',
				action: 'List history entries',
				description: 'Retrieve a paginated list of past requests, optionally filtered by service',
			},
		],
		default: 'get',
	},
];

export const historyIdLocator: INodeProperties = {
	displayName: 'Entry',
	name: 'entryId',
	type: 'resourceLocator',
	required: true,
	default: { mode: 'id', value: '' },
	description: 'The history entry to fetch — same UUID as the originating call (or any scrapeRefId from a crawl)',
	displayOptions: { show: { resource: [HISTORY_RESOURCE], operation: ['get'] } },
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Select an entry…',
			typeOptions: {
				searchListMethod: 'listHistory',
				searchable: true,
			},
		},
		{
			displayName: 'By ID',
			name: 'id',
			type: 'string',
			placeholder: 'e.g. 9701fc04-23de-4684-a48f-7e8fa287550b',
			validation: [
				{
					type: 'regex',
					properties: {
						regex: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
						errorMessage: 'Entry ID must be a UUID',
					},
				},
			],
		},
	],
};
