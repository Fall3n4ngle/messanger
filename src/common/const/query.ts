import { generateDetailKeys, generateListKeys } from "../utils";

const userName = "users";
const conversationName = "conversations";
const memberName = "members";
const messageName = "messages";

export const userKeys = generateListKeys(userName);

export const conversationKeys = {
  ...generateListKeys(conversationName),
  ...generateDetailKeys(conversationName),
};

export const messageKeys = generateListKeys(messageName);

export const memberKeys = generateDetailKeys(memberName);
