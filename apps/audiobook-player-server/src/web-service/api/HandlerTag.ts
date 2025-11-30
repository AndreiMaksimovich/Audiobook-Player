import {Response, Request} from 'express';
import {audiobookProvider} from "../../core";
import {Status} from "../Types";
import getHumanReadableError from "./HumanReadableError";
import {validationResult} from "express-validator";

export const handlerTag = async (req: Request, res: Response) => {
    try {
        validationResult(req).throw()
        const id = parseInt(req.params.tagId);
        res.status(Status.OK).json(await audiobookProvider.getTag(id));
    } catch (error) {
        console.log(error);
        res.status(Status.INTERNAL_ERROR).json(getHumanReadableError(error));
    }
}
