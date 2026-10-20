/**
 * AuditMark Pro - Main Studio Controller
 */
(function() {
  'use strict';

  const defaultPresets = {
    'shopify-ecommerce': {
      companyName: 'Nova Brands Direct LLC',
      websiteUrl: 'https://novabrandsdirect.com',
      contactEmail: 'privacy@novabrandsdirect.com',
      jurisdiction: 'US_UK_EU',
      businessType: 'e-commerce',
      dpoName: 'Data Privacy Officer',
      dataCategories: 'Contact info (Name, Email, Phone), Shipping & Billing Addresses, Payment Tokens, Browsing History, Cart Cookies',
      thirdParties: 'Shopify Payments, Stripe, Klaviyo Email, Google Analytics 4, Meta Ads Pixel, TikTok Pixel',
      retentionPeriod: '7 years for tax & order accounting; 12 months for marketing analytics cookies.',
      bannerTheme: 'dark',
      bannerPosition: 'bottom-bar',
      bannerTitle: 'We Value Your Privacy & Cookies',
      bannerText: 'We use cookies to analyze web traffic, remember shopping cart items, and deliver tailored promotions in accordance with GDPR & CCPA.'
    },
    'b2b-saas': {
      companyName: 'CloudMetrics Systems Inc.',
      websiteUrl: 'https://cloudmetrics.io',
      contactEmail: 'compliance@cloudmetrics.io',
      jurisdiction: 'GLOBAL_GDPR_CCPA',
      businessType: 'saas',
      dpoName: 'Chief Information Security Officer (CISO)',
      dataCategories: 'Corporate Work Email, Company Billing Info, Application Usage Metrics, System API Logs, Browser Telemetry',
      thirdParties: 'AWS Infrastructure, Stripe Billing, PostHog Product Analytics, HubSpot CRM, Intercom Chat Support',
      retentionPeriod: 'Active contract subscription duration plus 90 days grace period before hard tenant deletion.',
      bannerTheme: 'indigo',
      bannerPosition: 'floating-right',
      bannerTitle: 'Cookie & Tracking Telemetry Consent',
      bannerText: 'We utilize telemetry cookies to improve software performance, security, and authentication across our SaaS platform.'
    },
    'uae-enterprise': {
      companyName: 'Al-Mirage Holdings FZ-LLC',
      websiteUrl: 'https://almirageholdings.ae',
      contactEmail: 'dpo@almirageholdings.ae',
      jurisdiction: 'UAE_PDPL',
      businessType: 'enterprise',
      dpoName: 'Head of Legal & Regulatory Compliance',
      dataCategories: 'Emirates ID / Passport Copy, Verified Contact Details, Trade License Verification, UAE Financial Profiling',
      thirdParties: 'UAE Central Bank Compliant Gateway, Microsoft Azure UAE North, Salesforce Middle East Cloud',
      retentionPeriod: '10 years in strict compliance with UAE Commercial Transactions Law and Anti-Money Laundering (AML) statutes.',
      bannerTheme: 'emerald',
      bannerPosition: 'bottom-bar',
      bannerTitle: 'UAE Personal Data Protection Act Compliance',
      bannerText: 'In compliance with UAE Federal Decree-Law No. 45/2021 (PDPL), we require your explicit consent for cookie analytics.'
    }
  };

  let state = Object.assign({}, defaultPresets['shopify-ecommerce']);

  function init() {
    setupSidebarTabs();
    setupStageTabs();
    populateForm();
    bindEvents();
    renderAll();
  }

  function setupSidebarTabs() {
    const tabs = document.querySelectorAll('.sidebar-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel-tab-content').forEach(c => c.style.display = 'none');
        tab.classList.add('active');
        const target = document.getElementById(tab.dataset.target);
        if (target) target.style.display = 'block';
      });
    });
  }

  function setupStageTabs() {
    const tabs = document.querySelectorAll('.stage-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.stage-view').forEach(v => v.style.display = 'none');
        tab.classList.add('active');
        const target = document.getElementById(tab.dataset.target);
        if (target) target.style.display = 'block';
      });
    });
  }

  function populateForm() {
    document.getElementById('f_company').value = state.companyName;
    document.getElementById('f_url').value = state.websiteUrl;
    document.getElementById('f_email').value = state.contactEmail;
    document.getElementById('f_jurisdiction').value = state.jurisdiction;
    document.getElementById('f_type').value = state.businessType;
    document.getElementById('f_dpo').value = state.dpoName;
    document.getElementById('f_data').value = state.dataCategories;
    document.getElementById('f_third_parties').value = state.thirdParties;
    document.getElementById('f_retention').value = state.retentionPeriod;
    
    // Banner config
    document.getElementById('b_theme').value = state.bannerTheme;
    document.getElementById('b_pos').value = state.bannerPosition;
    document.getElementById('b_title').value = state.bannerTitle;
    document.getElementById('b_text').value = state.bannerText;
  }

  function bindEvents() {
    document.getElementById('preset_selector').addEventListener('change', (e) => {
      const val = e.target.value;
      if (defaultPresets[val]) {
        state = Object.assign({}, defaultPresets[val]);
        populateForm();
        renderAll();
      }
    });

    const inputs = ['f_company', 'f_url', 'f_email', 'f_jurisdiction', 'f_type', 'f_dpo', 'f_data', 'f_third_parties', 'f_retention', 'b_theme', 'b_pos', 'b_title', 'b_text'];
    inputs.forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        readForm();
        renderAll();
      });
    });

    // Auditor Checkboxes
    document.querySelectorAll('.check-audit').forEach(cb => {
      cb.addEventListener('change', updateRiskScore);
    });

    // Copy embed code
    document.getElementById('btn_copy_embed').addEventListener('click', () => {
      const code = document.getElementById('embed_code_display').textContent;
      navigator.clipboard.writeText(code).then(() => alert('Embed snippet copied to clipboard!'));
    });

    // Download Policy Markdown
    document.getElementById('btn_download_markdown').addEventListener('click', () => {
      const md = generatePolicyMarkdown();
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (state.companyName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()) + '_privacy_policy.md';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function readForm() {
    state.companyName = document.getElementById('f_company').value;
    state.websiteUrl = document.getElementById('f_url').value;
    state.contactEmail = document.getElementById('f_email').value;
    state.jurisdiction = document.getElementById('f_jurisdiction').value;
    state.businessType = document.getElementById('f_type').value;
    state.dpoName = document.getElementById('f_dpo').value;
    state.dataCategories = document.getElementById('f_data').value;
    state.thirdParties = document.getElementById('f_third_parties').value;
    state.retentionPeriod = document.getElementById('f_retention').value;

    state.bannerTheme = document.getElementById('b_theme').value;
    state.bannerPosition = document.getElementById('b_pos').value;
    state.bannerTitle = document.getElementById('b_title').value;
    state.bannerText = document.getElementById('b_text').value;
  }

  function renderAll() {
    renderPolicyHTML();
    renderBannerPreview();
    renderEmbedCode();
    updateRiskScore();
  }

  function renderPolicyHTML() {
    const sheet = document.getElementById('policy_rendered_sheet');
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    let lawRef = 'General Data Protection Regulation (EU/UK GDPR) and California Consumer Privacy Act (CCPA/CPRA)';
    if (state.jurisdiction === 'UAE_PDPL') {
      lawRef = 'UAE Federal Decree-Law No. 45/2021 on Personal Data Protection (PDPL) and applicable DIFC/ADGM data protection frameworks';
    }

    sheet.innerHTML = `
      <h1>Privacy Policy &amp; Data Protection Statement</h1>
      <p style="color:#64748b;font-size:0.85rem;">Last Updated: ${today} | Organization: <strong>${state.companyName}</strong> (${state.websiteUrl})</p>
      
      <h2>1. Introduction &amp; Regulatory Framework</h2>
      <p>${state.companyName} ("we", "us", or "our") respects your individual privacy and is committed to protecting your personal data. This policy outlines our data collection, processing, and protection principles in full adherence to ${lawRef}.</p>
      
      <h2>2. Categories of Personal Data Collected</h2>
      <p>We collect and process the following classifications of personal information:</p>
      <ul>
        ${state.dataCategories.split(',').map(c => `<li>${c.trim()}</li>`).join('')}
      </ul>

      <h2>3. Third-Party Data Processors &amp; Sub-Processors</h2>
      <p>Your data is processed only with authorized service providers under formal Data Processing Agreements (DPAs):</p>
      <ul>
        ${state.thirdParties.split(',').map(p => `<li>${p.trim()}</li>`).join('')}
      </ul>

      <h2>4. Data Retention &amp; Security Standards</h2>
      <p>${state.retentionPeriod}</p>
      <p>All sensitive telemetry and credentials are protected with TLS 1.3 in transit and AES-256 at rest.</p>

      <h2>5. Individual Rights &amp; How to Opt-Out</h2>
      <p>Under applicable law, you possess the right to access, rectify, delete, restrict processing, and port your personal data. To exercise any statutory data subject rights, contact our ${state.dpoName} at <a href="mailto:${state.contactEmail}">${state.contactEmail}</a>.</p>
    `;
  }

  function renderBannerPreview() {
    const previewContainer = document.getElementById('banner_preview_canvas');
    previewContainer.innerHTML = `
      <div style="background:#ffffff;border-radius:8px;padding:3rem 1.5rem;text-align:center;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);position:relative;overflow:hidden;min-height:360px;">
        <h3 style="color:#0f172a;margin-bottom:0.5rem;">${state.companyName} — Live Website Simulation</h3>
        <p style="color:#64748b;font-size:0.9rem;">The interactive cookie consent banner below simulates how visitors on your site will experience compliance gating.</p>

        <!-- Simulated Banner inside mock page -->
        <div class="auditmark-banner-root theme-${state.bannerTheme} pos-${state.bannerPosition}" style="position:absolute;box-shadow:0 10px 25px rgba(0,0,0,0.3);">
          <div class="auditmark-banner-title">🛡️ ${state.bannerTitle}</div>
          <div class="auditmark-banner-desc">
            ${state.bannerText}
            <a href="#" style="color:#34d399;margin-left:4px;">Read Privacy Policy</a>
          </div>
          <div class="auditmark-banner-btn-group">
            <button class="auditmark-btn-accept" onclick="alert('Consent Saved: Analytics & Marketing Allowed!')">Accept All</button>
            <button class="auditmark-btn-decline" onclick="alert('Consent Saved: Necessary Cookies Only!')">Decline Non-Essential</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderEmbedCode() {
    const configObj = {
      bannerTitle: state.bannerTitle,
      bannerText: state.bannerText,
      theme: state.bannerTheme,
      position: state.bannerPosition,
      privacyPolicyUrl: state.websiteUrl + '/privacy'
    };

    const snippet = `<!-- AuditMark Pro - Zero-Dependency Cookie Consent Banner -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/auditmark/runtime@1.0.0/auditmark.min.css">
<script src="https://cdn.jsdelivr.net/gh/auditmark/runtime@1.0.0/auditmark.min.js"><\/script>
<script>
  (function() {
    new AuditMarkConsent(${JSON.stringify(configObj, null, 2)});
  })();
<\/script>
<!-- /AuditMark Pro Banner -->`;

    document.getElementById('embed_code_display').textContent = snippet.replace(/<\\\/script>/g, '<\/script>');
  }

  function generatePolicyMarkdown() {
    const today = new Date().toISOString().split('T')[0];
    return `# PRIVACY POLICY & DATA PROTECTION NOTICE
**Organization**: ${state.companyName}
**Website**: ${state.websiteUrl}
**Effective Date**: ${today}
**Contact**: ${state.contactEmail}

---
### 1. Overview & Statutory Scope
This Privacy Notice applies to all personal information collected via ${state.websiteUrl} in accordance with ${state.jurisdiction}.

### 2. Categories of Data Collected
${state.dataCategories.split(',').map(c => `- ${c.trim()}`).join('\n')}

### 3. Authorized Third-Party Sub-Processors
${state.thirdParties.split(',').map(p => `- ${p.trim()}`).join('\n')}

### 4. Retention Schedule
${state.retentionPeriod}

### 5. Data Subject Rights & DPO Contact
You may exercise your rights of access, rectification, and erasure by writing to our **${state.dpoName}** at ${state.contactEmail}.
`;
  }

  function updateRiskScore() {
    const checkboxes = document.querySelectorAll('.check-audit');
    let checkedCount = 0;
    checkboxes.forEach(cb => { if (cb.checked) checkedCount++; });
    const score = Math.round((checkedCount / checkboxes.length) * 100);

    const scoreDisplay = document.getElementById('audit_score_val');
    const bar = document.getElementById('audit_score_bar');
    if (scoreDisplay && bar) {
      scoreDisplay.textContent = score + '%';
      bar.style.width = score + '%';
      if (score >= 80) {
        scoreDisplay.style.color = '#10b981';
      } else if (score >= 50) {
        scoreDisplay.style.color = '#f59e0b';
      } else {
        scoreDisplay.style.color = '#ef4444';
      }
    }
  }

  window.addEventListener('DOMContentLoaded', init);
})();
