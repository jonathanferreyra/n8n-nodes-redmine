import { INodeProperties } from 'n8n-workflow';

export const issueOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['issue'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create an issue',
        action: 'Create an issue',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete an issue',
        action: 'Delete an issue',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get an issue',
        action: 'Get an issue',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many issues',
        action: 'Get many issues',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an issue',
        action: 'Update an issue',
      },
    ],
    default: 'get',
    noDataExpression: true,
    required: true,
  },
]; 