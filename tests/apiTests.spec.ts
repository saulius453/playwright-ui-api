import { test, expect, request, APIResponse, APIRequest, APIRequestContext } from '@playwright/test';
import { env } from 'process';

const client_id = '<YOUR CLIENT ID HERE>';
const client_secret = '<YOUR CLIENT SECRET HERE>';
const existing_artist_id = '0TnOYISbd1XYRBk9myaseg';
const not_existing_artist_id = '0TnOYISbd1XYRBk9myas11';
const incorrect_artist_id = '0TnOYISbd1XYRBk9asdfcfadvadv6584658586658685658568568568568568568568586myas11';

const defaultRequest = async (request: APIRequestContext, artistId: string, token: string | undefined): Promise<APIResponse> => {
  const response = await request.get(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
}

test.beforeAll(async ({ request }) => {
  const response = await request.post('https://accounts.spotify.com/api/token', {
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
  });
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  env.API_TOKEN = data.access_token;
});

test('Should return 404 when artist not found', async ({ request }) => {
  const response = await defaultRequest(request, not_existing_artist_id, env.API_TOKEN)
  expect(response.status()).toBe(404);
  expect(response.statusText()).toBe('Not Found');
});

test('Should return 400 when incorrect artist id provided', async ({ request }) => {
  const response = await defaultRequest(request, incorrect_artist_id, env.API_TOKEN)
  expect(response.status()).toBe(400);
  expect(response.statusText()).toBe('Bad Request');
});

test('Should return 401 when no token provided', async ({ request }) => {
  const response = await defaultRequest(request, existing_artist_id, undefined)
  expect(response.status()).toBe(401);
  expect(response.statusText()).toBe('Unauthorized');
});

test('Should return 200 with correct headers when request is correct', async ({ request }) => {
  const response = await defaultRequest(request, existing_artist_id, env.API_TOKEN)
  expect(response.status()).toBe(200);
  expect(response.statusText()).toBe('OK');
  expect(response.headers()).toHaveProperty("content-type", "application/json; charset=utf-8");
});

test('Should return correct json body when request parameters are correct', async ({ request }) => {
  const response = await defaultRequest(request, existing_artist_id, env.API_TOKEN)
  const data = await response.json();
  console.log(data);
  expect(data).toMatchObject({
    external_urls: { spotify: 'https://open.spotify.com/artist/0TnOYISbd1XYRBk9myaseg' },
    followers: { href: null, total: 9745450 },
    genres: [ 'dance pop', 'miami hip hop', 'pop', 'pop rap' ],
    href: 'https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg',
    id: '0TnOYISbd1XYRBk9myaseg',
    images: [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab6761610000e5ebfc9d2abc85b6f4bef77f80ea',
        width: 640
      },
      {
        height: 320,
        url: 'https://i.scdn.co/image/ab67616100005174fc9d2abc85b6f4bef77f80ea',
        width: 320
      },
      {
        height: 160,
        url: 'https://i.scdn.co/image/ab6761610000f178fc9d2abc85b6f4bef77f80ea',
        width: 160
      }
    ],
    name: 'Pitbull',
    popularity: 83,
    type: 'artist',
    uri: 'spotify:artist:0TnOYISbd1XYRBk9myaseg'
  })
});