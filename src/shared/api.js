import axios from 'axios';
import { getTokens, setTokens, clearTokens } from './../utils/helpers';

class ApiError extends Error {
	// TODO: Implement Sentry error and exception handling for ApiErrors
	constructor({ status, message, data }) {
		super();
		this.status = status;
		this.message = message;
		this.data = data;
	}
}

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		Authorization: getTokens().accessToken
			? `Bearer ${getTokens().accessToken}`
			: '',
		Accept: 'application/json',
		'Content-Type': 'application/json'
	},
	xsrfHeaderName: 'X-CSRFTOKEN',
	xsrfCookieName: 'csrftoken'
});

const forceLogout = () => {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	window.location = '/login';
};

const handleApiResponse = error => {
	if (error.response) {
		console.warn('response error: ', error.toJSON());
		if (error.response.status === 401 && getTokens().accessToken === null) {
			window.location = '/login';
			throw new ApiError({
				status: error.response.status,
				message: 'Unauthorized user attempting to make API call!',
				data: error.response.data
			});
		} else if (error.response.data) {
			const errorObject = Object.values(error.response.data)[0];
			if (
				typeof errorObject === 'string' &&
				errorObject === 'Given token not valid for any token type'
			) {
				// Handle "Given token not valid for any token type" error and force re-obtain token
				// if access token and refresh token are both expired, that triggers the "given token" error
				// in that scenario, make the user login again
				forceLogout();
			} else {
				const parseErrorObject = e => {
					let errorString = '';

					if (typeof e === 'object') {
						if (e.args) {
							const parsedArgs = JSON.parse(e.args);
							Array.isArray(parsedArgs) &&
								parsedArgs.forEach(arg => {
									// each arg should be an object, where the key is the django error type (non_field_errors, etc) and the value is an array of strings with the actual error

									if (typeof arg === 'string') {
										// error.args can sometimes be just an array with a single string inside
										errorString = `${errorString ? `${errorString} -- ` : ''}${arg}`;
									} else {
										Object.entries(arg).forEach(([argType, argValue]) => {
											// each arg's value is an array of strings with the actual error message, combine them all into one string here
											console.warn('arg?? ', argType, argValue);
											errorString = `${errorString ? `${errorString} -- ` : ''}${argType}: ${argValue}`;
										});
									}
								});
						} else if (e.message) {
							errorString = `${e.message}`;
						} else {
							errorString = `${e}`;
						}
					} else if (Array.isArray(errorObject)) {
						// errorObject might sometimes be an Array? need to figure out the situations where it is
						console.warn('api error response is an array?? ', errorObject);
						// for now, since it's unknown when an error response will be an array, just return the first element stringified
						errorString = `${errorObject[0]}`;
					} else {
						// for any other type of error that we don't handle currently, just stringify the whole thing
						errorString = `${e}`;
					}

					return errorString;
				};

				const newApiError = new ApiError({
					status: error.response.status,
					message: parseErrorObject(errorObject),
					data: error.response.data
				});

				throw newApiError;
			}
		}
	} else if (error.request) {
		console.warn('request error: ', error.request);
		throw new ApiError({
			status: 500,
			message:
				'No response received! Please try your action again, or refresh the page.',
			data: error.request
		});
	} else {
		console.warn('other error: ', error.message);
		throw new ApiError({
			status: 500,
			message:
				'An unknown error occurred! Please try your action again, or refresh the page.',
			data: error.response.data
		});
	}
};

const handleTokenValidity = async () => {
	try {
		if (getTokens().accessToken) {
			await apiClient.request({
				url: '/auth/token/verify/',
				method: 'POST',
				headers: {
					Authorization: `Bearer ${getTokens().accessToken}`
				},
				data: { token: getTokens().accessToken }
			});
		}
	} catch (error) {
		if (error.response && error.response.status === 401) {
			if (getTokens().refreshToken) {
				try {
					const refreshResponse = await apiClient.request({
						url: '/auth/token/refresh/',
						method: 'POST',
						headers: {
							Authorization: `Bearer ${getTokens().accessToken}`
						},
						data: { refresh: getTokens().refreshToken }
					});
					setTokens(refreshResponse.data.access, refreshResponse.data.refresh);
				} catch (error) {
					if (error.response && error.response.status === 401) {
						forceLogout();
					}
				}
			} else {
				forceLogout();
			}
		}
	}
};

export const makeApiRequest = async (
	method,
	url,
	body = null,
	queryParams = {}
) => {
	await handleTokenValidity();

	const { accessToken } = getTokens();

	try {
		const response = await apiClient.request({
			url,
			method,
			headers: {
				Authorization: accessToken ? `Bearer ${accessToken}` : '',
			},
			params: queryParams,
			data: (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && body) ? body : undefined,
		});

		return response.data;
	} catch (e) {
		handleApiResponse(e);
	}
};

export const loginUser = async (data) => {
	const loginResponse = await makeApiRequest('POST', '/auth/token/', data);
	setTokens(loginResponse.access, loginResponse.refresh);
	return loginResponse;
};

export const logoutUser = async () => {
	await makeApiRequest('POST', '/auth/logout/');
	clearTokens();
};