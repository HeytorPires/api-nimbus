import handlebars from 'handlebars';
import fs from 'node:fs';
import { IParseMailTemplate } from '../models/ISendMail';

export class HandlebarsMailTemplate {
  public async parse({ file, variables }: IParseMailTemplate): Promise<string> {
    const templateFleContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlebars.compile(templateFleContent);

    return parseTemplate(variables);
  }
}
