import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { safeRequest } from '../../transport/request';
import { CRAWL_RESOURCE, crawlIdLocator } from './crawl.resource';

export const stopFields: INodeProperties[] = [
	{
		...crawlIdLocator,
		displayOptions: { show: { resource: [CRAWL_RESOURCE], operation: ['stop'] } },
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const id = this.getNodeParameter('crawlId', itemIndex, '', { extractValue: true }) as string;
	await safeRequest.call(this, itemIndex, 'POST', `/crawl/${id}/stop`);
	return { json: { id, stopped: true }, pairedItem: { item: itemIndex } };
}
