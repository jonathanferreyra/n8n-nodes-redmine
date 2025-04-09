import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class RedmineApi implements ICredentialType {
  name = 'redmineApi';
  displayName = 'Redmine API';
  documentationUrl = 'https://www.redmine.org/projects/redmine/wiki/Rest_api';
  properties: INodeProperties[] = [
    {
      displayName: 'URL',
      name: 'url',
      type: 'string',
      default: '',
      placeholder: 'https://your-redmine-instance.com',
      required: true,
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      default: '',
      typeOptions: {
        password: true,
      },
      required: true,
      description: 'API key found in your Redmine account (My account > API access key)',
    },
  ];
}
