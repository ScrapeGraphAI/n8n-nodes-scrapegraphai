import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { safeRequest } from '../../transport/request';

const RESOURCE = 'credits';

export const creditsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [RESOURCE] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Retrieve credit balance and quotas',
				description: 'Return remaining credits, plan name, and crawl/monitor job quotas',
			},
		],
		default: 'get',
	},
];

export async function execute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const response = await safeRequest.call(this, itemIndex, 'GET', '/credits');
	return { json: response as IDataObject, pairedItem: { item: itemIndex } };
}
