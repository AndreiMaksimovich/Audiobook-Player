import {Request, Response} from "express";
import {Status} from "../Types";
import {audiobookProvider} from "../../core";
import getHumanReadableError from "./HumanReadableError";
import Joi from "joi";

const getReadersRequestSchema = Joi.object({
    offset: Joi.number().integer().min(0),
    limit: Joi.number().integer().max(100),
    searchFor: Joi.string().allow(null, ''),
    nameStartWith: Joi.string().allow(null, '')
})

export const handlerReaders = async (req: Request, res: Response) => {
    try {
        const {error, value} = getReadersRequestSchema.validate(req.body)
        if (error) throw error;
        res.status(Status.OK).json(await audiobookProvider.getReaders(value));
    } catch (error) {
        console.log(error);
        res.status(Status.INTERNAL_ERROR).json(getHumanReadableError(error));
    }
}
