import {Request, Response} from "express";
import {Status} from "../Types";
import {audiobookProvider} from "../../core";
import getHumanReadableError from "./HumanReadableError";
import Joi from "joi";

const getAudiobooksRequestSchema = Joi.object({
    tagId: Joi.number().min(1).allow(null),
    categoryId: Joi.number().min(1).allow(null),
    authorId: Joi.number().min(1).allow(null),
    readerId: Joi.number().min(1).allow(null),
    offset: Joi.number().min(0),
    limit: Joi.number().min(0).max(100),
    searchFor: Joi.string().allow(null, ''),
    titleStartsWith: Joi.string().allow(null, ''),
    orderBy: Joi.number().allow(null)
})

export const handlerAudiobooks = async (req: Request, res: Response) => {
    try {
        const {error, value} = getAudiobooksRequestSchema.validate(req.body)
        if (error) throw error;
        res.status(Status.OK).json(await audiobookProvider.getAudiobooks(value));
    } catch (error) {
        console.log(error);
        res.status(Status.INTERNAL_ERROR).json(getHumanReadableError(error));
    }
}
