# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - heading "Book Your Kite Surfing Lesson" [level=1] [ref=e5]
        - paragraph [ref=e6]: Find the perfect wind window and instructor for your skill level.
      - generic [ref=e8]:
        - generic [ref=e9]:
          - generic [ref=e10]:
            - generic [ref=e11]: Date
            - textbox "Date" [active] [ref=e12]: 2025-12-10
          - generic [ref=e13]:
            - generic [ref=e14]: Skill Level
            - combobox "Skill Level" [ref=e15]:
              - generic: Select level
              - img
          - generic [ref=e16]:
            - generic [ref=e17]: Lesson Type
            - textbox "Lesson Type" [ref=e18]:
              - /placeholder: Search by name...
        - generic [ref=e20]: No lessons available for this date. Try another day.
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e26] [cursor=pointer]:
    - img [ref=e27]
  - alert [ref=e30]
```