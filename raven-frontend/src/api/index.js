import config from '../config';
import { sendRequests, getRequest, deleteRequest } from './methods';
import { handleAuthorization } from './error';

// get style
export const getStyles = async () => {
  return await getRequest(`${config.server.host}/v1/styles`, {});
};

// get outfits
export const getOutfits = async (styleId, query) => {
  return await sendRequests('POST', `${config.server.host}/v1/styles/${styleId}/outfit`, {}, query);
};

// custom items
export const getCustomItems = async (productId, query) => {
  // console.log(query)
  return await sendRequests('POST', `${config.server.host}/v1/products/${productId}/similar`, {}, query);
};

// get Another after dislike
export const getAnother = async (accessToken, productId, category) => {
  return await getRequest(`${config.server.host}/v1/products/${productId}/another?category=${category}`);  
};

// Store Dislike
export const storeDislike = async (accessToken, userId, query) => {
    return await sendRequests(
      'POST', 
      `${config.server.host}/v1/user/${userId}/event`, 
      {Authorization: `Bearer ${accessToken}`,}, 
      query
    );  
  };

// get My Lists
export const getLists = async (accessToken) => {
  return await getRequest(`${config.server.host}/v1/list`, {Authorization: `Bearer ${accessToken}`});  
};

// Create a list
export const createList = async (accessToken, query) => {
  return await sendRequests('POST', `${config.server.host}/v1/list`, {Authorization: `Bearer ${accessToken}`}, query);  
};

export const editList = async (accessToken, listId, query) => {
  return await sendRequests('PATCH', `${config.server.host}/v1/list/${listId}`, {Authorization: `Bearer ${accessToken}`}, query);  
}

// Get all list items
export const getListItems = async (accessToken, listId) => {
  return await getRequest(`${config.server.host}/v1/list/${listId}?page=1&perPage=10`, {Authorization: `Bearer ${accessToken}`});  
};

export const getItem = async (accessToken, productId) => {
  return await getRequest(`${config.server.host}/v1/products/${productId}`, {Authorization: `Bearer ${accessToken}`});  
};

export const deleteList = async (accessToken, listId) => {
  return await deleteRequest('DELETE', `${config.server.host}/v1/list/${listId}`, {Authorization: `Bearer ${accessToken}`});  
};

export const addItemToList = async (accessToken, listId, query) => {
  return await sendRequests('POST', `${config.server.host}/v1/list/${listId}/item`, {Authorization: `Bearer ${accessToken}`}, query);  
};

export const createUser = async (accessToken, query) => {
  return await sendRequests('POST', `${config.server.host}/v1/user`, {Authorization: `Bearer ${accessToken}`}, query);  
};

export const getUser = async (accessToken, userId) => {
  return await getRequest(`${config.server.host}/v1/user/${userId}`, {Authorization: `Bearer ${accessToken}`});  
};

export const editUser = async (accessToken, userId, query) => {
  return await sendRequests('PATCH', `${config.server.host}/v1/user/${userId}`, {Authorization: `Bearer ${accessToken}`}, query);  
};

export const getBrands = async () => {
  return await getRequest(`${config.server.host}/v1/brands`);  
};

export const deleteProductFromList = async (accessToken, listId, itemId) => {
  return await deleteRequest('DELETE', `${config.server.host}/v1/list/${listId}/item/${itemId}`, {Authorization: `Bearer ${accessToken}`});  
};

// Place Autocomplete
export const getPlaceAutocomplete = async (accessToken, place) => {
  return await getRequest(`${config.server.host}/v1/placeAutocomplete?input=${place}`, {Authorization: `Bearer ${accessToken}`});  
};