import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import * as scrape from './actions/scrape/scrape.operation';
import * as extract from './actions/extract/extract.operation';
import * as search from './actions/search/search.operation';

import { CRAWL_RESOURCE, crawlOperations } from './actions/crawl/crawl.resource';
import * as crawlStart from './actions/crawl/start.operation';
import * as crawlGetStatus from './actions/crawl/getStatus.operation';
import * as crawlStop from './actions/crawl/stop.operation';
import * as crawlResume from './actions/crawl/resume.operation';
import * as crawlDelete from './actions/crawl/delete.operation';

import { MONITOR_RESOURCE, monitorOperations } from './actions/monitor/monitor.resource';
import * as monitorCreate from './actions/monitor/create.operation';
import * as monitorList from './actions/monitor/list.operation';
import * as monitorGet from './actions/monitor/get.operation';
import * as monitorUpdate from './actions/monitor/update.operation';
import * as monitorPause from './actions/monitor/pause.operation';
import * as monitorResume from './actions/monitor/resume.operation';
import * as monitorDelete from './actions/monitor/delete.operation';
import * as monitorActivity from './actions/monitor/activity.operation';

import * as credits from './actions/credits/get.operation';

import { HISTORY_RESOURCE, historyOperations } from './actions/history/history.resource';
import * as historyGet from './actions/history/get.operation';
import * as historyList from './actions/history/list.operation';

import { listCrawls, listHistory, listMonitors } from './methods/loadOptions';

export class ScrapegraphAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ScrapegraphAI',
		name: 'scrapegraphAi',
		icon: 'file:../scrapegraphAI.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Turn any webpage into usable data with the ScrapeGraphAI v2 API — scrape, extract, search, crawl, monitor, history, credits.',
		defaults: { name: 'ScrapegraphAI' },
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		usableAsTool: true,
		credentials: [{ name: 'scrapegraphAIApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Credit', value: 'credits' },
					{ name: 'Crawl', value: CRAWL_RESOURCE },
					{ name: 'Extract', value: 'extract' },
					{ name: 'History', value: HISTORY_RESOURCE },
					{ name: 'Monitor', value: MONITOR_RESOURCE },
					{ name: 'Scrape', value: 'scrape' },
					{ name: 'Search', value: 'search' },
				],
				default: 'scrape',
			},
			...scrape.scrapeOperations,
			...scrape.scrapeFields,
			...extract.extractOperations,
			...extract.extractFields,
			...search.searchOperations,
			...search.searchFields,
			...crawlOperations,
			...crawlStart.startFields,
			...crawlGetStatus.getStatusFields,
			...crawlStop.stopFields,
			...crawlResume.resumeFields,
			...crawlDelete.deleteFields,
			...monitorOperations,
			...monitorCreate.createFields,
			...monitorList.listFields,
			...monitorGet.getFields,
			...monitorUpdate.updateFields,
			...monitorPause.pauseFields,
			...monitorResume.resumeFields,
			...monitorDelete.deleteFields,
			...monitorActivity.activityFields,
			...credits.creditsOperations,
			...historyOperations,
			...historyGet.getFields,
			...historyList.listFields,
		],
	};

	methods = {
		listSearch: {
			listCrawls,
			listHistory,
			listMonitors,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const fn = OPERATIONS[resource]?.[operation];

		if (!fn) {
			throw new NodeOperationError(
				this.getNode(),
				`Unsupported combination: resource '${resource}' with operation '${operation}'`,
			);
		}

		for (let i = 0; i < items.length; i++) {
			try {
				const result = await fn.call(this, i);
				if (Array.isArray(result)) returnData.push(...result);
				else returnData.push(result);
			} catch (err) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (err as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw err;
			}
		}

		return [returnData];
	}
}

type OperationFn = (
	this: IExecuteFunctions,
	itemIndex: number,
) => Promise<INodeExecutionData | INodeExecutionData[]>;

const OPERATIONS: Record<string, Record<string, OperationFn>> = {
	scrape: { scrape: scrape.execute },
	extract: { extract: extract.execute },
	search: { search: search.execute },
	[CRAWL_RESOURCE]: {
		start: crawlStart.execute,
		getStatus: crawlGetStatus.execute,
		stop: crawlStop.execute,
		resume: crawlResume.execute,
		delete: crawlDelete.execute,
	},
	[MONITOR_RESOURCE]: {
		create: monitorCreate.execute,
		list: monitorList.execute,
		get: monitorGet.execute,
		update: monitorUpdate.execute,
		pause: monitorPause.execute,
		resume: monitorResume.execute,
		delete: monitorDelete.execute,
		activity: monitorActivity.execute,
	},
	[HISTORY_RESOURCE]: {
		get: historyGet.execute,
		list: historyList.execute,
	},
	credits: { get: credits.execute },
};
