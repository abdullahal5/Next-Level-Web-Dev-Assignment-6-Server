export type TErrorSourses = {
   path: string | number;
   message: string;
 }[];
 
 export type TGenereicErrorResponse = {
   statusCode: number;
   message: string;
   errorSources: TErrorSourses;
 };
 