import type { INodeProperties } from 'n8n-workflow';

export const scheduledJobsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['scheduledjobs'],
			},
		},
		options: [
			{
				name: 'Create Job',
				value: 'createJob',
				action: 'Create a new scheduled job',
				description: 'Create a new scheduled job that will run automatically based on cron expression',
			},
			{
				name: 'Get All Jobs',
				value: 'getAllJobs',
				action: 'Get all scheduled jobs',
				description: 'Retrieve a paginated list of all scheduled jobs',
			},
			{
				name: 'Get Job',
				value: 'getJob',
				action: 'Get scheduled job by ID',
				description: 'Retrieve details of a specific scheduled job',
			},
			{
				name: 'Update Job',
				value: 'updateJob',
				action: 'Update scheduled job',
				description: 'Update an existing scheduled job configuration',
			},
			{
				name: 'Delete Job',
				value: 'deleteJob',
				action: 'Delete scheduled job',
				description: 'Delete a scheduled job and remove it from scheduler',
			},
			{
				name: 'Pause Job',
				value: 'pauseJob',
				action: 'Pause scheduled job',
				description: 'Pause a scheduled job temporarily',
			},
			{
				name: 'Resume Job',
				value: 'resumeJob',
				action: 'Resume scheduled job',
				description: 'Resume a paused scheduled job',
			},
			{
				name: 'Trigger Job',
				value: 'triggerJob',
				action: 'Trigger scheduled job manually',
				description: 'Execute a scheduled job immediately, outside of its normal schedule',
			},
			{
				name: 'Get Executions',
				value: 'getExecutions',
				action: 'Get job execution history',
				description: 'Retrieve execution history for a specific scheduled job',
			},
		],
		default: 'createJob',
	},
];

export const scheduledJobsFields: INodeProperties[] = [
	{
		displayName: 'Job Name',
		name: 'jobName',
		type: 'string',
		required: true,
		default: '',
		description: 'Human-readable name for the scheduled job',
		displayOptions: {
			show: {
				resource: ['scheduledjobs'],
				operation: ['createJob', 'updateJob'],
			},
		},
	},
	{
		displayName: 'Service Type',
		name: 'serviceType',
		type: 'options',
		required: true,
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
				name: 'Markdownify',
				value: 'markdownify',
			},
			{
				name: 'Smart Crawler',
				value: 'smartcrawler',
			},
			{
				name: 'Agentic Scrapper',
				value: 'agenticscrapper',
			},
		],
		default: 'smartscraper',
		description: 'Type of service for scheduled job',
		displayOptions: {
			show: {
				resource: ['scheduledjobs'],
				operation: ['createJob'],
			},
		},
	},
	{
		displayName: 'Cron Expression',
		name: 'cronExpression',
		type: 'string',
		required: true,
		default: '0 9 * * 1',
		placeholder: '0 9 * * 1',
		description: 'Standard 5-field cron expression (minute hour day month day_of_week) in UTC timezone',
		displayOptions: {
			show: {
				resource: ['scheduledjobs'],
				operation: ['createJob', 'updateJob'],
			},
		},
	},
	{
		displayName: 'Job Configuration',
		name: 'jobConfig',
		type: 'json',
		required: true,
		default: '{}',
		description: 'Service-specific configuration that matches the service request schema',
		displayOptions: {
			show: {
				resource: ['scheduledjobs'],
				operation: ['createJob', 'updateJob'],
			},
		},
	},
	{
		displayName: 'Is Active',
		name: 'isActive',
		type: 'boolean',
		default: true,
		description: 'Whether the job is active and should be scheduled',
		displayOptions: {
			show: {
				resource: ['scheduledjobs'],
				operation: ['createJob', 'updateJob'],
			},
		},
	},
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		default: '',
		description: 'Webhook URL to send the job result to',
		displayOptions: {
			show: {
				resource: ['scheduledjobs'],
				operation: ['createJob', 'updateJob'],
			},
		},
	},
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		required: true,
		default: '',
		description: 'Job identifier',
		displayOptions: {
			show: {
				resource: ['scheduledjobs'],
				operation: ['getJob', 'updateJob', 'deleteJob', 'pauseJob', 'resumeJob', 'triggerJob', 'getExecutions'],
			},
		},
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		description: 'Page number',
		displayOptions: {
			show: {
				resource: ['scheduledjobs'],
				operation: ['getAllJobs', 'getExecutions'],
			},
		},
	},
	{
		displayName: 'Page Size',
		name: 'pageSize',
		type: 'number',
		default: 20,
		description: 'Number of items per page',
		displayOptions: {
			show: {
				resource: ['scheduledjobs'],
				operation: ['getAllJobs', 'getExecutions'],
			},
		},
	},
	{
		displayName: 'Filter by Service Type',
		name: 'filterServiceType',
		type: 'options',
		options: [
			{
				name: 'All',
				value: '',
			},
			{
				name: 'Smart Scraper',
				value: 'smartscraper',
			},
			{
				name: 'Search Scraper',
				value: 'searchscraper',
			},
			{
				name: 'Markdownify',
				value: 'markdownify',
			},
			{
				name: 'Smart Crawler',
				value: 'smartcrawler',
			},
			{
				name: 'Agentic Scrapper',
				value: 'agenticscrapper',
			},
		],
		default: '',
		description: 'Filter by service type',
		displayOptions: {
			show: {
				resource: ['scheduledjobs'],
				operation: ['getAllJobs'],
			},
		},
	},
	{
		displayName: 'Filter by Active Status',
		name: 'filterIsActive',
		type: 'options',
		options: [
			{
				name: 'All',
				value: '',
			},
			{
				name: 'Active',
				value: 'true',
			},
			{
				name: 'Inactive',
				value: 'false',
			},
		],
		default: '',
		description: 'Filter by active status',
		displayOptions: {
			show: {
				resource: ['scheduledjobs'],
				operation: ['getAllJobs'],
			},
		},
	},
];
