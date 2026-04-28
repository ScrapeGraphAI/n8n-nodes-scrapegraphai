import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { safeRequest } from '../../transport/request';
import { HISTORY_RESOURCE } from './history.resource';

const OPS = ['list'];

export const listFields: INodeProperties[] = [
	{
		displayName: 'Service Filter',
		name: 'service',
		type: 'options',
		default: '',
		description: 'Filter to entries for a single service',
		displayOptions: { show: { resource: [HISTORY_RESOURCE], operation: OPS } },
		options: [
			{ name: 'All Services', value: '' },
			{ name: 'Crawl', value: 'crawl' },
			{ name: 'Extract', value: 'extract' },
			{ name: 'Monitor', value: 'monitor' },
			{ name: 'Schema', value: 'schema' },
			{ name: 'Scrape', value: 'scrape' },
			{ name: 'Search', value: 'search' },
		],
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1 },
		description: 'Page number to fetch (1-indexed)',
		displayOptions: { show: { resource: [HISTORY_RESOURCE], operation: OPS } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		description: 'Max number of results to return',
		displayOptions: { show: { resource: [HISTORY_RESOURCE], operation: OPS } },
	},
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: true,
		description: 'Whether to return a simplified version of the response instead of the raw data',
		displayOptions: { show: { resource: [HISTORY_RESOURCE], operation: OPS } },
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const service = this.getNodeParameter('service', itemIndex) as string;
	const page = this.getNodeParameter('page', itemIndex) as number;
	const limit = this.getNodeParameter('limit', itemIndex) as number;
	const simplify = this.getNodeParameter('simplify', itemIndex) as boolean;

	const qs: string[] = [];
	if (service) qs.push(`service=${encodeURIComponent(service)}`);
	if (page > 1) qs.push(`page=${page}`);
	if (limit !== 50) qs.push(`limit=${limit}`);
	const path = qs.length > 0 ? `/history?${qs.join('&')}` : '/history';

	const response = (await safeRequest.call(this, itemIndex, 'GET', path)) as IDataObject;

	const entries = (response.data as IDataObject[]) ?? [];

	return entries.map((e) => ({
		json: simplify
			? {
					id: e.id,
					service: e.service,
					status: e.status,
					elapsedMs: e.elapsedMs,
					createdAt: e.createdAt,
					requestParentId: e.requestParentId,
					url: (e.params as IDataObject | undefined)?.url,
			  }
			: e,
		pairedItem: { item: itemIndex },
	}));
}
