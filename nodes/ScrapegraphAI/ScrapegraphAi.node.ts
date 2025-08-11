import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

import { smartscraperFields, smartscraperOperations } from '../SmartscraperDescription';
import { searchscraperFields, searchscraperOperations } from '../SearchscraperDescription';
import { markdownifyFields, markdownifyOperations } from '../MarkdownifyDescription';
import { smartcrawlerFields, smartcrawlerOperations } from '../SmartcrawlerDescription';

export class ScrapegraphAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ScrapegraphAI',
		name: 'scrapegraphAi',
		icon: 'file:../scrapegraphAI.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Turn any webpage into usable data in one shot – ScrapegraphAI explores the website and extracts the content you need.',
		defaults: {
			name: 'ScrapegraphAI',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [
			{
				name: 'scrapegraphAIApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Smart Scraper',
						value: 'smartscraper',
					},
					{
						name: 'Search Scraper',
						value: 'searchscraper',
					},
					{
						name: 'Smart Crawler',
						value: 'smartcrawler',
					},
					{
						name: 'Markdownify',
						value: 'markdownify',
					},
				],
				default: 'smartscraper',
			},
			...smartscraperOperations,
			...smartscraperFields,
			...searchscraperOperations,
			...searchscraperFields,
			...smartcrawlerOperations,
			...smartcrawlerFields,
			...markdownifyOperations,
			...markdownifyFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		
		const baseUrl = 'https://api.scrapegraphai.com/v1';
		
		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'smartscraper') {
					if (operation === 'scrape') {
						const websiteUrl = this.getNodeParameter('websiteUrl', i) as string;
						const userPrompt = this.getNodeParameter('userPrompt', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/smartscraper`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: {
								website_url: websiteUrl,
								user_prompt: userPrompt,
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}
				}

				if (resource === 'searchscraper') {
					if (operation === 'search') {
						const userPrompt = this.getNodeParameter('userPrompt', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/searchscraper`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: {
								user_prompt: userPrompt,
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}
				}

				if (resource === 'smartcrawler') {
					if (operation === 'crawl') {
						const url = this.getNodeParameter('url', i) as string;
						const prompt = this.getNodeParameter('prompt', i) as string;
						const cacheWebsite = this.getNodeParameter('cacheWebsite', i) as boolean;
						const depth = this.getNodeParameter('depth', i) as number;
						const maxPages = this.getNodeParameter('maxPages', i) as number;
						const sameDomainOnly = this.getNodeParameter('sameDomainOnly', i) as boolean;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/crawl`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: {
								url: url,
								prompt: prompt,
								cache_website: cacheWebsite,
								depth: depth,
								max_pages: maxPages,
								same_domain_only: sameDomainOnly,
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}

					if (operation === 'getStatus') {
						const taskId = this.getNodeParameter('taskId', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'GET',
							url: `${baseUrl}/crawl/${taskId}`,
							headers: {
								'Accept': 'application/json',
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}
				}

				if (resource === 'markdownify') {
					if (operation === 'convert') {
						const websiteUrl = this.getNodeParameter('websiteUrl', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/markdownify`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: {
								website_url: websiteUrl,
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
} 