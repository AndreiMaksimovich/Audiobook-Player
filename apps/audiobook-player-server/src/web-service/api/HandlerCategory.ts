import {Response, Request} from 'express';
import {audiobookProvider} from "../../core";
import {Status} from "../Types";
import getHumanReadableError from "./HumanReadableError";
import {validationResult} from "express-validator";

export const handlerCategory = async (req: Request, res: Response) => {
    try {
        validationResult(req).throw()
        const id = parseInt(req.params.categoryId);
        res.status(Status.OK).json(await audiobookProvider.getCategory(id));
    } catch (error) {
        console.log(error);
        res.status(Status.INTERNAL_ERROR).json(getHumanReadableError(error));
    }
}
