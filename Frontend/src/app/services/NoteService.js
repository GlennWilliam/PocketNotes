import { api } from "../libs/api";

export async function createNoteApi(payload, token) {
  const response = await api.post(
    "/note/",
    payload,
    {
      headers: {
        Authorization: token, // should already include "Bearer " prefix
      },
    }
  );
  return response?.data ?? response;
}