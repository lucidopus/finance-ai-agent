# A Detailed Operational Workflow of the Bank KYC Process

## 1. Introduction

Know Your Customer (KYC) is a mandatory regulatory framework that financial institutions (FIs) must follow. It is not a single action but a continuous, multi-stage process designed to prevent the financial system from being used for money laundering, terrorist financing, and other illicit activities. This document outlines the detailed, operational steps a bank takes to comply with its KYC obligations.

## 2. The Three Pillars of the KYC Framework

The entire KYC process is built on three core pillars that define the lifecycle of a customer relationship:

1.  **Customer Identification Program (CIP):** Establishing the true identity of the customer.
2.  **Customer Due Diligence (CDD):** Understanding the customer's profile and assessing the risks associated with them.
3.  **Ongoing Monitoring:** Continuously observing the customer's activity to ensure it remains consistent with their known profile.

## 3. Detailed Operational Steps of the KYC Process

Here is the granular, step-by-step workflow that occurs within a bank's compliance and operations departments.

---

### **Step 1: Customer Application and Document Collection**

This is the entry point of the KYC process, typically initiated when a prospective customer applies to open an account.

*   **Action:** The bank's front-office staff or digital onboarding portal collects specific identifying information and documentation.
*   **For Individuals:** This includes full legal name, date of birth, residential address, and a unique identification number (e.g., Social Security Number, Passport Number).
*   **For Corporate Entities:** The requirements are more complex and include the legal name, business address, tax identification number, articles of incorporation, and, crucially, **beneficial ownership information**—identifying the real individuals who own or control the company.
*   **Documentation:** The bank obtains copies of government-issued photo IDs, proof of address (like a utility bill), and relevant business documents.

---

### **Step 2: Identity Verification and Initial Screening**

Once the information is collected, it must be independently verified and screened.

*   **Action:** The bank uses a combination of internal systems and third-party data providers to validate the customer's identity. This is not just a visual check; it's a data-driven process.
*   **Verification:** Systems check if the provided ID document is valid and not forged. The name, address, and other details are cross-referenced against public and private databases (e.g., credit bureaus, government records).
*   **Screening:** The customer's name and details are screened against a series of critical watchlists:
    *   **Sanctions Lists (e.g., OFAC, UN, EU):** To ensure the individual or entity is not a sanctioned party with whom the bank is legally forbidden to do business.
    *   **Politically Exposed Persons (PEP) Lists:** To identify individuals holding prominent public functions who may present a higher risk for bribery and corruption.
    *   **Internal Blacklists:** The bank's own list of former customers or individuals deemed too high-risk from past experiences.
    *   **Adverse Media:** Automated searches are run to find credible negative news reports linking the customer to criminal activities.

---

### **Step 3: Customer Risk Profiling**

After initial verification, the bank synthesizes all available information to assign a risk rating.

*   **Action:** An automated risk engine or a compliance analyst calculates a risk score based on a predefined methodology.
*   **Risk Factors Considered:**
    *   **Geographic Risk:** The customer's country of citizenship, residence, and business operations.
    *   **Customer Risk:** Their occupation or industry (e.g., a casino or precious metals dealer is higher risk than a salaried employee). PEP status automatically results in a high-risk rating.
    *   **Product/Service Risk:** The types of products the customer intends to use (e.g., a private banking account with international wire capabilities is higher risk than a simple domestic checking account).
*   **Output:** The customer is assigned a risk category, most commonly **Low, Medium, or High**.

---

### **Step 4: Performing Due Diligence**

The risk rating from Step 3 dictates the required level of scrutiny.

*   **Action:** A compliance analyst reviews the customer file.
*   **Simplified Due Diligence (SDD):** For low-risk customers, the automated verification in Step 2 is often sufficient.
*   **Customer Due Diligence (CDD):** For medium-risk customers, a standard review is performed to ensure the customer's profile makes sense.
*   **Enhanced Due Diligence (EDD):** For all high-risk customers (including all PEPs), a rigorous investigation is required. This involves:
    *   Obtaining and verifying documents related to the customer's **Source of Wealth** and **Source of Funds** (e.g., financial statements, pay stubs, contracts).
    *   Developing a deeper understanding of the purpose of the account and expected transaction patterns.
    *   Requiring approval from senior management to onboard the customer. If the risk cannot be mitigated, the bank will decline the relationship.

---

### **Step 5: Transaction Monitoring**

Once an account is approved and activated, it enters the continuous "Ongoing Monitoring" phase.

*   **Action:** Every single transaction is processed through the bank's Anti-Money Laundering (AML) monitoring system.
*   **Methodology:** The system uses a combination of:
    *   **Rules-Based Scenarios:** These flag specific, well-known red flags (e.g., cash deposits just under the $10,000 reporting threshold, transactions involving high-risk jurisdictions).
    *   **Behavioral/Anomalous Monitoring:** The system establishes a baseline of normal behavior for each customer. It then flags any activity that deviates significantly from this baseline (e.g., a sudden spike in transaction volume, a change in transaction patterns).

---

### **Step 6: Alert Generation and Investigation**

When the monitoring system flags a transaction, it generates an "alert."

*   **Action:** The alert is assigned to a compliance analyst in a work queue.
*   **Investigation Process:** The analyst's job is to determine if the alert represents genuinely suspicious activity or if it is a "false positive" with a logical explanation. This involves:
    *   Reviewing the customer's KYC profile and risk rating.
    *   Analyzing their historical transaction activity.
    *   Sometimes, contacting the customer through the relationship manager to inquire about the transaction's purpose.

---

### **Step 7: Case Management and Regulatory Reporting**

If an analyst cannot dismiss an alert as a false positive, it is escalated into a "case."

*   **Action:** A deeper investigation is conducted, and all findings are meticulously documented in a case file.
*   **Outcome:** If the investigation concludes that there is a reasonable suspicion of illicit activity, the bank is legally obligated to file a **Suspicious Activity Report (SAR)** with its jurisdiction's Financial Intelligence Unit (e.g., FinCEN in the United States).
*   **Confidentiality:** This filing is strictly confidential. The bank is legally prohibited from informing the customer that they have been named in a SAR. The report is then used by law enforcement to analyze and investigate potential crimes.