# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e6]: KiteOps
        - navigation [ref=e7]:
          - link "Dashboard" [ref=e8] [cursor=pointer]:
            - /url: /dashboard
            - img [ref=e9]
            - generic [ref=e12]: Dashboard
          - link "Calendar" [ref=e13] [cursor=pointer]:
            - /url: /calendar
            - img [ref=e14]
            - generic [ref=e16]: Calendar
          - link "Settings" [ref=e17] [cursor=pointer]:
            - /url: /settings
            - img [ref=e18]
            - generic [ref=e21]: Settings
          - button "Logout" [ref=e22]:
            - img [ref=e23]
            - generic [ref=e26]: Logout
    - main [ref=e27]:
      - generic [ref=e28]: Loading profile...
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e34] [cursor=pointer]:
    - img [ref=e35]
  - alert [ref=e38]
```