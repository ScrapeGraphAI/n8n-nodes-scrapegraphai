import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { safeRequest } from '../../transport/request';
import { CRAWL_RESOURCE, crawlIdLocator } from './crawl.resource';

export const resumeFields: INodeProperties[] = [
	{
		...crawlIdLocator,
		displayOptions: { show: { resource: [CRAWL_RESOURCE], operation: ['resume'] } },
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const id = this.getNodeParameter('crawlId', itemIndex, '', { extractValue: true }) as string;
	await safeRequest.call(this, itemIndex, 'POST', `/crawl/${id}/resume`);
	return { json: { id, resumed: true }, pairedItem: { item: itemIndex } };
}
