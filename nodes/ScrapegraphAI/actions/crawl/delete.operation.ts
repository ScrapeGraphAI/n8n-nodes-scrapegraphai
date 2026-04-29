import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { safeRequest } from '../../transport/request';
import { CRAWL_RESOURCE, crawlIdLocator } from './crawl.resource';

export const deleteFields: INodeProperties[] = [
	{
		...crawlIdLocator,
		displayOptions: { show: { resource: [CRAWL_RESOURCE], operation: ['delete'] } },
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const id = this.getNodeParameter('crawlId', itemIndex, '', { extractValue: true }) as string;
	await safeRequest.call(this, itemIndex, 'DELETE', `/crawl/${id}`);
	return { json: { id, deleted: true }, pairedItem: { item: itemIndex } };
}
