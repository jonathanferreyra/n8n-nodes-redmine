import {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
  NodeOperationError,
} from 'n8n-workflow';

import { issueOperations, issueFields } from './IssueOperations';
import { executeIssueOperation } from './IssueExecute';
import { projectOperations, projectFields } from './ProjectOperations';
import { executeProjectOperation } from './ProjectExecute';
import { userOperations, userFields } from './UserOperations';
import { executeUserOperation } from './UserExecute';

export class Redmine implements INodeType {
  methods = {
    loadOptions: {
      async getIssueStatuses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const credentials = await this.getCredentials('redmineApi');
        const baseUrl = credentials.url as string;
        const apiKey = credentials.apiKey as string;

        try {
          const response = await this.helpers.request({
            method: 'GET',
            uri: `${baseUrl}/issue_statuses.json`,
            headers: {
              'X-Redmine-API-Key': apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          }) as { issue_statuses?: Array<{ id: number | string; name: string }> };

          return (response.issue_statuses ?? []).map((status) => ({
            name: status.name,
            value: String(status.id),
          }));
        } catch (error) {
          throw new NodeOperationError(
            this.getNode(),
            `Redmine API error loading issue statuses: ${error.message}`,
          );
        }
      },
    },
  };

  description: INodeTypeDescription = {
    displayName: 'Redmine',
    name: 'redmine',
    icon: 'file:redmine.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Consume Redmine API',
    defaults: {
      name: 'Redmine',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'redmineApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          {
            name: 'Issue',
            value: 'issue',
          },
          {
            name: 'Project',
            value: 'project',
          },
          {
            name: 'User',
            value: 'user',
          },
        ],
        default: 'issue',
        noDataExpression: true,
        required: true,
      },

      // Issue operations
      ...issueOperations,
      ...issueFields,

      // Project operations
      ...projectOperations,
      ...projectFields,

      // User operations
      ...userOperations,
      ...userFields,

      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Impersonate User',
            name: 'impersonateUser',
            type: 'string',
            default: '',
            description: 'Login of the user to impersonate. The API key must be from an admin user.',
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const credentials = await this.getCredentials('redmineApi');
    const baseUrl = credentials.url as string;
    const apiKey = credentials.apiKey as string;

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        // Call the appropriate execute function based on resource
        if (resource === 'issue') {
          const result = await executeIssueOperation.call(this, {
            operation,
            i,
            baseUrl,
            apiKey
          });
          returnData.push(result);
        } else if (resource === 'project') {
          const result = await executeProjectOperation.call(this, {
            operation,
            i,
            baseUrl,
            apiKey
          });
          returnData.push(result);
        } else if (resource === 'user') {
          const result = await executeUserOperation.call(this, {
            operation,
            i,
            baseUrl,
            apiKey
          });
          returnData.push(result);
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error.message,
            },
            pairedItem: {
              item: i,
            },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
