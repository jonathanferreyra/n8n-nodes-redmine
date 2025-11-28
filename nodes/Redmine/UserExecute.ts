import {
  IExecuteFunctions,
  IHttpRequestMethods,
  INodeExecutionData,
  IRequestOptions,
  NodeOperationError,
} from 'n8n-workflow';

interface UserOperationParams {
  operation: string;
  i: number;
  baseUrl: string;
  apiKey: string;
}

export async function executeUserOperation(
  this: IExecuteFunctions,
  params: UserOperationParams
): Promise<INodeExecutionData> {
  const { operation, i, baseUrl, apiKey } = params;

  let endpoint: string = '';
  let method: IHttpRequestMethods = 'GET';
  let body: any = {};
  let qs: any = {};

  if (operation === 'get') {
    // ----------------------------------
    //         user:get
    // ----------------------------------
    const userId = this.getNodeParameter('userId', i) as string;
    method = 'GET';
    endpoint = `/users/${userId}.json`;
    qs.include = 'memberships,groups';
  } else if (operation === 'getCurrent') {
    // ----------------------------------
    //         user:getCurrent
    // ----------------------------------
    method = 'GET';
    endpoint = '/users/current.json';
    qs.include = 'memberships,groups';
  } else if (operation === 'getAll') {
    // ----------------------------------
    //         user:getAll
    // ----------------------------------
    const returnAll = this.getNodeParameter('returnAll', i) as boolean;
    const filters = this.getNodeParameter('filters', i) as {
      group_id?: string;
      name?: string;
      status?: string;
    };

    method = 'GET';
    endpoint = '/users.json';

    // Add filters to query string
    if (filters.group_id) qs.group_id = filters.group_id;
    if (filters.name) qs.name = filters.name;
    if (filters.status) qs.status = filters.status;

    if (!returnAll) {
      const limit = this.getNodeParameter('limit', i) as number;
      qs.limit = limit;
    }
  } else if (operation === 'create') {
    // ----------------------------------
    //         user:create
    // ----------------------------------
    const login = this.getNodeParameter('login', i) as string;
    const firstname = this.getNodeParameter('firstname', i) as string;
    const lastname = this.getNodeParameter('lastname', i) as string;
    const mail = this.getNodeParameter('mail', i) as string;
    const password = this.getNodeParameter('password', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i) as {
      admin?: boolean;
      auth_source_id?: string;
      mail_notification?: string;
      must_change_passwd?: boolean;
      status?: string;
      customFields?: {
        field: {
          id: string;
          value: string;
        }[];
      };
    };

    method = 'POST';
    endpoint = '/users.json';

    const userData: any = {
      login,
      firstname,
      lastname,
      mail,
      password,
    };

    // Add all additional fields to the request
    if (additionalFields.admin !== undefined) userData.admin = additionalFields.admin;
    if (additionalFields.auth_source_id) userData.auth_source_id = additionalFields.auth_source_id;
    if (additionalFields.mail_notification) userData.mail_notification = additionalFields.mail_notification;
    if (additionalFields.must_change_passwd !== undefined) userData.must_change_passwd = additionalFields.must_change_passwd;
    if (additionalFields.status) userData.status = additionalFields.status;

    // Add custom fields if any
    if (additionalFields.customFields && additionalFields.customFields.field) {
      const customFields: any[] = [];

      for (const customField of additionalFields.customFields.field) {
        customFields.push({
          id: customField.id,
          value: customField.value,
        });
      }

      if (customFields.length > 0) {
        userData.custom_fields = customFields;
      }
    }

    body = {
      user: userData,
    };
  } else if (operation === 'update') {
    // ----------------------------------
    //         user:update
    // ----------------------------------
    const userId = this.getNodeParameter('userId', i) as string;
    const additionalFields = this.getNodeParameter('additionalFields', i) as {
      admin?: boolean;
      auth_source_id?: string;
      mail_notification?: string;
      must_change_passwd?: boolean;
      status?: string;
      customFields?: {
        field: {
          id: string;
          value: string;
        }[];
      };
    };

    method = 'PUT';
    endpoint = `/users/${userId}.json`;

    const userData: any = {};

    // Add all additional fields to the request
    if (additionalFields.admin !== undefined) userData.admin = additionalFields.admin;
    if (additionalFields.auth_source_id !== undefined) userData.auth_source_id = additionalFields.auth_source_id;
    if (additionalFields.mail_notification !== undefined) userData.mail_notification = additionalFields.mail_notification;
    if (additionalFields.must_change_passwd !== undefined) userData.must_change_passwd = additionalFields.must_change_passwd;
    if (additionalFields.status !== undefined) userData.status = additionalFields.status;

    // Add custom fields if any
    if (additionalFields.customFields && additionalFields.customFields.field) {
      const customFields: any[] = [];

      for (const customField of additionalFields.customFields.field) {
        customFields.push({
          id: customField.id,
          value: customField.value,
        });
      }

      if (customFields.length > 0) {
        userData.custom_fields = customFields;
      }
    }

    body = {
      user: userData,
    };
  } else if (operation === 'delete') {
    // ----------------------------------
    //         user:delete
    // ----------------------------------
    const userId = this.getNodeParameter('userId', i) as string;
    method = 'DELETE';
    endpoint = `/users/${userId}.json`;
  }

  const optionsData = this.getNodeParameter('options', i, {}) as { impersonateUser?: string };
  const impersonateUser = optionsData.impersonateUser;

  const headers: any = {
    'X-Redmine-API-Key': apiKey,
    'Content-Type': 'application/json',
  };

  if (impersonateUser) {
    headers['X-Redmine-Switch-User'] = impersonateUser;
  }

  // Make the request to Redmine API
  const options: IRequestOptions = {
    method,
    body,
    qs,
    uri: `${baseUrl}/` + endpoint.replace(/^\//, ''),
    headers,
    json: true,
  };

  if (Object.keys(body).length === 0) {
    delete options.body;
  }

  let responseData;

  try {
    responseData = await this.helpers.request(options);
  } catch (error) {
    throw new NodeOperationError(this.getNode(), `Redmine API error: ${error.message}`, { itemIndex: i });
  }

  return {
    json: responseData,
    pairedItem: {
      item: i,
    },
  };
}
