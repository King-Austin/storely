# Domain Management Implementation Plan

Add a "Domains" section to the Storely dashboard allowing users to search, purchase, and connect custom domains (.store, .com, .com.ng).

## Project Type
**WEB** (Next.js/React)

## Success Criteria
- [ ] "Domains" link added to the Dashboard sidebar under "Online Store".
- [ ] Search functionality to check domain availability (mocked).
- [ ] Support for specific TLDs: `.store`, `.com`, `.com.ng`.
- [ ] "Buy" flow using `BrutalistModal` with confirmation.
- [ ] Persistent (in-context) list of purchased domains.
- [ ] "Connect to Website" action for purchased domains.
- [ ] Consistent "Technical Brutalist" UI/UX.

## Tech Stack
- **Framework**: Next.js App Router
- **UI Components**: Radix UI, Lucide React, `BrutalistModal`
- **State Management**: React `useState` / `StoreContext`
- **Styling**: Tailwind CSS

## Task Breakdown

### Phase 1: Foundation
- **Task 1.1**: Update `DashboardLayout.tsx` navigation.
  - **Agent**: `frontend-specialist`
  - **Input**: `src/app/dashboard/layout.tsx`
  - **Output**: Navigation item for "Domains" leading to `/dashboard/online-store/domains`.
  - **Verify**: Sidebar shows "Domains" link.

### Phase 2: Domain Management Page
- **Task 2.1**: Create `domains/page.tsx` scaffold.
  - **Agent**: `frontend-specialist`
  - **Output**: Basic page with Brutalist header.
  - **Verify**: Navigating to `/dashboard/online-store/domains` works.

- **Task 2.2**: Implement Domain Search logic and UI.
  - **Agent**: `frontend-specialist`
  - **Logic**: Input for domain name + dropdown/filter for `.store`, `.com`, `.com.ng`.
  - **Verify**: Searching shows "Available" or "Taken" (mocked).

- **Task 2.3**: Implement "Buy" flow.
  - **Agent**: `frontend-specialist`
  - **Logic**: Use `BrutalistModal` to confirm purchase. Add domain to "Purchased" state.
  - **Verify**: Clicking buy adds domain to the user's list.

- **Task 2.4**: Implement "Connect" logic.
  - **Agent**: `frontend-specialist`
  - **Logic**: Show "Connect to Website" button for purchased domains. Update status on click.
  - **Verify**: Button appears and toggles connection state.

### Phase 3: Polish & Verification
- **Task 3.1**: Style with Brutalist tokens.
  - **Agent**: `frontend-specialist`
  - **Verify**: Matches `index.css` variables and aesthetics.

## Phase X: Verification
- [ ] Run `python .agent/scripts/checklist.py .`
- [ ] Manual test: Search -> Buy -> Connect flow.
- [ ] Verify TLD restrictions (.store, .com, .com.ng only).
