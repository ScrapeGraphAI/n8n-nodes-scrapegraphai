import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { safeRequest } from '../../transport/request';
import { MONITOR_RESOURCE, monitorIdLocator } from './monitor.resource';

export const getFields: INodeProperties[] = [
	{
		...monitorIdLocator,
		displayOptions: { show: { resource: [MONITOR_RESOURCE], operation: ['get'] } },
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const id = this.getNodeParameter('cronId', itemIndex, '', { extractValue: true }) as string;
	const response = await safeRequest.call(this, itemIndex, 'GET', `/monitor/${id}`);
	return { json: response as IDataObject, pairedItem: { item: itemIndex } };
}
