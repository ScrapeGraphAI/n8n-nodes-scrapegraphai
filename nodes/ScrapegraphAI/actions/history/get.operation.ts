import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { safeRequest } from '../../transport/request';
import { HISTORY_RESOURCE, historyIdLocator } from './history.resource';

export const getFields: INodeProperties[] = [
	{
		...historyIdLocator,
		displayOptions: { show: { resource: [HISTORY_RESOURCE], operation: ['get'] } },
	},
	{
		displayName: 'Simplify',
		name: 'simplify',
		type: 'boolean',
		default: false,
		description: 'Whether to return a simplified version of the response instead of the raw data',
		displayOptions: { show: { resource: [HISTORY_RESOURCE], operation: ['get'] } },
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const id = this.getNodeParameter('entryId', itemIndex, '', { extractValue: true }) as string;
	const simplify = this.getNodeParameter('simplify', itemIndex) as boolean;

	const response = (await safeRequest.call(this, itemIndex, 'GET', `/history/${id}`)) as IDataObject;

	if (!simplify) return { json: response, pairedItem: { item: itemIndex } };

	const out: IDataObject = {
		id: response.id,
		service: response.service,
		status: response.status,
		elapsedMs: response.elapsedMs,
		createdAt: response.createdAt,
		requestParentId: response.requestParentId,
		params: response.params,
		result: response.result,
	};

	return { json: out, pairedItem: { item: itemIndex } };
}
