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
import { agenticscraperFields, agenticscraperOperations } from '../AgenticscraperDescription';

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
		usableAsTool: true,
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
						name: 'Agentic Scraper',
						value: 'agenticscraper',
					},
					{
						name: 'Markdownify',
						value: 'markdownify',
					},
					{
						name: 'Scrape',
						value: 'scrape',
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
						name: 'Smart Scraper',
						value: 'smartscraper',
					},
				],
				default: 'smartscraper',
			},
			...agenticscraperOperations,
			...agenticscraperFields,
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
						const enableScrolling = this.getNodeParameter('enableScrolling', i, false) as boolean;
						const enablePagination = this.getNodeParameter('enablePagination', i, false) as boolean;
						const useOutputSchema = this.getNodeParameter('useOutputSchema', i, false) as boolean;
						const renderHeavyJs = this.getNodeParameter('renderHeavyJs', i, false) as boolean;

						const requestBody: any = {
							website_url: websiteUrl,
							user_prompt: userPrompt,
							render_heavy_js: renderHeavyJs,
						};

						// Add number_of_scrolls if scrolling is enabled
						if (enableScrolling) {
							const numberOfScrolls = this.getNodeParameter('numberOfScrolls', i) as number;
							if (numberOfScrolls && numberOfScrolls > 0) {
								requestBody.number_of_scrolls = numberOfScrolls;
							}
						}

						// Add total_pages if pagination is enabled
						if (enablePagination) {
							const totalPages = this.getNodeParameter('totalPages', i) as number;
							if (totalPages && totalPages > 1) {
								requestBody.total_pages = totalPages;
							}
						}

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
						const numResults = this.getNodeParameter('numResults', i) as number;
						const enableScrolling = this.getNodeParameter('enableScrolling', i, false) as boolean;
						const enablePagination = this.getNodeParameter('enablePagination', i, false) as boolean;
						const useOutputSchema = this.getNodeParameter('useOutputSchema', i, false) as boolean;

						const requestBody: any = {
							user_prompt: userPrompt,
							num_results: numResults,
						};

						// Add number_of_scrolls if scrolling is enabled
						if (enableScrolling) {
							const numberOfScrolls = this.getNodeParameter('numberOfScrolls', i) as number;
							if (numberOfScrolls && numberOfScrolls > 0) {
								requestBody.number_of_scrolls = numberOfScrolls;
							}
						}

						// Add total_pages if pagination is enabled
						if (enablePagination) {
							const totalPages = this.getNodeParameter('totalPages', i) as number;
							if (totalPages && totalPages > 1) {
								requestBody.total_pages = totalPages;
							}
						}

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

				if (resource === 'agenticscraper') {
					if (operation === 'execute') {
						const url = this.getNodeParameter('url', i) as string;
						const stepsData = this.getNodeParameter('steps', i) as any;
						const useSession = this.getNodeParameter('useSession', i, false) as boolean;
						const aiExtraction = this.getNodeParameter('aiExtraction', i, true) as boolean;

						// Extract steps from the fixed collection format
						const steps = stepsData.step?.map((s: any) => s.action).filter((action: string) => action.trim() !== '') || [];

						// Validate that at least one step is provided
						if (steps.length === 0) {
							throw new NodeOperationError(this.getNode(), 'At least one browser interaction step is required');
						}

						const requestBody: any = {
							url: url,
							steps: steps,
							use_session: useSession,
							ai_extraction: aiExtraction,
						};

						// Add user_prompt if AI extraction is enabled
						if (aiExtraction) {
							const userPrompt = this.getNodeParameter('userPrompt', i, '') as string;
							if (userPrompt) {
								requestBody.user_prompt = userPrompt;
							}

							// Add output_schema if enabled and provided
							const useOutputSchema = this.getNodeParameter('useOutputSchema', i, false) as boolean;
							if (useOutputSchema) {
								const outputSchema = this.getNodeParameter('outputSchema', i) as string;
								try {
									requestBody.output_schema = JSON.parse(outputSchema);
								} catch (error) {
									throw new NodeOperationError(this.getNode(), `Invalid JSON in Output Schema: ${error.message}`);
								}
							}
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/agentic-scrapper`,
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