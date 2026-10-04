# IoT Home

Expo / React Native smart-home app with a drawer, live sensors, device control,
light and dark themes, and a service layer ready for a real backend.

## Run

```bash
npm install          # also installs async-storage, newly added
npx expo start
```

With no backend configured the app runs on demo data (including random
failures so you can see the error states).

## Connect your backend

1. Copy `.env.example` to `.env.local` and set `EXPO_PUBLIC_API_URL`.
2. Restart with `npx expo start -c` (env vars are baked in at bundle time).
3. Settings → Data source shows which mode is active.

Phones cannot reach `localhost`. Use your computer's LAN IP, or
`http://10.0.2.2:PORT` from the Android emulator. Use HTTPS in production.

### API contract

All bodies are JSON. Errors: any non-2xx status with `{ "message": "..." }`;
the message is shown to the user.

| Method | Path           | Request          | Response                                        |
| ------ | -------------- | ---------------- | ----------------------------------------------- |
| GET    | `/gateway`     |                  | `{ "connected": true }`                         |
| GET    | `/sensors`     |                  | `{ "temperature": 28, "humidity": 65, "lightLevel": 720 }` (numbers) |
| GET    | `/devices`     |                  | `[{ "id": "1", "name": "Living Room Light", "type": "Smart Light", "status": true }]` |
| PATCH  | `/devices/:id` | `{ "status": true }` | the updated device (same shape)             |

- `id` may be a string or number. `type` picks the icon (light, fan, lock, air conditioner, tv, camera, plug).
- Responses are validated in `src/services/mappers.ts`; bad data shows an error instead of breaking the UI.
- Auth: call `setAuthToken(token)` from `src/services/http.ts` after login.

## Where things live

```
src/config.ts               API URL, mock switch, timeouts, poll interval
src/services/IoTServices.ts picks mock or HTTP; screens never know which
src/services/http.ts        fetch wrapper (timeout, JSON, errors, auth header)
src/services/httpIoTService.ts   real endpoints
src/services/mockIoTService.ts   demo data
src/context/IoTContext.tsx  devices, sensors, gateway, polling, optimistic toggles
src/context/SettingsContext.tsx  persisted settings and theme
```
