# AuditMark Pro — Architecture & Technical Specifications

## 1\. Executive Summary

AuditMark Pro is a client-side privacy policy generation suite and standalone cookie consent banner engine. It equips web developers, e-commerce merchants, and agency operators with tools to achieve compliance with EU/UK GDPR, California CCPA/CPRA, and UAE Federal Decree-Law No. 45/2021 (PDPL) without recurring SaaS costs.

## 2\. Cookie Consent Runtime Architecture

- **Zero Dependencies**: Pure vanilla JavaScript under 5KB unminified, zero external library requirements.  
- **Granular Categories**: Supports Necessary (strictly essential), Analytics (telemetry/performance), Marketing (ad conversion pixels), and Functional cookies.  
- **Google Consent Mode v2 Integration**: Automatically calls `window.gtag('consent', 'update', {...})` with `ad_storage`, `ad_user_data`, `ad_personalization`, and `analytics_storage` parameters.  
- **Persistence**: Records timestamped affirmative user consent in `localStorage` under `auditmark_consent_preferences`.

## 3\. Dynamic Policy Formulation Engine

- Reactive template synthesizer formatting statutory disclosures into Markdown and semantic HTML.  
- Enumerates sub-processors, security encryption specs (TLS 1.3, AES-256), and formal Data Subject Access Request (DSAR) workflows.