import axios from 'axios'

//https://docs.google.com/spreadsheets/d/1_txnmuoX-rZVrHhZki4wNCBfSZQN3J86lN-PXw1xS4g/edit#gid=328274554
export enum ENDPOINTS {
  // AUTH
  LOGIN = '/login',
  IS_LOGGEDIN = '/protected',
  REGISTER = '/register',

  // USERS
  TELEGRAM_HANDLE = '/users/telegramID',
  USER = '/user',
  USER_PROFILE = '/profile/',
  USER_PROFILE_PICTURE = '/profile/picture/',
  USER_DETAILS = '/user/details',
  EDIT_PROFILE = '/profile/edit',
  USER_CCAS = '/user_CCA',
  FRIEND = '/friend',

  // FACILITY
  FACILITY_LIST = '/facilities/all',
  FACILITY = '/facility',
  FACILITY_BOOKING = '/bookings/facility',
  BOOKING = '/bookings',
  VIEW_BOOKING = '/booking',
  USER_BOOKINGS = '/bookings/user',

  // LAUNDRY
  MACHINE_LIST = '/location',
  LAUNDRY_MACHINE = '/laundry/machine',
  UPDATE_MACHINE = '/laundry/machine',
  LAUNDRY_JOB = '/laundry/job',
  EDIT_DURATION = '/laundry/machine/editDuration',

  // SCHEDULING
  USER_TIMETABLE = '/timetable/all',
  ALL_USERS = '/user/all',
  USER_PERMISSION = '/permissions',

  ALL_EVENTS = '/event/all',
  GET_EVENT_BY_EVENTID = '/event/eventID',
  GET_EVENT_BY_CCAID = '/event/ccaID',
  GET_PUBLIC_EVENTS = '/event/public',
  ALL_PUBLIC_EVENTS = '/event/public/all',
  ALL_PUBLIC_EVENTS_AFTER_SPECIFIC_TIME = '/event/public/afterTime',
  USER_PRIVATE_EVENTS_AFTER_SPECIFIC_TIME = '/event/private',
  USER_EVENT = '/user_event',
  ADD_EVENT = '/event/add',
  DELETE_EVENT = '/event/delete',
  RSVP_EVENT = '/user_event',
  EDIT_EVENT = '/event/edit',

  ADD_MODS = '/nusmods/addNUSMods',
  DELETE_NUSMODS_EVENT = '/nusmods/deleteMod',
  DELETE_MODS = '/nusmods/delete',
  NUSMODS = '/nusmods',

  USER_LESSON = 'user_lesson',
  LESSON_DETAILS = '/lesson',

  CCA_DETAILS = '/cca',
  ALL_CCAS = '/cca/all',
  CCA_MEMBER = '/user_CCA',

  EVENT_DETAILS = '/event',

  // FRIENDS
  ALL_FRIENDS = '/friend',

  // SOCIAL
  ALL_PROFILES = '/profiles',
  OFFICIAL_POSTS = '/posts/official',
  ALL_POSTS = '/posts',
  FRIENDS_OF_USER_POSTS = '/posts/friend',
  SPECIFIC_POST = '/posts',
  DELETE_POST = '/posts',
  EDIT_POST = '/posts',
  CREATE_POSTS = '/posts',

  // HOME
  SEARCH = '/search',
}

export enum DOMAINS {
  FACILITY = 'facility',
  EVENT = 'event',
  LAUNDRY = 'laundry',
  SOCIAL = 'social',
  AUTH = 'auth',
}

export const DOMAIN_URL = {
  FACILITY:
    process.env.REACT_APP_MODE === 'production'
      ? '//rhapp-backend.rhdevs.repl.co/facilities'
      : '//rhapp-middleware.herokuapp.com/rhappfacilities',
  EVENT:
    process.env.REACT_APP_MODE === 'production'
      ? '//rhapp-backend.rhdevs.repl.co/scheduling'
      : '//rhapp-middleware.herokuapp.com/rhappevents',
  LAUNDRY:
    process.env.REACT_APP_MODE === 'production'
      ? '//rhapp-backend.rhdevs.repl.co/laundry'
      : '//rhapp-middleware.herokuapp.com/rhapplaundry',
  SOCIAL:
    process.env.REACT_APP_MODE === 'production'
      ? '//rhapp-backend.rhdevs.repl.co/social'
      : '//rhapp-middleware.herokuapp.com/rhappsocial',
  AUTH:
    process.env.REACT_APP_MODE === 'production'
      ? '//rhapp-backend.rhdevs.repl.co/auth'
      : '//rhapp-middleware.herokuapp.com/rhappauth',
}

async function makeRequest(
  url: string,
  domain: DOMAINS,
  method: 'get' | 'post' | 'delete' | 'put',
  additionalHeaders: Record<string, unknown> = {},
  requestBody: Record<string, unknown> = {},
) {
  let DOMAIN_URL_REQ: string
  switch (domain) {
    case DOMAINS.FACILITY:
      DOMAIN_URL_REQ =
        process.env.REACT_APP_MODE === 'production'
          ? '//rhappfacilities.rhdevs.repl.co'
          : '//rhapp-middleware.herokuapp.com/rhappfacilities'
      break
    case DOMAINS.EVENT:
      DOMAIN_URL_REQ =
        process.env.REACT_APP_MODE === 'production'
          ? '//rhappevents.rhdevs.repl.co'
          : '//rhapp-middleware.herokuapp.com/rhappevents'
      break
    case DOMAINS.LAUNDRY:
      DOMAIN_URL_REQ =
        process.env.REACT_APP_MODE === 'production'
          ? '//rhapplaundry.rhdevs.repl.co'
          : '//rhapp-middleware.herokuapp.com/rhapplaundry'
      break
    case DOMAINS.SOCIAL:
      DOMAIN_URL_REQ =
        process.env.REACT_APP_MODE === 'production'
          ? '//rhappsocial.rhdevs.repl.co'
          : '//rhapp-middleware.herokuapp.com/rhappsocial'
      break
  }
  return axios({
    method: method,
    url: DOMAIN_URL_REQ + url,
    headers: {
      'Access-Control-Allow-Origin': '*',
      ...additionalHeaders,
    },
    data: requestBody,
    // withCredentials: true,
    validateStatus: (status) => {
      if (status >= 200 && status < 400) {
        return true
      } else {
        return false
      }
    },
  }).then((response) => response.data)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponsePromise = Promise<any>

export function get(endpoint: ENDPOINTS, domain: DOMAINS, subRoute = ''): ResponsePromise {
  return makeRequest(endpoint + subRoute, domain, 'get')
}

export function post(
  endpoint: ENDPOINTS,
  domain: DOMAINS,
  requestBody: Record<string, unknown>,
  additionalHeaders: Record<string, unknown> = {},
  subRoute = '',
): ResponsePromise {
  return makeRequest(endpoint + subRoute, domain, 'post', additionalHeaders, requestBody)
}

export function del(
  endpoint: ENDPOINTS,
  domain: DOMAINS,
  additionalHeaders: Record<string, unknown> = {},
  subRoute = '',
): ResponsePromise {
  return makeRequest(endpoint + subRoute, domain, 'delete', additionalHeaders)
}

export function put(
  endpoint: ENDPOINTS,
  domain: DOMAINS,
  requestBody: Record<string, unknown>,
  additionalHeaders: Record<string, unknown> = {},
  subRoute = '',
): ResponsePromise {
  return makeRequest(endpoint + subRoute, domain, 'put', additionalHeaders, requestBody)
}
