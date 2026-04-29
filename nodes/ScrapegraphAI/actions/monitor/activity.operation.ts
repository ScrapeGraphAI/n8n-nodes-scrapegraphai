import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { safeRequest } from '../../transport/request';
import { MONITOR_RESOURCE, monitorIdLocator } from './monitor.resource';

export const activityFields: INodeProperties[] = [
	{
		...monitorIdLocator,
		displayOptions: { show: { resource: [MONITOR_RESOURCE], operation: ['activity'] } },
	},
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: true,
		description: 'Whether to return a simplified version of the response instead of the raw data',
		displayOptions: { show: { resource: [MONITOR_RESOURCE], operation: ['activity'] } },
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('cronId', itemIndex, '', { extractValue: true }) as string;
	const simplify = this.getNodeParameter('simplify', itemIndex) as boolean;

	const response = (await safeRequest.call(this, itemIndex, 'GET', `/monitor/${id}/activity`)) as IDataObject;

	const ticks = (response.ticks as IDataObject[]) ?? [];

	return ticks.map((t) => ({
		json: simplify
			? {
					id: t.id,
					status: t.status,
					createdAt: t.createdAt,
					elapsedMs: t.elapsedMs,
					changed: t.changed,
			  }
			: t,
		pairedItem: { item: itemIndex },
	}));
}
