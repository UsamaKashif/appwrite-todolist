import { Appwrite } from "appwrite";

const appwrite = new Appwrite();

appwrite
    .setEndpoint(`${process.env.NEXT_PUBLIC_ENDPOINT}`) // Your Appwrite Endpoint
    .setProject(`${process.env.NEXT_PUBLIC_PROJECT}`) // Your project ID
;

export default appwrite;