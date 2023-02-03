import Joi from "joi";
export class Rules {
    #rules: { [key: string]: Joi.Schema };
    constructor(rules: { [key: string]: Joi.Schema }) {
        this.#rules = rules;
    }
    makeRequired() {
        const newRules: { [key: string]: Joi.Schema } = {};
        for (const key in this.#rules) {
            newRules[key] = this.#rules[key].required();
        }
        return new Rules(newRules);
    }
    get(key : string){
        return this.#rules[key];
    }
    merge(rules : Rules){
        return new Rules({...this.#rules, ...rules.#rules});
    }
    extractSubset(keys: string[]) {
        const subset: { [key: string]: Joi.Schema } = {};
        keys.forEach(key => {
            if (key in this.#rules) {
                subset[key] = this.#rules[key];
            }
        });
        return new Rules(subset);
    }
    validate(object : any) {
        return Joi.object(this.#rules).validate(object);
    }
};

export type RequestValidation = { [key in 'body' | 'query' | 'params'] ?: Rules };