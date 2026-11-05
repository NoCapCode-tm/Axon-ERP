import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Database,
  Eye,
  FileDown,
  MessageCircle,
  Server,
  Smartphone,
} from 'lucide-react';
import styles from '../CSS/Settings.module.css';

const tabs = ['Preferences', 'Profile', 'Notifications', 'Security', 'Data Management'];

const initialPreferences = {
  language: '',
  timeZone: '',
  dateFormat: '',
  timeFormat: '',
  currency: 'INR',
  mode: 'Dark',
};

const initialProfile = {
  fullName: '',
  email: '',
  phone: '',
  schoolName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
};

const initialNotifications = {
  email: false,
  sms: false,
  push: false,
};

const initialSecurity = {
  sessionTimeout: '',
  passwordExpiry: '',
  currentPassword: '',
  changePassword: '',
  minimumPasswordLength: '',
  confirmPassword: '',
};

function SettingField({ label, children, className = '' }) {
  return (
    <label className={`${styles.field}${className ? ` ${className}` : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function SelectField({ label, options, value, onChange, placeholder, className = '' }) {
  return (
    <SettingField label={label} className={className}>
      <select value={value} onChange={onChange}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </SettingField>
  );
}

function ToggleField({ label, description, checked, onChange, Icon, name }) {
  return (
    <label className={styles.toggleField}>
      {Icon && <Icon className={styles.notificationIcon} size={19} aria-hidden="true" />}
      <span className={styles.toggleCopy}>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <span className={styles.toggle}>
        <input name={name} type="checkbox" checked={checked} onChange={onChange} />
        <span aria-hidden="true" />
      </span>
    </label>
  );
}

function FormActions({ onReset }) {
  return (
    <div className={styles.formActions}>
      <button className={styles.secondaryButton} type="button" onClick={onReset}>Reset</button>
      <button className={styles.primaryButton} type="submit">Save Changes</button>
    </div>
  );
}

function Settings() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [profile, setProfile] = useState(initialProfile);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [notifications, setNotifications] = useState(initialNotifications);
  const [security, setSecurity] = useState(initialSecurity);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [status, setStatus] = useState('');
  const restoreInput = useRef(null);
  const photoInput = useRef(null);

  useEffect(() => () => {
    if (profilePhoto) URL.revokeObjectURL(profilePhoto);
  }, [profilePhoto]);

  const updateValue = (setValues) => (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const saveChanges = () => setStatus('Settings saved successfully.');
  const resetValues = (setValues, initialValues) => {
    setValues(initialValues);
    setStatus('Settings reset.');
  };

  const downloadJson = (filename, data) => {
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const settingsBackup = () => ({ preferences, profile, notifications, security });
  const createBackup = () => {
    downloadJson('teacher-settings-backup.json', settingsBackup());
    setStatus('Settings backup downloaded.');
  };
  const exportData = () => {
    downloadJson('teacher-settings-export.json', settingsBackup());
    setStatus('Settings data exported.');
  };

  const restoreData = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const backup = JSON.parse(await file.text());
      if (!backup || typeof backup !== 'object' || Array.isArray(backup)) {
        throw new Error('The selected file does not contain a valid settings backup.');
      }

      if (backup.preferences) setPreferences({ ...initialPreferences, ...backup.preferences });
      if (backup.profile) setProfile({ ...initialProfile, ...backup.profile });
      if (backup.notifications) setNotifications({ ...initialNotifications, ...backup.notifications });
      if (backup.security) setSecurity({ ...initialSecurity, ...backup.security });
      setStatus('Settings restored successfully.');
    } catch (error) {
      setStatus(`Unable to restore settings: ${error.message}`);
    }
  };

  const resetProfile = () => {
    setProfile(initialProfile);
    setProfilePhoto('');
    setStatus('Settings reset.');
  };

  const chooseProfilePhoto = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatus('Choose an image file for the profile photo.');
      return;
    }
    setProfilePhoto(URL.createObjectURL(file));
    setStatus('Profile photo selected.');
  };

  const resetPreferences = () => resetValues(setPreferences, initialPreferences);
  const resetNotifications = () => resetValues(setNotifications, initialNotifications);
  const resetSecurity = () => {
    setSecurity(initialSecurity);
    setVisiblePasswords({});
    setStatus('Settings reset.');
  };
  const renderPreferences = () => (
    <form className={`${styles.form} ${styles.preferencesForm}`} onSubmit={(event) => { event.preventDefault(); saveChanges(); }}>
      <div className={`${styles.fieldGrid} ${styles.preferencesGrid}`}>
        <SelectField
          label="Language"
          placeholder="Select language"
          options={['English', 'Hindi', 'Spanish']}
          value={preferences.language}
          onChange={(event) => setPreferences((current) => ({ ...current, language: event.target.value }))}
        />
        <SelectField
          label="Time zone"
          placeholder="Select time zone"
          options={['Asia/Kolkata', 'UTC', 'America/New_York']}
          value={preferences.timeZone}
          onChange={(event) => setPreferences((current) => ({ ...current, timeZone: event.target.value }))}
        />
        <SelectField
          label="Date format"
          placeholder="Select date format"
          options={['DD MMM YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']}
          value={preferences.dateFormat}
          onChange={(event) => setPreferences((current) => ({ ...current, dateFormat: event.target.value }))}
        />
        <SelectField
          label="Time format"
          placeholder="Select time format"
          options={['12 hour', '24 hour']}
          value={preferences.timeFormat}
          onChange={(event) => setPreferences((current) => ({ ...current, timeFormat: event.target.value }))}
        />
        <SelectField
          label="Currency"
          options={['INR', 'USD', 'EUR', 'GBP']}
          value={preferences.currency}
          onChange={(event) => setPreferences((current) => ({ ...current, currency: event.target.value }))}
        />
        <div className={styles.modeField}>
          <span>Mode</span>
          <div className={styles.modeOptions} role="group" aria-label="Mode">
            {['Dark', 'Light'].map((mode) => (
              <button
                className={`${styles.modeButton}${preferences.mode === mode ? ` ${styles.selectedMode}` : ''}`}
                key={mode}
                type="button"
                aria-pressed={preferences.mode === mode}
                onClick={() => setPreferences((current) => ({ ...current, mode }))}
              >
                <span className={`${styles.modeIndicator}${mode === 'Dark' ? ` ${styles.darkIndicator}` : ''}`} aria-hidden="true" />
                {mode} Mode
              </button>
            ))}
          </div>
        </div>
      </div>
      <FormActions onReset={resetPreferences} />
    </form>
  );

  const renderProfile = () => (
    <form className={`${styles.form} ${styles.profileForm}`} onSubmit={(event) => { event.preventDefault(); saveChanges(); }}>
      <div className={styles.photoControls}>
        <button
          className={`${styles.profilePhoto}${profilePhoto ? ` ${styles.hasPhoto}` : ''}`}
          type="button"
          aria-label="Upload profile photo"
          onClick={() => photoInput.current?.click()}
        >
          {profilePhoto && <img src={profilePhoto} alt="" />}
        </button>
        <div className={styles.photoActions}>
          <button className={styles.primaryButton} type="button" onClick={() => photoInput.current?.click()}>Upload Photo</button>
          <button className={styles.primaryButton} type="button" onClick={() => setProfilePhoto('')}>Remove Photo</button>
        </div>
        <input
          ref={photoInput}
          className={styles.fileInput}
          type="file"
          accept="image/*"
          aria-label="Choose profile photo"
          onChange={chooseProfilePhoto}
        />
      </div>
      <div className={`${styles.fieldGrid} ${styles.profileGrid}`}>
        <SettingField label="Full name">
          <input name="fullName" placeholder="Enter name" value={profile.fullName} onChange={updateValue(setProfile)} />
        </SettingField>
        <SettingField label="Email Address">
          <input name="email" type="email" placeholder="Enter email ID" value={profile.email} onChange={updateValue(setProfile)} />
        </SettingField>
        <SettingField label="Phone number">
          <input name="phone" type="tel" placeholder="Enter phone number" value={profile.phone} onChange={updateValue(setProfile)} />
        </SettingField>
        <SettingField label="School Name">
          <input name="schoolName" placeholder="Enter your school name" value={profile.schoolName} onChange={updateValue(setProfile)} />
        </SettingField>
        <SettingField label="Address line 1*">
          <input name="addressLine1" placeholder="House No, Street" value={profile.addressLine1} onChange={updateValue(setProfile)} />
        </SettingField>
        <SettingField label="Address line 2*">
          <input name="addressLine2" placeholder="Locality, Landmark" value={profile.addressLine2} onChange={updateValue(setProfile)} />
        </SettingField>
        <SettingField label="City*">
          <input name="city" placeholder="Enter city" value={profile.city} onChange={updateValue(setProfile)} />
        </SettingField>
        <SettingField label="State*">
          <input name="state" placeholder="Enter state" value={profile.state} onChange={updateValue(setProfile)} />
        </SettingField>
        <SettingField label="Pincode*">
          <input name="pincode" inputMode="numeric" placeholder="Enter pincode" value={profile.pincode} onChange={updateValue(setProfile)} />
        </SettingField>
        <SettingField label="Country*">
          <input name="country" placeholder="Enter country" value={profile.country} onChange={updateValue(setProfile)} />
        </SettingField>
      </div>
      <FormActions onReset={resetProfile} />
    </form>
  );

  const renderNotifications = () => (
    <form className={`${styles.form} ${styles.notificationsForm}`} onSubmit={(event) => { event.preventDefault(); saveChanges(); }}>
      <div className={styles.notificationList}>
        <ToggleField
          label="Email Notifications"
          description="Receive important updates via email"
          Icon={MessageCircle}
          checked={notifications.email}
          onChange={updateValue(setNotifications)}
          name="email"
        />
        <ToggleField
          label="SMS Notifications"
          description="Receive important updates via SMS"
          Icon={Smartphone}
          checked={notifications.sms}
          onChange={updateValue(setNotifications)}
          name="sms"
        />
        <ToggleField
          label="Push Notifications"
          description="Receive notifications on your device"
          Icon={Bell}
          checked={notifications.push}
          onChange={updateValue(setNotifications)}
          name="push"
        />
      </div>
      <FormActions onReset={resetNotifications} />
    </form>
  );

  const renderSecurity = () => (
    <form className={`${styles.form} ${styles.securityForm}`} onSubmit={(event) => { event.preventDefault(); saveChanges(); }}>
      <div className={`${styles.fieldGrid} ${styles.securityGrid}`}>
        <SelectField
          label="Session timeout"
          placeholder="Set time"
          options={['15 minutes', '30 minutes', '1 hour']}
          value={security.sessionTimeout}
          onChange={(event) => setSecurity((current) => ({ ...current, sessionTimeout: event.target.value }))}
        />
        <SelectField
          label="Password Expiry"
          placeholder="Select days"
          options={['30 days', '60 days', '90 days', 'Never']}
          value={security.passwordExpiry}
          onChange={(event) => setSecurity((current) => ({ ...current, passwordExpiry: event.target.value }))}
        />
        {[
          ['currentPassword', 'Current Password', 'Type password'],
          ['changePassword', 'Change Password', 'Type new password'],
        ].map(([name, label, placeholder]) => {
          return (
            <div className={styles.field} key={name}>
              <label htmlFor={`settings-${name}`}>{label}</label>
              <span className={styles.passwordInput}>
                <input
                  id={`settings-${name}`}
                  name={name}
                  type={visiblePasswords[name] ? 'text' : 'password'}
                  placeholder={placeholder}
                  value={security[name]}
                  onChange={updateValue(setSecurity)}
                />
                <button
                  type="button"
                  aria-label={`${visiblePasswords[name] ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
                  onClick={() => setVisiblePasswords((current) => ({ ...current, [name]: !current[name] }))}
                >
                  {visiblePasswords[name] ? (
                    <Eye className={styles.passwordIcon} size={18} aria-hidden="true" />
                  ) : (
                    <svg className={styles.passwordIcon} width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M23.2715 8.40371C22.3688 6.92544 21.23 5.60497 19.9005 4.49471L22.7005 1.69471C22.8827 1.50611 22.9835 1.25351 22.9812 0.991311C22.9789 0.729114 22.8738 0.478301 22.6884 0.292893C22.503 0.107485 22.2521 0.00231622 21.9899 3.78026e-05C21.7277 -0.00224062 21.4751 0.0985538 21.2865 0.280712L18.2415 3.32971C16.3539 2.20853 14.196 1.62418 12.0005 1.63971C5.80954 1.63971 2.28154 5.87771 0.72954 8.40371C0.250068 9.17922 -0.00390625 10.073 -0.00390625 10.9847C-0.00390625 11.8965 0.250068 12.7902 0.72954 13.5657C1.6323 15.044 2.77103 16.3645 4.10054 17.4747L1.30054 20.2747C1.20503 20.367 1.12885 20.4773 1.07644 20.5993C1.02403 20.7213 0.996443 20.8525 0.995289 20.9853C0.994135 21.1181 1.01944 21.2498 1.06972 21.3727C1.12 21.4956 1.19425 21.6072 1.28814 21.7011C1.38204 21.795 1.49369 21.8693 1.61659 21.9195C1.73948 21.9698 1.87116 21.9951 2.00394 21.994C2.13672 21.9928 2.26794 21.9652 2.38994 21.9128C2.51195 21.8604 2.62229 21.7842 2.71454 21.6887L5.76654 18.6367C7.65181 19.7577 9.80721 20.3431 12.0005 20.3297C18.1915 20.3297 21.7195 16.0917 23.2715 13.5657C23.751 12.7902 24.005 11.8965 24.005 10.9847C24.005 10.073 23.751 9.17922 23.2715 8.40371V8.40371ZM2.43354 12.5187C2.14867 12.0578 1.99779 11.5266 1.99779 10.9847C1.99779 10.4428 2.14867 9.91167 2.43354 9.45071C3.76754 7.28471 6.78254 3.63971 12.0005 3.63971C13.6608 3.63041 15.2978 4.03055 16.7665 4.80471L14.7535 6.81771C13.7935 6.18031 12.6424 5.89471 11.4958 6.00936C10.3491 6.12401 9.27741 6.63185 8.46254 7.44671C7.64768 8.26158 7.13983 9.33327 7.02519 10.4799C6.91054 11.6266 7.19614 12.7776 7.83354 13.7377L5.52354 16.0477C4.29864 15.0574 3.25338 13.8637 2.43354 12.5187V12.5187ZM15.0005 10.9847C15.0005 11.7804 14.6845 12.5434 14.1219 13.106C13.5593 13.6686 12.7962 13.9847 12.0005 13.9847C11.5551 13.983 11.1157 13.8804 10.7155 13.6847L14.7005 9.69971C14.8963 10.0999 14.9988 10.5392 15.0005 10.9847V10.9847ZM9.00054 10.9847C9.00054 10.1891 9.31661 9.426 9.87922 8.86339C10.4418 8.30078 11.2049 7.98471 12.0005 7.98471C12.446 7.98644 12.8853 8.089 13.2855 8.28471L9.30054 12.2697C9.10483 11.8695 9.00226 11.4302 9.00054 10.9847V10.9847ZM21.5675 12.5187C20.2335 14.6847 17.2185 18.3297 12.0005 18.3297C10.3403 18.339 8.7033 17.9389 7.23454 17.1647L9.24754 15.1517C10.2076 15.7891 11.3586 16.0747 12.5053 15.9601C13.652 15.8454 14.7237 15.3376 15.5385 14.5227C16.3534 13.7078 16.8612 12.6362 16.9759 11.4895C17.0905 10.3428 16.8049 9.19178 16.1675 8.23171L18.4775 5.92171C19.7024 6.91199 20.7477 8.10576 21.5675 9.45071C21.8524 9.91167 22.0033 10.4428 22.0033 10.9847C22.0033 11.5266 21.8524 12.0578 21.5675 12.5187V12.5187Z" fill="#6B7280"/>
                    </svg>
                  )}
                </button>
              </span>
            </div>
          );
        })}
        <SelectField
          label="Minimum Password Length"
          placeholder="Set password length"
          options={['8 characters', '10 characters', '12 characters']}
          value={security.minimumPasswordLength}
          onChange={(event) => setSecurity((current) => ({ ...current, minimumPasswordLength: event.target.value }))}
        />
        <SettingField label="Confirm Password">
          <input
            name="confirmPassword"
            type={visiblePasswords.confirmPassword ? 'text' : 'password'}
            placeholder="Rewrite the password"
            value={security.confirmPassword}
            onChange={updateValue(setSecurity)}
          />
        </SettingField>
      </div>
      <FormActions onReset={resetSecurity} />
    </form>
  );

  const renderDataManagement = () => (
    <div className={styles.dataCards}>
      {[
        {
          title: 'Backup Database',
          description: 'Create a backup of your database',
          detail: 'Last Backup: 25 Jun 2025, 02:30 AM',
          action: 'Backup Now',
          Icon: Database,
          onClick: createBackup,
        },
        {
          title: 'Restore Database',
          description: 'Restore from a previous backup',
          detail: 'Last Backup: 25 Jun 2025, 02:30 AM',
          action: 'Restore',
          Icon: Server,
          onClick: () => restoreInput.current?.click(),
        },
        {
          title: 'Export Data',
          description: 'Export data in different formats',
          detail: 'Formats: PDF, Excel, CSV',
          action: 'Export',
          Icon: FileDown,
          onClick: exportData,
        },
      ].map(({ title, description, detail, action, Icon, onClick }) => (
        <article className={styles.dataCard} key={title}>
          <Icon aria-hidden="true" size={38} />
          <h3>{title}</h3>
          <p>{description}</p>
          <span>{detail}</span>
          <button className={styles.actionButton} type="button" onClick={onClick}>{action}</button>
        </article>
      ))}
      <input
        ref={restoreInput}
        className={styles.fileInput}
        type="file"
        accept=".json,application/json"
        aria-label="Select settings backup file"
        onChange={restoreData}
      />
    </div>
  );

  const content = {
    Preferences: {
      description: 'Customize the general appearance and preferences',
      render: renderPreferences,
    },
    Profile: {
      description: 'Update your personal information and profile photo',
      render: renderProfile,
    },
    Notifications: {
      description: 'Manage how you receive notifications',
      render: renderNotifications,
    },
    Security: {
      description: 'Manage your security preferences',
      render: renderSecurity,
    },
    'Data Management': {
      description: 'Manage your data and backups',
      render: renderDataManagement,
    },
  }[activeTab];

  return (
    <main className={styles.settingsPage}>
      <nav className={styles.tabs} role="tablist" aria-label="Settings">
        {tabs.map((tab) => (
          <button
            className={`${styles.tab}${activeTab === tab ? ` ${styles.activeTab}` : ''}`}
            id={`settings-tab-${tab.toLowerCase().replace(/\s/g, '-')}`}
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls="settings-panel"
            onClick={() => {
              setActiveTab(tab);
              setStatus('');
            }}
          >
            {tab}
          </button>
        ))}
      </nav>
      <section
        className={styles.panel}
        id="settings-panel"
        role="tabpanel"
        aria-labelledby={`settings-tab-${activeTab.toLowerCase().replace(/\s/g, '-')}`}
      >
        <header className={styles.panelHeading}>
          <h2>{activeTab}</h2>
          <p>{content.description}</p>
        </header>
        {content.render()}
        {status && <p className={styles.status} role="status">{status}</p>}
      </section>
    </main>
  );
}

export default Settings;
