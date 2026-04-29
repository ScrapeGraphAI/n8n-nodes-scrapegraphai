import type { INodeProperties } from 'n8n-workflow';

export const MONITOR_RESOURCE = 'monitor';

export const monitorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [MONITOR_RESOURCE] } },
		options: [
			{ name: 'Create', value: 'create', action: 'Create a monitor', description: 'Schedule a recurring fetch with change detection' },
			{ name: 'Delete', value: 'delete', action: 'Delete a monitor permanently', description: 'Remove a monitor and its tick history' },
			{ name: 'Get', value: 'get', action: 'Retrieve a monitor', description: 'Fetch one monitor by ID' },
			{ name: 'Get Activity', value: 'activity', action: 'Retrieve tick history for a monitor', description: 'Return recent ticks with diff flags' },
			{ name: 'Get Many', value: 'list', action: 'List monitors', description: 'Retrieve a list of monitors' },
			{ name: 'Pause', value: 'pause', action: 'Pause a monitor', description: 'Halt future ticks while keeping the monitor record' },
			{ name: 'Resume', value: 'resume', action: 'Resume a paused monitor', description: 'Re-arm a paused monitor and put it back on schedule' },
			{ name: 'Update', value: 'update', action: 'Update a monitor', description: 'Modify schedule, formats, webhook, or fetch options' },
		],
		default: 'create',
	},
];

export const monitorIdLocator: INodeProperties = {
	displayName: 'Monitor',
	name: 'cronId',
	type: 'resourceLocator',
	required: true,
	default: { mode: 'id', value: '' },
	description: 'The monitor to act on',
	displayOptions: {
		show: {
			resource: [MONITOR_RESOURCE],
			operation: ['get', 'update', 'pause', 'resume', 'delete', 'activity'],
		},
	},
	modes: [
		{
			displayName: 'From List',
			name: 'list',
			type: 'list',
			placeholder: 'Select a monitor…',
			typeOptions: {
				searchListMethod: 'listMonitors',
				searchable: true,
			},
		},
		{
			displayName: 'By ID',
			name: 'id',
			type: 'string',
			placeholder: 'e.g. d9a09a07-5052-4262-a0b4-606cbd942287',
			validation: [
				{
					type: 'regex',
					properties: {
						regex: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
						errorMessage: 'Monitor ID must be a UUID',
					},
				},
			],
		},
	],
};
