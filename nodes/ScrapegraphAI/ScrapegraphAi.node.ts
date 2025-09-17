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
import { crawlerFields, crawlerOperations } from '../CrawlerDescription';
import { schemaGeneratorFields, schemaGeneratorOperations } from '../SchemaGeneratorDescription';
import { scheduledJobsFields, scheduledJobsOperations } from '../ScheduledJobsDescription';
import { userFields, userOperations } from '../UserDescription';

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
						name: 'Crawler',
						value: 'crawler',
					},
					{
						name: 'Markdownify',
						value: 'markdownify',
					},
					{
						name: 'Schema Generator',
						value: 'schemagenerator',
					},
					{
						name: 'Scheduled Jobs',
						value: 'scheduledjobs',
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
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'smartscraper',
			},
			...agenticscraperOperations,
			...agenticscraperFields,
			...crawlerOperations,
			...crawlerFields,
			...markdownifyOperations,
			...markdownifyFields,
			...schemaGeneratorOperations,
			...schemaGeneratorFields,
			...scheduledJobsOperations,
			...scheduledJobsFields,
			...scrapeOperations,
			...scrapeFields,
			...searchscraperOperations,
			...searchscraperFields,
			...smartcrawlerOperations,
			...smartcrawlerFields,
			...smartscraperOperations,
			...smartscraperFields,
			...userOperations,
			...userFields,
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

					if (operation === 'getStatus') {
						const requestId = this.getNodeParameter('requestId', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'GET',
							url: `${baseUrl}/smartscraper/${requestId}`,
							headers: {
								'Accept': 'application/json',
							},
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
						const extractionMode = this.getNodeParameter('extractionMode', i, true) as boolean;

						const requestBody: any = {
							user_prompt: userPrompt,
							num_results: numResults,
							extraction_mode: extractionMode,
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

					if (operation === 'getStatus') {
						const requestId = this.getNodeParameter('requestId', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'GET',
							url: `${baseUrl}/searchscraper/${requestId}`,
							headers: {
								'Accept': 'application/json',
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}
				}

				if (resource === 'smartcrawler') {
					if (operation === 'startCrawl') {
						const websiteUrl = this.getNodeParameter('websiteUrl', i) as string;
						const inputQueriesData = this.getNodeParameter('inputQueries', i) as any;
						const cacheWebsite = this.getNodeParameter('cacheWebsite', i, true) as boolean;
						const extractionMode = this.getNodeParameter('extractionMode', i, true) as boolean;

						// Extract queries from the fixed collection format
						const inputQueries = inputQueriesData.query?.map((q: any) => q.text).filter((text: string) => text.trim() !== '') || [];

						// Validate that at least one query is provided
						if (inputQueries.length === 0) {
							throw new NodeOperationError(this.getNode(), 'At least one input query is required');
						}

						const requestBody: any = {
							website_url: websiteUrl,
							input_queries: inputQueries,
							cache_website: cacheWebsite,
							extraction_mode: extractionMode,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/smartcrawler`,
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
						const sessionId = this.getNodeParameter('sessionId', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'GET',
							url: `${baseUrl}/smartcrawler/${sessionId}`,
							headers: {
								'Accept': 'application/json',
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}

					if (operation === 'getAllSessions') {
						const filterStatus = this.getNodeParameter('filterStatus', i, '') as string;
						
						let url = `${baseUrl}/smartcrawler/sessions/all`;
						if (filterStatus) {
							url += `?status=${filterStatus}`;
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'GET',
							url: url,
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

					if (operation === 'getStatus') {
						const requestId = this.getNodeParameter('requestId', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'GET',
							url: `${baseUrl}/markdownify/${requestId}`,
							headers: {
								'Accept': 'application/json',
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

					if (operation === 'getLiveSessionUrl') {
						const liveSessionUrl = this.getNodeParameter('liveSessionUrl', i) as string;
						const timeout = this.getNodeParameter('timeout', i, 300) as number;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/get-live-session-url`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: {
								url: liveSessionUrl,
								timeout: timeout,
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}

					if (operation === 'stopSession') {
						const sessionId = this.getNodeParameter('sessionId', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/stop-session`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: {
								session_id: sessionId,
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}
				}

				// Crawler operations
				if (resource === 'crawler') {
					if (operation === 'startCrawl') {
						const url = this.getNodeParameter('url', i) as string;
						const extractionMode = this.getNodeParameter('extractionMode', i, false) as boolean;
						const depth = this.getNodeParameter('depth', i, 1) as number;
						const maxPages = this.getNodeParameter('maxPages', i, 20) as number;
						const sitemap = this.getNodeParameter('sitemap', i, false) as boolean;
						const renderHeavyJs = this.getNodeParameter('renderHeavyJs', i, false) as boolean;
						const sameDomain = this.getNodeParameter('sameDomain', i, true) as boolean;

						const requestBody: any = {
							url: url,
							depth: depth,
							max_pages: maxPages,
							sitemap: sitemap,
							render_heavy_js: renderHeavyJs,
							extraction_mode: extractionMode,
							rules: {
								same_domain: sameDomain,
							},
						};

						if (extractionMode) {
							const prompt = this.getNodeParameter('prompt', i, '') as string;
							if (prompt) {
								requestBody.prompt = prompt;
							}

							const useOutputSchema = this.getNodeParameter('useOutputSchema', i, false) as boolean;
							if (useOutputSchema) {
								const outputSchema = this.getNodeParameter('outputSchema', i) as string;
								try {
									requestBody.schema = JSON.parse(outputSchema);
								} catch (error) {
									throw new NodeOperationError(this.getNode(), `Invalid JSON in Output Schema: ${error.message}`);
								}
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

				// Schema Generator operations
				if (resource === 'schemagenerator') {
					if (operation === 'generateSchema') {
						const userPrompt = this.getNodeParameter('userPrompt', i) as string;
						const useExistingSchema = this.getNodeParameter('useExistingSchema', i, false) as boolean;

						const requestBody: any = {
							user_prompt: userPrompt,
						};

						if (useExistingSchema) {
							const existingSchema = this.getNodeParameter('existingSchema', i) as string;
							try {
								requestBody.existing_schema = JSON.parse(existingSchema);
							} catch (error) {
								throw new NodeOperationError(this.getNode(), `Invalid JSON in Existing Schema: ${error.message}`);
							}
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/generate_schema`,
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
						const requestId = this.getNodeParameter('requestId', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'GET',
							url: `${baseUrl}/generate_schema/${requestId}`,
							headers: {
								'Accept': 'application/json',
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}
				}

				// Scheduled Jobs operations
				if (resource === 'scheduledjobs') {
					if (operation === 'createJob') {
						const jobName = this.getNodeParameter('jobName', i) as string;
						const serviceType = this.getNodeParameter('serviceType', i) as string;
						const cronExpression = this.getNodeParameter('cronExpression', i) as string;
						const jobConfigStr = this.getNodeParameter('jobConfig', i) as string;
						const isActive = this.getNodeParameter('isActive', i, true) as boolean;
						const webhookUrl = this.getNodeParameter('webhookUrl', i, '') as string;

						let jobConfig;
						try {
							jobConfig = JSON.parse(jobConfigStr);
						} catch (error) {
							throw new NodeOperationError(this.getNode(), `Invalid JSON in Job Configuration: ${error.message}`);
						}

						const requestBody: any = {
							job_name: jobName,
							service_type: serviceType,
							cron_expression: cronExpression,
							job_config: jobConfig,
							is_active: isActive,
						};

						if (webhookUrl) {
							requestBody.webhook_url = webhookUrl;
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/scheduled-jobs`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: requestBody,
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}

					if (operation === 'getAllJobs') {
						const page = this.getNodeParameter('page', i, 1) as number;
						const pageSize = this.getNodeParameter('pageSize', i, 20) as number;
						const filterServiceType = this.getNodeParameter('filterServiceType', i, '') as string;
						const filterIsActive = this.getNodeParameter('filterIsActive', i, '') as string;

						let url = `${baseUrl}/scheduled-jobs?page=${page}&page_size=${pageSize}`;
						if (filterServiceType) {
							url += `&service_type=${filterServiceType}`;
						}
						if (filterIsActive) {
							url += `&is_active=${filterIsActive}`;
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'GET',
							url: url,
							headers: {
								'Accept': 'application/json',
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}

					if (operation === 'getJob') {
						const jobId = this.getNodeParameter('jobId', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'GET',
							url: `${baseUrl}/scheduled-jobs/${jobId}`,
							headers: {
								'Accept': 'application/json',
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}

					if (operation === 'updateJob') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						const jobName = this.getNodeParameter('jobName', i) as string;
						const cronExpression = this.getNodeParameter('cronExpression', i) as string;
						const jobConfigStr = this.getNodeParameter('jobConfig', i) as string;
						const isActive = this.getNodeParameter('isActive', i, true) as boolean;
						const webhookUrl = this.getNodeParameter('webhookUrl', i, '') as string;

						let jobConfig;
						try {
							jobConfig = JSON.parse(jobConfigStr);
						} catch (error) {
							throw new NodeOperationError(this.getNode(), `Invalid JSON in Job Configuration: ${error.message}`);
						}

						const requestBody: any = {
							job_name: jobName,
							cron_expression: cronExpression,
							job_config: jobConfig,
							is_active: isActive,
						};

						if (webhookUrl) {
							requestBody.webhook_url = webhookUrl;
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'PUT',
							url: `${baseUrl}/scheduled-jobs/${jobId}`,
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
							},
							body: requestBody,
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}

					if (operation === 'deleteJob') {
						const jobId = this.getNodeParameter('jobId', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'DELETE',
							url: `${baseUrl}/scheduled-jobs/${jobId}`,
							headers: {
								'Accept': 'application/json',
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}

					if (operation === 'pauseJob') {
						const jobId = this.getNodeParameter('jobId', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/scheduled-jobs/${jobId}/pause`,
							headers: {
								'Accept': 'application/json',
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}

					if (operation === 'resumeJob') {
						const jobId = this.getNodeParameter('jobId', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/scheduled-jobs/${jobId}/resume`,
							headers: {
								'Accept': 'application/json',
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}

					if (operation === 'triggerJob') {
						const jobId = this.getNodeParameter('jobId', i) as string;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/scheduled-jobs/${jobId}/trigger`,
							headers: {
								'Accept': 'application/json',
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}

					if (operation === 'getExecutions') {
						const jobId = this.getNodeParameter('jobId', i) as string;
						const page = this.getNodeParameter('page', i, 1) as number;
						const pageSize = this.getNodeParameter('pageSize', i, 20) as number;

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'GET',
							url: `${baseUrl}/scheduled-jobs/${jobId}/executions?page=${page}&page_size=${pageSize}`,
							headers: {
								'Accept': 'application/json',
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}
				}

				// User operations
				if (resource === 'user') {
					if (operation === 'getCredits') {
						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'GET',
							url: `${baseUrl}/credits`,
							headers: {
								'Accept': 'application/json',
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}

					if (operation === 'validateApiKey') {
						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'GET',
							url: `${baseUrl}/validate`,
							headers: {
								'Accept': 'application/json',
							},
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}

					if (operation === 'submitFeedback') {
						const requestId = this.getNodeParameter('requestId', i) as string;
						const rating = this.getNodeParameter('rating', i) as number;
						const feedbackText = this.getNodeParameter('feedbackText', i, '') as string;

						const requestBody: any = {
							request_id: requestId,
							rating: rating,
						};

						if (feedbackText) {
							requestBody.feedback_text = feedbackText;
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(this, 'scrapegraphAIApi', {
							method: 'POST',
							url: `${baseUrl}/feedback`,
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