import * as _ from 'lodash';
import * as format from 'string-template';

export class QueryManager {
    private queries: any;
    private extractIdAndQueryTemplate: RegExp = /(?:@)[\s\n]*([a-zA-Z_\.]+[a-zA-Z]+)[\s\n]*(?:@)(?:\n|\*\/|\s)*([^;]*)/g;
    private deleteComments: RegExp = /(?:#{1,}.*)|(?:-{2,}.*)|(?:(?:(\/\*)+?[\w\W]+?(\*\/)+))/g;

    constructor(templates: string | Array<string>) {
        this.queries = this.parse(templates);
    }

    public get(key: string, options?: object): string {
        let query = _.get(this.queries, key);

        if (!query)
            throw new Error(`InvalidArgument: '${key}' key does not exist.`);

        if (options)
            return format(query, options);

        return query;
    }

    public add(templates: string | Array<string>): void {
        let newQueries = this.parse(templates);
        this.queries = _.merge({}, this.queries, newQueries);
    }

    private parse(templates: string | Array<string>): object {
        this.throwInvalidArguments(templates);

        if (_.isString(templates)) {
            templates = [templates];
        }

        return templates.reduce((queries: any, template: string) => {
            let result = null;
            while (result = this.extractIdAndQueryTemplate.exec(template)) {
                let [input, key, sqlRawTemplate] = result;
                let sqlTemplate = sqlRawTemplate
                    .replace(this.deleteComments, '')
                    .replace(/\s*\n\s*/g, ' ');

                queries[key] = sqlTemplate.trim() + ';';
            }

            return queries;
        }, {});
    }

    private throwInvalidArguments(templates: string | Array<string>): void {
        if (_.isNil(templates)) {
            throw new Error('InvalidArgument: templates cannot be null!');
        }
    }
}