import {Request, Response} from "express";
import {Status} from "../Types";
import {audiobookProvider} from "../../core";
import Joi from "joi";
import getHumanReadableError from "./HumanReadableError";

const getAuthorsRequestSchema = Joi.object({
    offset: Joi.number().integer().min(0),
    limit: Joi.number().integer().max(100),
    searchFor: Joi.string().allow(null, ''),
    nameStartWith: Joi.string().allow(null, '')
})

export const handlerAuthors = async (req: Request, res: Response) => {
    try {
        const {error, value} = getAuthorsRequestSchema.validate(req.body)
        if (error) throw error;
        res.status(Status.OK).json(await audiobookProvider.getAuthors(value));
    } catch (error) {
        console.log(error);
        res.status(Status.INTERNAL_ERROR).json(getHumanReadableError(getHumanReadableError(error)));
    }
}
