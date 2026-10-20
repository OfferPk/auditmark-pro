/**
 * AuditMark Pro - Zero-Dependency Cookie Consent Runtime v1.0.0
 * Supports GDPR, CCPA/CPRA, UAE PDPL, and Google Consent Mode v2
 */
(function(window) {
  'use strict';

  function AuditMarkConsent(options) {
    this.options = Object.assign({
      bannerTitle: 'We Value Your Privacy & Data Rights',
      bannerText: 'We use cookies and telemetry trackers to analyze traffic, personalize marketing, and ensure a seamless experience in compliance with GDPR, CCPA, and UAE PDPL.',
      theme: 'dark',
      position: 'bottom-bar',
      privacyPolicyUrl: '#',
      storageKey: 'auditmark_consent_preferences',
      onConsentUpdate: null
    }, options || {});

    this.consent = this.loadConsent();
    this.init();
  }

  AuditMarkConsent.prototype.loadConsent = function() {
    try {
      const data = localStorage.getItem(this.options.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  };

  AuditMarkConsent.prototype.saveConsent = function(prefs) {
    try {
      localStorage.setItem(this.options.storageKey, JSON.stringify(prefs));
    } catch (e) {}

    // Dispatch Google Consent Mode v2 signals if gtag is present
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'ad_storage': prefs.marketing ? 'granted' : 'denied',
        'ad_user_data': prefs.marketing ? 'granted' : 'denied',
        'ad_personalization': prefs.marketing ? 'granted' : 'denied',
        'analytics_storage': prefs.analytics ? 'granted' : 'denied',
        'functionality_storage': prefs.functional ? 'granted' : 'denied',
        'security_storage': 'granted'
      });
    }

    if (typeof this.options.onConsentUpdate === 'function') {
      this.options.onConsentUpdate(prefs);
    }
  };

  AuditMarkConsent.prototype.init = function() {
    if (this.consent) {
      // Re-apply gtag on page load if user has prior recorded consent
      this.saveConsent(this.consent);
      return;
    }
    this.renderBanner();
  };

  AuditMarkConsent.prototype.renderBanner = function() {
    const existing = document.getElementById('auditmark_banner_root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'auditmark_banner_root';
    root.className = `auditmark-banner-root theme-${this.options.theme} pos-${this.options.position}`;
    root.innerHTML = `
      <div class="auditmark-banner-title">🛡️ ${this.options.bannerTitle}</div>
      <div class="auditmark-banner-desc">
        ${this.options.bannerText}
        <a href="${this.options.privacyPolicyUrl}" target="_blank" style="color:#34d399;margin-left:4px;">Learn more in Privacy Policy</a>
      </div>
      <div class="auditmark-banner-btn-group">
        <button class="auditmark-btn-accept" id="auditmark_btn_accept_all">Accept All</button>
        <button class="auditmark-btn-decline" id="auditmark_btn_reject">Necessary Only</button>
      </div>
    `;

    document.body.appendChild(root);

    document.getElementById('auditmark_btn_accept_all').addEventListener('click', () => {
      const prefs = {
        necessary: true,
        analytics: true,
        marketing: true,
        functional: true,
        timestamp: new Date().toISOString()
      };
      this.saveConsent(prefs);
      root.remove();
    });

    document.getElementById('auditmark_btn_reject').addEventListener('click', () => {
      const prefs = {
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false,
        timestamp: new Date().toISOString()
      };
      this.saveConsent(prefs);
      root.remove();
    });
  };

  window.AuditMarkConsent = AuditMarkConsent;
})(window);
