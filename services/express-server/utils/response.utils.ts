import { Response } from 'express';

export const errorHandler = async (err: any, res: Response, functionName: string) => {
  await sendResponse({
    res,
    status: 400,
    errorCode: '420',
    errorDescription: `Unhandled Error in ${functionName}(). Error: ${err}`,
  });
  return;
};

interface IResponseArgs {
  res: Response;
  status: number;
  data?: object;
  errorCode?: string;
  errorDescription?: string;
}
export const sendResponse = async (responseArgs: IResponseArgs) => {
  responseArgs.res.status(responseArgs.status).json({
    responseStatus: responseArgs.status == 200 ? 'successfull' : 'unsuccessfull',
    statusCode: responseArgs.status,
    data: responseArgs.data,
    errorCode: responseArgs.errorCode,
    errorDescription: responseArgs.errorDescription,
  });
  return;
};

export const sendErrorResponse = async (responseArgs: IResponseArgs) => {
  responseArgs.res.status(responseArgs.status).json({
    responseStatus: responseArgs.status == 200 ? 'successfull' : 'unsuccessfull',
    statusCode: responseArgs.status,
    errorCode: responseArgs.errorCode,
    errorDescription: responseArgs.errorDescription,
  });
  return;
};
