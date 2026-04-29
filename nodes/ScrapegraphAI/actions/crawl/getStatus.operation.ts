import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';
import { safeRequest } from '../../transport/request';
import { CRAWL_RESOURCE, crawlIdLocator } from './crawl.resource';

export const getStatusFields: INodeProperties[] = [
	{
		...crawlIdLocator,
		displayOptions: { show: { resource: [CRAWL_RESOURCE], operation: ['getStatus'] } },
	},
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: true,
		description: 'Whether to return a simplified version of the response instead of the raw data',
		displayOptions: { show: { resource: [CRAWL_RESOURCE], operation: ['getStatus'] } },
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const id = this.getNodeParameter('crawlId', itemIndex, '', { extractValue: true }) as string;
	const simplify = this.getNodeParameter('simplify', itemIndex) as boolean;

	const response = (await safeRequest.call(this, itemIndex, 'GET', `/crawl/${id}`)) as IDataObject;

	if (!simplify) return { json: response, pairedItem: { item: itemIndex } };

	const pages = Array.isArray(response.pages) ? (response.pages as IDataObject[]) : [];
	const out: IDataObject = {
		id: response.id,
		status: response.status,
		total: response.total,
		finished: response.finished,
		pages: pages.map((p) => ({
			url: p.url,
			status: p.status,
			depth: p.depth,
			title: p.title,
			contentType: p.contentType,
			links: p.links,
			scrapeRefId: p.scrapeRefId,
		})),
	};

	return { json: out, pairedItem: { item: itemIndex } };
}
