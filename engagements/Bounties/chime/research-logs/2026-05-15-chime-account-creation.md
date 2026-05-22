# Chime Account Creation Log

**Date:** 2026-05-15
**Researcher:** Jacob Kraniak
**Email Used:** jacob-kraniak@bugcrowdninja.com

## Issue
Sign-up attempts failing, likely due to randomized SSN.

## Actions Taken
- Attempted production sign-up via https://www.chime.com/online-banking/
- Inquired with Chime team regarding legitimate SSN requirement.

## Program-Specific Guidance (from https://bugcrowd.com/engagements/chime)
- Use @bugcrowdninja.com alias (correctly done).
- **Production**: Requires real SSN, valid US mobile, physical address. Debit card will be mailed.
- **For multiple test accounts**: Fully verify one primary account with real SSN, then email bugbounty@chime.com to enable SSN reuse for additional aliases (e.g., jacob-kraniak+test1@bugcrowdninja.com).
- **Staging/QA Recommendation for Beginners**: Use https://member-qa.chime.com/enroll/ — try different random SSN patterns (e.g., ending in 1234 or 1235) as validation is less strict.

## Next Steps
- Await response from Chime team.
- If no reply, attempt QA environment with varied SSN.
- Document any successful account creation with screenshots (redacted).

**Compliance Note**: All testing limited to authorized test accounts per program rules.