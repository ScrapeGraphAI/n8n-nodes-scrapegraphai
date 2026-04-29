import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { safeRequest } from '../../transport/request';
import { MONITOR_RESOURCE, monitorIdLocator } from './monitor.resource';

export const pauseFields: INodeProperties[] = [
	{
		...monitorIdLocator,
		displayOptions: { show: { resource: [MONITOR_RESOURCE], operation: ['pause'] } },
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const id = this.getNodeParameter('cronId', itemIndex, '', { extractValue: true }) as string;
	await safeRequest.call(this, itemIndex, 'POST', `/monitor/${id}/pause`);
	return { json: { cronId: id, paused: true }, pairedItem: { item: itemIndex } };
}
