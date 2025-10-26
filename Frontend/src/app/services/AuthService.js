import { api } from "../libs/api";

export async function registerApi(payload) {
	return api.post("auth/register", payload);
}

export async function loginApi(payload) {
	return api.post("auth/login", payload);
}

export async function getProfileApi(token) {
	return api.get("users", { token });
}

export async function updateUserApi(token, payload) {
	return api.put("users", payload, { token });
}
