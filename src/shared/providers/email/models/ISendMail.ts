interface ITemplateVariable {
  [key: string]: string | number;
}

export interface IParseMailTemplate {
  file: string;
  variables: ITemplateVariable;
}

interface IMailContact {
  name: string;
  email: string;
}

export interface ISendMailResult {
  provider: string;
  // id da mensagem no provedor, usado para casar os eventos de webhook
  messageId?: string;
}

export interface ISendMail {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplate;
}
