import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { smartscraperFields, smartscraperOperations } from '../SmartscraperDescription';
import { searchscraperFields, searchscraperOperations } from '../SearchscraperDescription';
import { markdownifyFields, markdownifyOperations } from '../MarkdownifyDescription';
import { smartcrawlerFields, smartcrawlerOperations } from '../SmartcrawlerDescription';
import { scrapeFields, scrapeOperations } from '../ScrapeDescription';

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
					{
						name: 'Scrape',
						value: 'scrape',
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
			...scrapeOperations,
			...scrapeFields,
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
						const useOutputSchema = this.getNodeParameter('useOutputSchema', i, false) as boolean;
						const renderHeavyJs = this.getNodeParameter('renderHeavyJs', i, false) as boolean;

						const requestBody: any = {
							website_url: websiteUrl,
							user_prompt: userPrompt,
							render_heavy_js: renderHeavyJs,
						};

						// Add output_schema if enabled and provided
						if (useOutputSchema) {
							const outputSchema = this.getNodeParameter('outputSchema', i) as string;
							try {
								requestBody.output_schema = JSON.parse(outputSchema);
							} catch (error) {
								throw new NodeOperationError(this.getNode(), `Invalid JSON in Output Schema: ${error.message}`);
							}
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/smartscraper`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: requestBody,
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}
				}

				if (resource === 'searchscraper') {
					if (operation === 'search') {
						const userPrompt = this.getNodeParameter('userPrompt', i) as string;
						const useOutputSchema = this.getNodeParameter('useOutputSchema', i, false) as boolean;

						const requestBody: any = {
							user_prompt: userPrompt,
						};

						// Add output_schema if enabled and provided
						if (useOutputSchema) {
							const outputSchema = this.getNodeParameter('outputSchema', i) as string;
							try {
								requestBody.output_schema = JSON.parse(outputSchema);
							} catch (error) {
								throw new NodeOperationError(this.getNode(), `Invalid JSON in Output Schema: ${error.message}`);
							}
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/searchscraper`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: requestBody,
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
						const useOutputSchema = this.getNodeParameter('useOutputSchema', i, false) as boolean;
						const renderHeavyJs = this.getNodeParameter('renderHeavyJs', i, false) as boolean;

						const requestBody: any = {
							url: url,
							prompt: prompt,
							cache_website: cacheWebsite,
							depth: depth,
							max_pages: maxPages,
							same_domain_only: sameDomainOnly,
							render_heavy_js: renderHeavyJs,
						};

						// Add output_schema if enabled and provided
						if (useOutputSchema) {
							const outputSchema = this.getNodeParameter('outputSchema', i) as string;
							try {
								requestBody.output_schema = JSON.parse(outputSchema);
							} catch (error) {
								throw new NodeOperationError(this.getNode(), `Invalid JSON in Output Schema: ${error.message}`);
							}
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/crawl`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: requestBody,
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
						const renderHeavyJs = this.getNodeParameter('renderHeavyJs', i, false) as boolean;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/markdownify`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: {
								website_url: websiteUrl,
								render_heavy_js: renderHeavyJs,
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}
				}

				if (resource === 'scrape') {
					if (operation === 'scrape') {
						const websiteUrl = this.getNodeParameter('websiteUrl', i) as string;
						const renderHeavyJs = this.getNodeParameter('renderHeavyJs', i) as boolean;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/scrape`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: {
								website_url: websiteUrl,
								render_heavy_js: renderHeavyJs,
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