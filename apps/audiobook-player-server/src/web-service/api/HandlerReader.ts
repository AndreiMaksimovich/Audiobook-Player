import {Response, Request} from 'express';
import {audiobookProvider} from "../../core";
import {Status} from "../Types";
import getHumanReadableError from "./HumanReadableError";
import {validationResult} from "express-validator";

export const handlerReader = async (req: Request, res: Response) => {
    try {
        validationResult(req).throw()
        const id = parseInt(req.params.readerId);
        res.status(Status.OK).json(await audiobookProvider.getReader(id));
    } catch (error) {
        console.log(error);
        res.status(Status.INTERNAL_ERROR).json(getHumanReadableError(error));
    }
}
