# Debug Plan for MyCareer Frontend

## Findings
- **Project structure**: `frontend/frontend/` with `index.html`, `script.js`, `styles.css`, `email-service.js`, `api-integration.js`, `login.html`, `register.html`, `package.json`, `vercel.json`.
- **Loaded scripts**: `index.html` loads `email-service.js` twice (head and before body end) and `script.js` at the end. `api-integration.js` is present but not referenced by `index.html`.
- **Architecture mix**:
  - `script.js` defines fixed in-memory jobs (`fixedJobs`) and UI logic (navigation, search, filtering, featured/recent jobs) with `API_BASE_URL = http://localhost:3000/api`.
  - `api-integration.js` defines `JobSeekerAPI` and helpers for real backend calls, but these functions are unused unless manually included.
  - `login.html`/`register.html` use `localStorage` (`userData`) auth, separate from `script.js` auth (`authToken`), indicating inconsistent auth flows.
- **Potential issues spotted**:
  - `index.html` includes `email-service.js` twice; redundant and may re-initialize EmailJS.
  - If no backend is running on `localhost:3000`, any API call path in `script.js` will fail. However `script.js` primarily uses `fixedJobs` for job lists.
  - Need to confirm that UI functions referenced in `index.html` (e.g., `showHome()`, `showJobs()`, `searchJobs()`) exist and that required DOM elements (`#homePage`, `#jobsPage`, `#featuredJobs`, filter inputs) are present.
  - `email-service.js` expects global `emailjs` from CDN and manipulates DOM for a modal; must ensure CSS classes exist and there are no ID clashes.

## Step-by-step debugging checklist
1. **Serve and open app**
   - Start a static server from `frontend/frontend/` and open in browser.
   - Verify no 404s for `email-service.js`, `script.js`, CSS, or CDN scripts.
2. **Console audit**
   - Open DevTools console; reload `index.html`.
   - Note any errors from `script.js` (e.g., undefined elements or functions) and `email-service.js` (EmailJS init).
3. **Home page initialization**
   - Confirm `showHome()` runs and `loadFeaturedJobs()` populates `#featuredJobs` with cards. Ensure `updateStats()` exists and updates counters.
4. **Jobs page**
   - Click Jobs. Confirm `showJobs()` and `loadAllJobs()` work and pagination/filters render. Check filter IDs `#locationFilter`, `#categoryFilter`, `#experienceFilter`, `#salaryFilter` and `#activeFilters` exist and match `script.js`.
5. **Search bar**
   - Use hero search and filters (`#heroSearchInput`, `#heroLocationFilter`, `#heroCategoryFilter`). Confirm `searchJobs()` filters and calls `loadAllJobs(filteredJobs)`.
6. **Email service**
   - Trigger any flow that invokes `emailService` (e.g., application submission if present). Confirm `emailjs` is initialized, and fallbacks (mailto/clipboard/modal) work.
7. **Auth consistency**
   - Test `register.html` -> `login.html` (`localStorage.userData`). After login, you are redirected to `index.html`. Confirm `script.js` does not expect `authToken` for public views.
8. **Backend toggles**
   - If backend present, verify `API_BASE_URL` and CORS. If not present, ensure code paths avoid `makeAPIRequest` and rely on `fixedJobs` without crashing.

## Suspected root causes to watch for
- **Missing function implementations** referenced by `index.html` (e.g., `loadAllJobs`, `updateStats`, job details modal controls) in `script.js`.
- **DOM query miss**: IDs/class names mismatch between `index.html` and `script.js` (would show `null` access errors).
- **Double inclusion of `email-service.js`** causing double initialization/log spam.
- **Network errors** hitting `http://localhost:3000/api/...` when no backend is running.

## Immediate fixes proposed (non-breaking)
- **Remove duplicate include**: Keep only one `<script src="email-service.js"></script>` in `index.html`.
- **Guard DOM lookups**: Where `document.getElementById(...)` is used, ensure null-checks before property access (some already present in `script.js`).
- **Defer backend usage**: Keep `fixedJobs` as default; wrap API calls with try/catch and fallbacks (already partially done) and add user-facing messages via `showMessage()`.
- **Align auth messaging**: Clarify in UI that login/register are client-side only for now.

## Next plan
- **[Run]** Start local static server and reproduce issues in console.
- **[Fix]** Remove duplicate `email-service.js` include and retest EmailJS init.
- **[Verify]** Ensure all functions used by `index.html` exist in `script.js` (add any missing stubs with safe no-ops if needed).
- **[Test]** Exercise search and filters; fix any ID mismatches or undefined variables.
- **[Decide]** Whether to integrate `api-integration.js` now or keep `fixedJobs`. If integrating, include it in `index.html` and wire calls behind feature flag.

## Open questions
- **Which file to prioritize for debugging?** If you have a specific failing page or function, share the exact steps and errors.
- **Is a backend available at `http://localhost:3000/api`?** If yes, we can enable `api-integration.js`.
- **Which EmailJS credentials and template fields are final?** Current keys and template IDs are hardcoded.
