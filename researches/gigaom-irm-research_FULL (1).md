# GigaOm Radar for Insider Risk Management


## Executive Summary

Insider risk management (IRM) involves identifying, assessing, and mitigating potential threats posed by individuals within an organization, such as employees, contractors, vendors, or partners who have authorized access to systems and data. These insiders may misuse their access, either intentionally or unintentionally, causing harm to the organization, its customers, or other stakeholders. Such harm can take the form of data theft, confidentiality breaches, insider trading, fraud, or regulatory violations. If left unaddressed, insider risks can lead to serious consequences, including operational disruption, financial loss, reputational damage, and regulatory penalties.

An effective insider risk management program should be a priority for any organization, but success depends on more than just deploying the right technology. It requires a foundation of clear policies, procedures, and controls to prevent, detect, and respond to insider incidents. Equally important is fostering a culture of trust and accountability, in which individuals understand their responsibilities and the consequences of misconduct. Crucially, this is not solely an IT responsibility. Insider risk management is a collaborative effort across departments, including human resources (HR), legal, security, IT, and compliance.

That said, technology plays an essential role. Todayâs insider threats are too complex to manage through policy and manual oversight alone. This has led to the emergence of dedicated insider risk management solutions that integrate technologies such as asset discovery, user behavior analytics, and data loss prevention. These are supported by capabilities like real-time alerting, reporting, and case management. As threats evolve, particularly with the rapid adoption of AI and generative AI (GenAI) tools, vendors are increasingly focused on adapting solutions to meet these emerging challenges.

This report focuses on the technologies that provide visibility into insider risk by monitoring user activity across digital environments. These tools collect and correlate behavioral signals to detect threats, support investigations, and enable enforcement actions to protect critical assets.

Ultimately, insider risk management is essential for protecting an organizationâs reputation, operations, and competitive advantage. It helps ensure regulatory compliance, strengthens security posture, reduces operational costs, and supports customer trust. Whether the threat stems from malicious intent or inadvertent behavior, insider risk is significant and must be proactively addressed.

This is our second year evaluating the insider risk management space in the context of our Key Criteria and Radar reports. This report builds on our previous analysis and considers how the market has evolved over the last year.

This GigaOm Radar report examines 16 of the top insider risk management solutions and compares offerings against the capabilities (table stakes, key features, and emerging features) and nonfunctional requirements (business criteria) outlined in the companion Key Criteria report. Together, these reports provide an overview of the market, identify leading insider risk management offerings, and help decision-makers evaluate these solutions so they can make a more informed investment decision.

#### GIGAOM KEY CRITERIA AND RADAR REPORTS

The GigaOm Key Criteria report provides a detailed decision framework for IT and executive leadership assessing enterprise technologies. Each report defines relevant functional and nonfunctional aspects of solutions in a sector. The Key Criteria report informs the GigaOm Radar report, which provides a forward-looking assessment of vendor solutions in the sector. 


## Market Categories and Deployment Types

To help prospective customers find the best fit for their use case and business requirements, we assess how well insider risk management solutions are designed to serve specific target markets and deployment models (**Table 1**).

For this report, we recognize the following market segments:

- **Small to medium-sized business (SMB):** In this category, we assess solutions based on their ability to meet the needs of organizations ranging from small businesses to medium-sized companies. Here, ease of use and deployment are more critical than extensive management functionality and feature set.
- **Large enterprise:** Here, offerings are assessed on their ability to support large and business-critical projects. Optimal solutions in this category place a strong emphasis on flexibility, performance, scalability, and seamless integration into existing environments.
- **Public sector**: While the infrastructure of these environments is likely to be similar to that of SMBs and enterprises, these organizations typically have some constraints, especially around needing suppliers to meet specific requirements laid out in buying and supply frameworks. Solutions must therefore be able to meet such framework demands.
- **Managed service provider (MSP): **Service providers seek core enterprise functionality that supports reselling isolated, rebrandable instances to their customers. Centralized management is crucial, primarily for creating and removing customer accounts efficiently.

In addition, we recognize the following deployment models:

- **SaaS:** These solutions exist only in the cloud and are managed by the service provider. Their advantages include simplicity, rapid scaling, and flexible licensing. Although some components, such as agents, may require physical installation, for the purposes of this report, a SaaS solution is defined as one from which central management and intelligence features are available as a service.Â
- **Self-hosted - on-premises:** With this model, the central management and intelligence elements are fully installable on-premises, in either the customerâs data center or a colocation facility. They are not shared and are specific to a single customer.
- **Self-hosted - cloud:** With these solutions, the central management and intelligence elements are installed on cloud-based machines within a customer's cloud tenancy. The solutions are not shared and are specific to a single customer.Â
- **Managed service: **In this model, the vendor oversees all management and operations, typically managing everything directly rather than through one of its partners. However, for this report, co-managing, by which operations are shared between the provider and the customer, is also acceptable.

*Table 1. Vendor Positioning: Target Market and Deployment Model*



**Table 1** components are evaluated in a binary yes/no manner and do not factor into a vendorâs designation as a Leader, Challenger, or Entrant on the Radar chart (**Figure 1**).Â 

âTarget marketâ** **reflects which use cases each solution is recommended for, not simply whether that group can use it. For example, if an SMB could use a solution but doing so would be cost-prohibitive, that solution would be rated ânoâ for SMBs.


## Decision Criteria Comparison

All solutions included in this Radar report meet the following table stakesâcapabilities widely adopted and well implemented in the sector:

- Enterprise data integration
- Asset discovery
- Basic risk policy
- Risk alerting
- Risk investigation

**Tables 2, 3, and 4** summarize how each vendor in this research performs in the areas we consider differentiating and critical in this sector. The objective is to provide the reader with a snapshot of the technical capabilities of available solutions, define the scope of the relevant market space, and assess the potential impact on the business.

- Key features differentiate solutions, highlighting the primary criteria to be considered when evaluating an insider risk management solution.
- Emerging features show how well each vendor implements capabilities that are not yet mainstream but are expected to become more widespread and compelling within the next 12 to 18 months.Â
- Business criteria provide insight into the nonfunctional requirements that factor into a purchase decision and determine a solutionâs impact on an organization.

These decision criteria are summarized below. More detailed descriptions can be found in the corresponding report, âGigaOm Key Criteria for Evaluating Insider Risk Management Solutions.â

### Key Features

- **Risk source integration: **Insider risk identification is most effective when a wide range of telemetry can be collected from various tools, including user directories, endpoints, SaaS applications, networks, and cloud infrastructure. Telemetry from non-technically focused systems such as HR and case management platforms can further enhance this identification.Â
- **User education: **Proactive user education significantly reduces the threat of risky actions. Top-tier solutions offer a spectrum of approaches, ranging from immediate notifications to comprehensive, targeted educational initiatives.
- **Data loss prevention (DLP):** Since data is the primary target for cyber attackers, tools that both identify risky internal behaviors and block attacks on valuable data provide significant customer value.
- **Collaborative case management: **Comprehensive risk management begins with identifying potential threats and extends to rigorous investigation by operational security teams. However, true effectiveness is achieved when platforms seamlessly enable security teams to collaborate with all relevant stakeholders, transforming investigations into a shared, more impactful effort.
- **User behavior analytics: **Managing insider risk centers on identifying high-risk actions from within. Therefore, valuable solutions will be those that can learn individual user behavior, create a baseline of normal activity, and proactively detect deviations that signal a potential threat.Â
- **Response automation: **Rapid response to risk is crucial. That's why platforms with automated response capabilities are valuable. Even better are solutions that enable complex, integrated responses, allowing seamless interaction with other platforms for immediate threat management and effortless integration of insider risk activities into existing workflows.Â
- **Compliance reporting: **Failing to meet compliance requirements poses a significant risk to organizations, potentially leading to considerable challenges and severe business impacts. Therefore, platforms that actively guide customers toward continuous compliance will be highly valuable.Â
- **Enterprise security stack integration: **Insider risk management solutions should be able to integrate into an enterprise's existing security infrastructure, leveraging current tools such as XDR, EDR, SIEM, SOAR, and ITSM. Such integrations not only help facilitate adoption but also make the tools a core part of an organizationâs security, ensuring they are incorporated into the daily security workflow.

*Table 2. Key Features ComparisonÂ *



### Emerging Features

- **Operational AI agent/copilot: **While AI/ML and analytics already enhance accuracy behind the scenes, copilot-type technology such as AI-powered assistants that can interact with users, offers even greater value by guiding operations staff through tasks, automating routine actions, and streamlining workflows, allowing them to identify and stop threats more effectively.
- **GenAI risk detection: **The growing use of GenAI tools increases the potential for insider risks, such as users sharing sensitive data with public AI tools and internal AI agents accessing confidential data sets. This creates threats to data privacy and intellectual property. Insider risk management tools can help reduce these threats and encourage safe GenAI use.Â
- **Non-technical risk assessment: **The evaluation of insider risk cannot solely rely on a user's technical interactions. Tools that incorporate non-IT metrics such as job status, internal discipline information, and communication sentiment analysis can all contribute to creating a more contextual and accurate risk assessment.

*Table 3. Emerging Features ComparisonÂ *



### Business Criteria

- **Ease of use: **Driving effective adoption is essential to the success of any IT projectâand ease of use plays a key role. Solutions that are intuitive, easy to learn, and fit naturally into existing workflows are far more likely to be embraced by users. Seamless integration with current platforms and minimal disruption to day-to-day tasks help reduce resistance and accelerate adoption. Just as important, vendors who prioritize usability and offer straightforward implementation and support make it easier for organizations to get up and running quickly. When a platform feels effortless to use, adoption follows.
- **Ease of management: **The insider risk threat is complex, and any solution aimed at reducing the risk should not introduce additional complexity. Businesses will value tools that simplify management, provide centralized administration and reporting, and automate repetitive tasks. Vendors that can offer broad coverage and assist with compliance requirements will also be beneficial. Beyond technology, vendors that offer services such as support, training, and proactive account management will help lessen the overall management burden of a solution.
- **Flexibility: **Customer environments are constantly changing and evolving over time. Insider risk management tools must be adaptable, offering various deployment options and adoption methods, along with commercial flexibility to cater to a wide range of customer needs.Â
- **Cost: **Businesses need a clear understanding of the full cost of any potential technology investmentânot just the license price, but also adoption, implementation, and ongoing operational expenses. Transparency in pricing and terms is essential. Vendors who clearly communicate licensing details make it easier for customers to evaluate total cost and plan effectively. Leading solutions further support adoption by offering practical guidance and readily accessible information, helping users deploy and start realizing value more quickly.Â
- **Ecosystem: **Many insider risk management vendors provide additional value, offering management tools, reporting platforms, and threat analysis capabilities. Many also support customers with non-technical resources such as educational events and professional services. When evaluating solutions, organizations should also consider the variety of partners within the vendorâs broader ecosystem, which can further enhance flexibility, support, and long-term success.

*Table 4. Business Criteria Comparison *




## GigaOm Radar

The GigaOm Radar plots vendor solutions across a series of concentric rings, with those set closer to the center being judged to have higher overall value. The chart characterizes each vendor on two axesâbalancing Maturity versus Innovation and Feature Play versus Platform Playâwhile providing an arrowhead that projects each solutionâs evolution over the coming 12 to 18 months.



*Figure 1. GigaOm Radar for Insider Risk Management*

Insider risk management solutions continue to evolve to address the changing threat landscape. However, the field also continues to mature, as shown by the increased number of vendors in the Maturity half of the chart in **Figure 1**, with several that have moved up from the Innovation half since the previous report. Vendors have begun to settle on approaches, either using broad insider risk analytics platforms designed for security operations analysts or focusing on data and data-related activities to identify potential insider risks. This should help customers evaluate the space, as it suggests that vendors are less likely to make significant pivots in their approaches, thereby reducing the risks associated with substantial product changes, such as the need for increased training or redesigning workflows and response playbooks. The vendors in the Innovation hemisphere are those still aiming to drive change in their methods; even those with established platforms expect to continue making substantial changes as they seek to redefine approaches to IRM or acquire relevant technology.Â 

Vendors are distributed across the Feature Play and Platform Play hemispheres. Feature Play vendors are those that tend to have a specific focus on a particular market sector, typically reflected by vendors targeting the SMB space.Â 

The graphic shows an even split between Challengers and Leaders, demonstrating both a number of strong providers and several that, while competitive on some of our metrics, still have room to improve to better meet customer needs. Our research shows that many vendors, especially those noted as Outperformers, are actively evolving their products, with roadmaps focused on innovation and differentiated capabilities, including new patents.

Integrations are a key differentiator in this report, especially for solutions that can connect with a wide range of risk sources. The ability to ingest data from diverse systems is particularly valuable for insider risk management, as it allows vendors to deliver more comprehensive context, more accurate risk scoring, and improved threat identification, thereby improving accuracy and effectiveness. This advantage was especially clear among the Leaders in this report, many of whom earned high marks in behavioral analytics for leveraging their extensive telemetry to generate meaningful insights and accelerate the detection of user risk.Â 

Insider risk remains a significant threat to organizations and a complex technical challenge for vendors to address. However, this is an area of robust development, with many vendors continuing to improve their comprehensive solutions to help reduce the occurrence and effects of the problem. We expect this development to continue in the future.Â 

In reviewing solutions, itâs important to keep in mind that there are no universal âbestâ or âworstâ offerings; every solution has aspects that might make it a better or worse fit for specific customer requirements. Prospective customers should consider their current and future needs when comparing solutions and vendor roadmaps.

#### INSIDE THE GIGAOM RADAR

To create the GigaOm Radar graphic, key features, emerging features, and business criteria are scored and weighted. Key features and business criteria receive the highest weighting and have the most impact on vendor positioning on the Radar graphic. Emerging features receive a lower weighting and have a lower impact on vendor positioning on the Radar graphic. The resulting chart is a forward-looking perspective on all the vendors in this report, based on their productsâ technical capabilities and roadmaps.

Note that the Radar is technology-focused, and business considerations such as vendor market share, customer share, spend, recency or longevity in the market, and so on are not considered in our evaluations. As such, these factors do not impact scoring and positioning on the Radar graphic.

For more information, please visit our [Methodology](https://gigaom.com/kcr-methodology/steps/). 


## Solution Insights

### Bottomline: ITM â Insider Threat Management

**Solution Overview**
Bottomline is a leading provider of financial technology that makes complex business payments simple, innovative, and secure. Bottomlineâs ITM protects against insider risks in both financial and non-financial institutions, including government agencies.

Bottomline ITM has three main components: Record & Replay (R&R), Insider Threat Analytics, and Enterprise Case Management. Originally designed for financial institutions, the solution features detailed investigative tools that help identify insider risk and fraudulent activities. It collects data from network traffic and application logs, and monitors end-user activity via a Java plugin for modern browsers. Its patented non-invasive R&R captures user access through non-intrusive network sniffing and granular screen replay, supporting alert investigations without the need for intrusive endpoint agents, and delivers forensic-grade visual audit trails. Insider Threat Analytics profiles user behavior, detects anomalies, and issues real-time alerts on suspicious activity. The Enterprise Case Manager manages alerts and cases with queues, workflows, dashboards, link analysis, and letter generation, all through a single interface. The platform can be deployed in the cloud or on-premises.

The solution provides a detailed analysis tool that enables the complete replay of user sessions and comprehensive case management. It includes an extensive library of preconfigured risk scenarios, enabling users to assess risks quickly. Additionally, it offers the ability to create response workflows that can carry out specific mitigation actions, such as blocking users.

Bottomline offers a single platform that consists of distinct modules that can be purchased individually or bundled together, with continued development expected to be delivered within the platform.Â 

Bottomline is positioned as a Challenger and Fast Mover in the Maturity/Feature Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
Bottomline scored well on a number of decision criteria, including:

- **Collaborative case management:** The solution offers complete enterprise case management, with comprehensive capabilities that enable it to gather information from various sources that can be shared with others involved in the case, including suspects, victims, and law enforcement personnel.Â
- **User behavior analytics: **The solution provides comprehensive threat analytics using behavioral analytics and peer group analysis, which combine statistical profiling and business rules to detect both known and emerging threats before egress. This approach helps reduce false positives by focusing on intent detection, rather than just data exfiltration events. It includes over 120 preconfigured risk indicators, and new indicators can be added as needed.Â
- **Response automation:** The solution includes configurable workflows that can automatically take action when specific types of alerts are generated. Actions include sending an email, suspending user access, creating a ticket in the Bottomline ECM or in a third-party case manager, or raising a ticket in an external ITSM. The workflow function is fully configurable by users.

**Opportunities**
Bottomline has room for improvement in a few decision criteria, including:

- **Compliance reporting:** Although the solution provides valuable information for regulatory compliance, it lacks a compliance-focused approach. Adding a more compliance-centric dashboard and reporting feature would ease the compliance efforts of customers.
- **Data loss prevention:** Instead of blocking information when it leaves an organization, the solution monitors user activity when accessing sensitive data, adding an extra layer of protection by detecting suspicious behavior. The solution is designed to complement DLP rather than replace it and does not aim to compete against DLP vendors. However, customers seeking to consolidate their data security and insider risk capabilities would benefit from additional DLP controls being offered natively within the solution.Â
- **Enterprise security stack integration: **Increasingly, organizations are seeking to broaden the reach of their security tools, fostering a more unified security strategy. The solution provides integrations with SIEM and ITSM tools, but adding more prebuilt integrations would help customers do this.

**Purchase Considerations**
Licensing is subscription-based and is calculated on the number of monitored users. Pricing information can be received directly from the vendor or through local partners. For customers satisfied with the preconfigured rule sets, implementation should be straightforward. There will be some work involved in deploying Java plugins and integrating them with the network, but professional services are available for customers who need assistance.

This solution is designed for larger enterprises and may not be suitable for smaller businesses. There is no offering for MSPs.

**Use Cases**
Bottomline delivers a strong solution that supports a variety of use cases. For customers in the financial sector, its advanced capabilities in insider risk and fraud detection are especially compelling. Its ability to capture comprehensive, auditable recordings of user interactions across a wide range of applications makes it particularly well-suited for organizations that require detailed fraud investigations.

### Coro: Coro Complete

**Solution Overview**
Coro is a leading cybersecurity platform explicitly designed for SMBs. It provides comprehensive, modular security solutions that simplify cybersecurity management, enabling organizations to protect against a wide range of threats without requiring extensive IT resources. Each module is available as a standalone solution.

Coro Complete is a flexible SaaS platform that enables organizations to build security solutions tailored to their specific needs. It includes component modules for endpoint security, email security, cloud app security, network security, data security and governance, and security training that all work together to deliver a complete view of user and data activity. Designed for automated detection and response, the solution effectively supports smaller IT teams. The Coro Service, the core SaaS component of the platform, handles data management, analysis, reporting, and communication with endpoints and cloud applications via a secure web interface for setup and oversight. Telemetry is gathered through endpoint agents and API integrations with remote cloud and SaaS platforms, including Microsoft 365 and Google Workspace.

Once integrated into a customer environment, the solution combines telemetry to provide a detailed understanding of user behavior, including setting baselines and detecting anomalies. When anomalies are detected, it offers automated responses and real-time alerts, along with investigation tools like ticket management for quick security actions. Customers can create response playbooks that incorporate multiple actions. However, the platform has limited options for customizing or adding new mitigation steps, as the vendor prefers a fully automated system that reduces the need for IT professionals to craft tailored threat responses.

Coro's approach to product development emphasizes quick progress and maintaining a bold roadmap, focusing on delivering new features and capabilities. Customers can expect ongoing changes and improvements to the Coro platform, which may result in additional training needs or workflow adjustments.

Coro is positioned as a Challenger and Fast Mover alone in the Innovation/Feature Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
Coro scored well on a number of decision criteria, including:

- **Risk source integration:** The solution integrates with a wide range of telemetry sources, using multiple methods to achieve seamless integration, including its endpoint agent and prebuilt integrations with other products such as Microsoft 365. It effectively uses the information gathered to provide a comprehensive overview of user behavior, thereby enhancing its ability to identify risks.Â
- **User education: **The company recently introduced a formal awareness training feature to its platform. It offers both "nudge" tips and a comprehensive security awareness training module. What makes this stand out is that the module is fully dynamic, enabling targeted training based on the actual results from the risk telemetry in the platform. The solution can tailor training content based on user behavior and risk exposure, ensuring that the education provided is timely and relevant.Â
- **User behavior analytics:** The solution employs advanced behavioral analytics to track user activities across different functions, including file use, application access, and communication. It detects anomalies in user behavior that could signal potential insider threats. The system establishes a baseline of regular user activity and continuously monitors deviations from this baseline to spot possible risks.

**Opportunities**
Coro has room for improvement in a few decision criteria, including:

- **Response automation:** Coro offers a fully automated solution with limited options for customizing its responses. It does allow customers to create response playbooks; however, much of the system is designed to be invisible to the user. This is a design choice, not a limitation, but some customers, particularly those with exceptionally experienced IT teams, may want more configuration options and the ability to customize responses.
- **Collaborative case management:** The solution offers case management, but it provides only basic incident management. This involves reviewing open tickets and either assigning them for further review or closing them as resolved. Implementing more robust case management workflows and the ability to capture more details would make this more useful to users with more advanced case management needs.
- **Enterprise security stack integration:** The solution provides a number of prebuilt integrations with SIEM and PSA tools, and additional connections can be established via API and webhook. However, for enterprise users, having more prebuilt integrations and a broader library of tools would be advantageous.

**Purchase Considerations**
Coro's licensing is mainly per user, allowing installation on multiple devices (up to five) owned by that user without additional costs. Coro offers subscription-based licensing. The minimum commitment is flexible, enabling customers to add or remove users at any time without long-term contracts. Customers can view pricing details directly on the Coro website. Detailed pricing plans are available. For specific inquiries, customers can contact Coro's sales team or partners.

Coro's SaaS-based management platform, single-agent architecture, and modular approach simplify deployment. Customers should not need professional services. However, professional services are available if required, through Coro and its partners.

Coro targets organizations with no more than two full-time cybersecurity professionals on its IT team. Larger organizations are not a good fit for this vendor.

**Use Cases**
Coroâs fully automated and simplified approach can be highly valuable to the small teams in its target organizations. It also provides broad, user-centric controls, from comprehensive endpoint protection, email security, and phishing defense to basic data governance.

### Cyberhaven: Data Detection and Response (DDR)

**Solution Overview**
Cyberhaven combines insider risk management with DLP to safeguard sensitive data from insider threats, exfiltration, and misuse, helping organizations to identify, assess, and investigate risky users and their interactions with data.

Cyberhaven DDR is a SaaS platform that integrates with existing environments using an endpoint agent, cloud connectors, and a browser extension that covers both IRM and DLP use cases. It offers visibility into on-device data movement and interactions with cloud and web applications. Utilizing data lineage to trace sensitive data enables the real-time detection of policy violations, an understanding of contextual user behavior, and risk identification for both intentional and unintentional data issues. Users can set rules with a policy engine that provides detailed controls based on insider risk, such as high-risk users, including new hires or those who are leaving. Policies can be tested retrospectively against past actions and all can be managed through a single console.

The solution provides detailed incident insights, including the capture of screenshot data useful for investigations. Linea AI streamlines investigations and identifies risk trends, while Insights 360 provides a comprehensive overview of security posture, risks, and data flows.

Moreover, Cyberhaven also introduced Security for AI, which detects incidents when sensitive data is entered into or shared with AI tools like ChatGPT or Copilot and takes immediate actions such as blocking, alerting, or educating the user about the risk.

Cyberhaven is positioned as a Challenger and Fast Mover in the Maturity/Platform Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
Cyberhaven scored well on a number of decision criteria, including:

- **Risk source integration:** The solution provides broad integration across endpoints, SaaS, and cloud. It can also gather information from IDP and non-technical systems, such as HR, to help build a wide view of user context.
- **Collaborative case management:** The platform provides collaborative case management features that support comprehensive insider risk investigations, making it easy for non-technical investigators to understand the events leading up to a threat. Investigators receive details to aid their investigation, including related events, user activity, policy violations, data lineage, and contextual summaries generated by Linea AI. This gives them complete visibility into the userâs behavior and its impact on sensitive data.
- **User behavior analytics:** The solution emphasizes how users interact with data throughout its lifecycle and whether their actions create a risk to sensitive information. The platform constantly gathers telemetry from various sources, including endpoints, cloud applications, and identity systems, to build a detailed profile of each user, enabling it to identify subtle insider threats, such as a departing employee slowly exfiltrating files or a user misusing authorized access.Â

**Opportunities**
Cyberhaven has room for improvement in a few decision criteria, including:

- **User education:** The solution can alert end users with notifications and "nudgesâ to help address risky behavior. However, it does not offer formal training for users. Integrating a more formal training platform could help reduce risks when users perform non-malicious but potentially dangerous actions.
- **Response automation:** The platform triggers alerts internally and externally via email, SIEM, SOAR, or ticketing systems. Customers can create custom workflows with their visual policy editor. However, a native workflow engine that could enable SOAR-like orchestration would benefit users with complex automation needs.Â
- **Compliance reporting:** The solution enables users to build reporting and dashboard widgets for monitoring specific data types, including PII, PHI, and credit card data, and tracking their movement. However, it lacks a compliance-centric view. As regulatory compliance becomes increasingly central to cybersecurity, adding prebuilt dashboards for common frameworks would be beneficial.Â

**Purchase Considerations**
Cyberhaven licenses its product per endpoint. Licenses are subscription-based with a minimum commitment of 12 months. Pricing is available directly through Cyberhavenâs sales team or its partner channels.

The solution should not prove overly complex to deploy. However, if customers require additional support, Cyberhaven can provide professional services.Â  Â  Â  Â  Â  	

This solution is suitable for both SMBs and enterprises. It is worth noting that the vendor does not focus on the public sector or the MSP channel.Â 

**Use Cases**
Cyberhaven addresses several use cases, including tracking full data lineage to prevent insider data theft. It distinguishes corporate-originated content from personal or public files, enabling precise, real-time detection of risky behavior that traditional tools often miss. It also helps organizations proactively monitor and control data movement by employees who are preparing to leave or have already given notice. Additionally, it helps monitor and control the flow of sensitive data to and from AI tools, addressing the growing risks associated with malicious AI use.Â 

### DTEX: InTERCEPT

**Solution Overview**
DTEX, through its InTERCEPT platform, provides insider risk management for enterprises, the public sector, and other mature organizations that hold high-value intellectual property and data.

DTEX InTERCEPT is an insider risk management platform that combines DLP, UEBA, and user activity monitoring into a single solution. Available as a cloud service, on-premises, or hybrid, it uses lightweight forwarders and real-time data correlation to capture activity, behavior, and data use. This understanding helps identify insider risks, differentiating among careless, malicious, and compromised users. It employs Risk Adaptive Data Protection, including data classification, content inspection, and file lineage. User deterrents range from gentle reminders to comprehensive activity monitoring, with options for auditing and video capture when necessary. Managed through a single interface, the service offers an innovative approach to policy creation, basing policies on risk profiles to simplify deployment and management.

The platform has expanded its integrations, now covering SIEM, SOAR, EDR, SaaS, and IDP tools, enabling its context-rich insights to guide accurate response actions across multiple platforms. It has also added a DLP content investigation feature to improve its understanding of data content in risk assessments. The vendor has effectively utilized AI with its AI3 platform, offering users a natural language interface to analyze risks. This has significantly improved since our last report, providing greater context along with guided threat detection.

DTEX is a modular solution, and Insider Risk is available as a standalone module for customers.

The vendor has an established platform that it continuously updates with new capabilities. However, with a loyal customer base, it takes a thoughtful approach to introducing new features. Customers should expect these features to be integrated into the familiar platform.Â 

DTEX is positioned as a Leader and Outperformer in the Maturity/Platform Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
DTEX scored well on a number of decision criteria, including:

- **Risk source integration:** The solution sources data from a wide range of channels to gather telemetry. This includes its lightweight agent as well as the ability to ingest data from NGAV, EDR, CASB, Microsoft 365, and threat intelligence platforms, including the companyâs insider threat advisories. It can also collect non-technical information from HR platforms, such as Workday. This enables DTEX to deliver a context-rich insider risk analysis.
- **User behavior analytics: **The solution uses metrics to deliver comprehensive risk analysis and dynamic controls tailored to user behavior. It analyzes and establishes baseline user actions by role, department, and geography, generating risk scores to identify deviations. It detects reconnaissance, obfuscation, and other malicious activities and offers trigger alerts for abnormal activity, displaying elevated risks through dashboards for investigation, protection, and reporting.Â
- **Enterprise security stack integration:** The platform offers productized integration capabilities for a select group of third-party solutions (such as ServiceNow, Splunk, and CrowdStrike). Custom integrations are available for various data sets, including alerts, raw data, and enriched data, using formats like CEF, syslog, JSON, and CSV. Customers can either directly use the APIs or work with DTEX Professional Services to set up custom integrations.

DTEX was classified as an Outperformer due to its high rate of innovative change and an aggressive, forward-looking roadmap. DTEX has introduced new patented technology in AI security, enabling it to continue setting high standards for insider risk management.Â 

**Opportunities**
DTEX has room for improvement in a few decision criteria, including:

- **User education:** The solutionâs new features enhance end-user awareness with real-time pop-ups and optional feedback, supporting security education and feedback to IT. AI steering offers real-time security guidance for users interacting with AI systems. However, while DTEX can direct users to formal security awareness training (SAT) platforms, integrating with SAT vendors could simplify the adoption of insider risk-driven SAT for customers.Â
- **Response automation:** The platform offers an intuitive policy automation engine that provides granular policies, which can include triggering actions in third-party tools. While the solution does offer SIEM and SOAR integrations for more complex workflow automation, the addition of a native SOAR-like capability would help users drive more sophisticated orchestrations driven by insider threat events.Â
- **Compliance reporting:** Although the platform does not natively offer compliance reporting, it provides fully customizable dashboards that can be used to create their compliance views. The vendor also allows customers to request customizations to develop specific dashboards from DTEXâs support teams. However, adding more out-of-the-box features would be beneficial, enabling customers to access compliance-centric reporting more quickly.Â

**Purchase Considerations**
DTEX licensing is based on two parameters: the solution modules used and the number of endpoints and/or servers. Licensing is subscription-based, with options for one, two, or three years. Price quotes are available directly from DTEX or from its partners.

DTEX makes the solution easy to adopt, as itâs deployable in a short time, and can provide enterprise-wide visibility as soon as 24 hours. The system establishes internal risk benchmarks and outlier behavior within 10 days of initial deployment. Customers should plan for this initial ingest and baselining. Professional services are available for those who need them.

This is a solution aimed at larger enterprises and organizations. It is unlikely to be suitable for smaller businesses with fewer than 500 users.Â 

**Use Cases**
DTEX offers a comprehensive platform that supports various use cases. Using its AI-driven data science, it targets malicious insiders by focusing on activities truly linked to data loss. It provides a comprehensive view of user behavior across the organization, including detailed information on reconnaissance and obfuscation activities. Its ability to build context around cyber and non-cyber IoCs enables DTEX to identify activities related to malicious insiders, including espionage activity. It is ideal for organizations in sensitive government sectors and heavily regulated industries.Â 

### Everfox: EverShield

**Solution Overview**
Everfox is a cybersecurity company dedicated to enabling secure collaboration across all environments. Everfox is the former Forcepoint Federal division, which included the Cross Domain Solutions, Insider Risk, and Threat Prevention portfolios. In October 2023, this division spun out to become an independent company, separate from Forcepointâs commercial business.

EverShield is a modular solution for detecting, investigating, and responding to insider risks. It includes EverView, an endpoint agent that gathers behavioral telemetry; EverInsight, an AI/ML analytics engine used for baselining and spotting anomalies; and EverCase, a case management system designed for sensitive environments. Also included in the platform is EverExplore, an analyst interface that aggregates the information from all modules to provide dynamic search and filtering across insider risk data. Modules are available separately. The containerized platform can be deployed on-premises, in the cloud, in hybrid setups, or in air-gapped environments.

EverShield offers a centralized analyst dashboard for policy management, alert triage, and investigative workflows. Its government risk management background is transparent through its control features, which include detailed privacy options like âdo not collectâ rules, role-based access, two-person integrity, group-based access, and comprehensive audit trails of analyst actions.

The platform detects risks through policies, behavioral analytics, and linguistic analysis to identify insider threats such as toxic behavior or coercion. When necessary, risk escalations can shift monitoring, either manually or triggered automatically, from simple observation to full session capture, including video and keystrokes. Risks are displayed on timeline dashboards with investigation workbenches for activity replay at adjustable speeds.

EverShield is a robust governance platform designed for government and government agencies, and is now building a presence in large enterprises, including in healthcare and global telecom providers. Whatâs notable are the details the application gathers regarding user behavior and how it presents a risk. The vendor also offers a consultancy service to help customers build their insider risk programs.

The vendor has a well-established product and targets larger enterprises. It prioritizes stability and low-disruption updates, while still providing a regular cadence of enhancements. Customers should expect updates to be provided within the current solution framework.Â 

Everfox is positioned as a Leader and Fast Mover in the Maturity/Feature Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
Everfox scored well on a number of decision criteria, including:

- **Risk source integration:** The solution is designed to aggregate and correlate telemetry from a wide range of sources, enabling the identification of insider risk with context and accuracy. This includes endpoint monitoring, behavioral analytics from directory services and IAM, and HR, legal, and organizational data, along with SaaS and collaboration tools (which are optional enhancements). The extensive telemetry improves the accuracy and effectiveness of threat detection.Â
- **Collaborative case management: **The EverCase module was developed through years of close integration with Yakabod, which the company acquired to make it a native part of the solution. The module provides comprehensive case creation, assessment, and forensic artifact management, along with cross-functional and external collaboration. It also includes integration options with ServiceNow, Jira, and other external ticketing systems via the platformâs orchestration engine.
- **User behavior analytics:** The EverInsight module captures and models a wide range of user behaviors, including data usage and movement, authentication anomalies, communication patterns (in email or messaging) that can indicate signs of discontent or potential violence, and linguistic analysis, which examines written communication for psychological cues and possible indicators of intent to harm or commit fraud.Â

**Opportunities**
Everfox has room for improvement in a few decision criteria, including:

- **Response automation:** The solution supports automation in two primary ways: through configurable policy actions that trigger responses based on specific user behaviors or risk score thresholds, and through the dataflow framework app, a powerful visual orchestration engine for building advanced workflows. This framework enables conditional routing to case management systems, SOAR tools, or enforcement mechanisms. By unifying these capabilities within a single orchestration engine, the solution simplifies complex automation for customersâallowing them to extend simple policy-based triggers into more sophisticated, end-to-end workflows without switching tools.Â
- **Compliance reporting:** The solution provides policy-based notifications to help customers identify where activities may impact regulatory compliance. However, it lacks a formal, compliance-centric view. Adding this feature would assist those customers who want an insider risk-based view of compliance available within the platform.

**Purchase Considerations**
Everfox licensing depends on the modules selected. EverView (user activity monitoring) is licensed per user. EverInsight (behavioral analytics) is licensed per user or entity, depending on the deployment context. EverCase (case management) is licensed based on the number of analysts using the system, and EverExplore (investigation workspace) is included for licensed EverView analysts without a separate license. All licenses are subscription-based with tiered Premium and Premium Plus support options. Pricing is not publicly listed; customers can obtain it directly through Everfox or authorized channel partners.Â 

Since a self-hosted solution can be more complex than SaaS-based options, professional services may be helpful. Everfox provides these to support deployment architecture and implementation, policy tuning, analytics configuration, and integration with human resources information systems (HRIS), SIEMs, ticketing systems, and existing case workflows. The vendor also offers strategic consulting to help customers design and implement a comprehensive insider risk program.Â 

This solution targets large enterprises with more than 5,000 users and endpoints. It is not suitable for small and medium-sized businesses.Â 

**Use Cases**
Everfoxâs solution tackles multiple use cases, including preventing data exfiltration and protecting critical assets in regulated environments. Its EverShield tool helps detect, investigate, and prevent unauthorized data movement across monitored channels, making it popular in settings governed by NIST 800-53, NIST CSF, and CMMC. It can also identify malicious, negligent, and collusive insider behavior through user activity monitoring (UAM) and user and entity behavior analytics (UEBA), including psycholinguistic indicators that reveal risks. Additionally, it supports clients in developing their insider risk programs with features like integrated case management (EverCase), role-based access, auditable workflows, and privacy-by-design controls, enabling a shift from *ad hoc* to risk-managed operations.

### Gurucul: REVEAL Insider Threat

**Solution Overview**
Gurucul is a cybersecurity analytics company that helps organizations identify and respond to insider threats, account compromises, and access misuse through behavior analytics and risk intelligence. Its REVEAL platform integrates machine learning, identity analytics, and threat modeling to provide a comprehensive insider risk solution.

Gurucul REVEAL is a modular, integrated platform for data and security analytics. It provides flexible deployment options for SaaS, on-premises, hybrid, and GovCloud environments. Its modules include Data Optimizer, UEBA, Federated Search, Sme AI, Identity Analytics, and SOAR, which can be licensed based on requirements. REVEAL can ingest telemetry from various platforms, including endpoints, networks, cloud services, applications, HR systems, and identity providers, supporting over 450 integrations and creating new ones within 48 hours. It analyzes enterprise data in real time to deliver actionable insights on insider threats and related risks. Gurucul offers a library of ready-to-use content modules and more than 4,000 pretuned detection models to identify threats, reduce false positives, and detect zero-day threats. These models can be chained and customized through a drag-and-drop interface.

The platform evaluates risk in real time using over 200 attributes, normalizing scores and offering full context for better decision-making. Risk models can be customized to align with an organization's risk tolerance. Additionally, it provides a robust case management system, with strict RBAC and data masking to ensure adherence to privacy laws when cross collaborating. It can also be made available to external investigators at no additional cost.

Gurucul has invested in AI throughout the platform, including the Sme AI tool, which utilizes natural language processing to assist in building workflows and queries. It also leverages AI agents to continuously improve detection accuracy, develop new models, and autonomously adapt and suggest new response playbooks. Gurucul also recently added its AI Analyst, which delivers autonomous triage, escalation, and response, including a human-in-the-middle model to help establish confidence in AI actions.

Gurucul offers a well-established platform, and customers should expect incremental updates and new capabilities to be delivered through it.Â 

Gurucul is positioned as a Leader and Fast Mover in the Maturity/Platform Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
Gurucul scored well on a number of decision criteria, including:

- **Response automation:** The solution offers an automation framework for detection, alerting, investigation, and response, utilizing machine learning-based behavioral analytics to assess risk across users, entities, and data. It employs dynamic risk scores, policy triggers, and customizable playbooks that support both native and third-party actions. Integration with ITSM and SOAR platforms enables automated ticketing, case management, and escalation. Gurucul STUDIO offers a low-code/no-code interface for building detection models and orchestration logic.
- **Collaborative case management: **The solution provides an integrated case management system designed to support full-spectrum insider threat investigations. These can extend beyond IT and SOC investigations to include HR, legal, compliance, department heads, and even external investigators. A full case can be created directly within the Gurucul platform; each case gathers all relevant information, including risk scores, behavioral anomalies, triggered models, raw log data, investigation timelines, peer group comparisons, and analyst notes.Â
- **Risk source integration:** The platform offers a comprehensive library of integrations, supporting over 450 out-of-the-box integrations with endpoints, networks, clouds, applications, and identity solutions. It also offers a flexible connector, allowing customers to quickly add custom or new integrations and use the UI to build their own custom data ingestion pipelines.

**Opportunities**
Gurucul has room for improvement in a few decision criteria, including:

- **User education:** The solution provides notifications and alerts, as well as integration with other training solutions to deliver more comprehensive SAT. It also allows administrators to configure real-time user notifications based on specific risk triggers or behaviors. However, offering more native or OEM-integrated SAT could help customers adopt insider risk-based training programs.Â
- **Data loss prevention:** The platform offers data loss prevention via native enforcement and integrations with DLP, CASB, and endpoint tools. Although not a traditional content-aware DLP, it detects behavioral and contextual risks, enabling immediate actions such as user session isolation, account suspension, and privilege revocation. Adding native capabilities would help customers consolidate insider risk and DLP within the solution.Â

**Purchase Considerations**
Gurucul offers subscription-based licensing based on either data volume (in GB per day) or the number of identities/users, depending on the customerâs use case and environment. Minimum contract commitments are typically one year, with multiyear pricing incentives available. Pricing is not publicly listed and is provided through direct engagement with Gurucul or via authorized resellers.

Its flexible deployment model is designed to be simple, although Gurucul does offer professional services, including SmartStart, a structured onboarding program that provides guided implementation, best practice configurations, prioritized use case rollout, and tailored training.

This solution is suitable for both SMBs and large enterprises. Gurucul reports customers with as few as 150 employees.Â 

**Use Cases**
Guruculâs extensive platform supports numerous use cases, including insider threat detection and risk prioritization through behavior analytics, identity context, and dynamic risk scoring to identify the most critical threats. It also helps organizations identify compromised insiders and account takeover by detecting deviations from behavioral baselines, revealing signs of insider compromise and account misuse. Additionally, it assists in recognizing privileged access misuse and excessive entitlement risk, enabling organizations to enforce least privilege, identify risky behaviors related to access misuse, and comply with regulatory and audit requirements for insider threat management.

### Metomic*

**Solution Overview**
Metomic offers a security solution tailored to SaaS applications. It is designed to provide security teams with clear visibility into how an organization's users share, store, and extract sensitive data from SaaS applications, enabling them to detect and prevent insider security threats.

Metomic offers a SaaS platform that detects data-related risk behaviors in SaaS applications, integrating via API with applications such as Microsoft 365, Slack, Google Drive, Gmail, Notion, and Salesforce. It assesses user risk based on data-focused activities, identifying unusual behaviors such as cross-application movement, sensitive data access, and anomalies. The dashboard provides insights into high-risk behaviors, customizable to specific needs. Its policy engine offers controls and alerts that can be managed in the console or via tools like Slack, with options for risk remediation, including blocking and rights removal, as well as bulk actions.

The solution also employs a human firewall approach, which utilizes real-time alerting to help users recognize and understand risky activities. This goes beyond simple notifications, providing more context, which includes the ability to redirect users to more formal training.

Metomic has recently released a solution to help customers address the increasing risk posed by GenAI tools, allowing it to identify information that AI agents could access and automatically detect and act on risky data before it reaches these agents.

Metomicâs customers should expect to see further enhancements delivered within its familiar platform.

Metomic is positioned as a Challenger and Fast Mover in the Maturity/Feature Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
Metomic scored well on a number of decision criteria, including:

- **User education:** The human firewall approach provides robust capabilities for enhancing education. It doesn't rely solely on notifications; instead, it gives more detailed insights into risks, and it includes the ability to enroll users in external security awareness training platforms.Â
- **Data loss prevention:** The solution provides a variety of automated DLP actions within its policy rule set. These automated policies can enforce controls on protected SaaS apps. Notably, this includes the ability to use data obfuscation techniques, such as masking and anonymization, when supported by the protected SaaS apps. Very few vendors assessed in this report offered this capability, which is limited to SaaS applications only.Â
- **Collaborative case management:** Although the vendor does not aim to deliver a comprehensive case management system, it does collect extensive data on user risks to assist with thorough incident investigations. This includes the ability for users of the platform to access and share notes on the threats discovered.Â

**Opportunities**
Metomic has room for improvement in a few decision criteria, including:

- **Risk source integration:** The solution collects information only from SaaS platforms, although it supports a good range, including Slack, Google Drive, Gmail, Notion, and Microsoft 365. However, for many insider risks, it is also necessary to consider user behavior in other areas, such as at the endpoint or network level. Adding some capabilities here would expand its insider risk telemetry and broaden its potential customer base.Â
- **Enterprise security stack integration:** Since the solution is currently SaaS-focused, with a strong library of supported SaaS applications, it does not offer integration with on-premises and non-SaaS-based tools. However, many enterprise customers' existing security stacks are not SaaS-based. Providing integrations into non-SaaS systems would help extend the solution's appeal.Â
- **Response automation:** The solution provides policy-based automation to handle issues natively, which includes the ability to inform external applications and users of risks. It also offers a more comprehensive workflow automation capability, which includes limited prebuilt integrations into enterprise response tools such as ITSM and SOAR. Extending these integrations would improve adoption and allow the solution to become an integral part of an organization's security workflow.Â

**Purchase Considerations**
Metomic does not publish price details. Its solution is available in the AWS Marketplace, which offers standard and premium plans licensed annually with a set number of supported users (200 or 300). Other sources also note that Metomic has a modular purchasing model, with individual modules available separately.

The solution is a SaaS platform that should be easy to deploy and is unlikely to require professional services. It is unclear if the vendor offers this support, but it does have a partner ecosystem capable of supporting implementation.

This solution is suitable for SMBs.

**Use Cases**
Metomic offers a solution that covers various use cases, including helping businesses prevent data breaches caused by insider threats or employee errors. It also assists organizations in complying with regulations and standards, such as PCI DSS, SOC 2, DORA, ISO 27001, and HIPAA. It accomplishes both of these using a range of data classifications that enable customers to develop compliance and data security policy rules. Each policy can also be reported on, allowing customers to generate compliance and data breach insight reports.Â Â 

### Microsoft: Purview Insider Risk*

**Solution Overview**
Microsoft offers a comprehensive range of solutions for its global customer base. The Purview Insider Risk solution is part of its Microsoft Purview capabilities within the Microsoft 365 SaaS platform. It is included in Microsoft 365 and is activated by an E5 license. It enables customers to integrate both user and data risks to identify potential insider threats.Â 

Purview Insider Risk is an option within Microsoft 365. Like all Microsoft 365 features, it can be easily enabled and once active, it integrates smoothly across Microsoft 365. Purview Insider Risk integrates with other Microsoft tools, including Defender for Cloud Apps, allowing it to analyze risks across non-Microsoft cloud platforms. The solution gathers telemetry from the entire protected environment and supports integration with HR systems to facilitate non-technical risk assessments, such as user resignations, new hires, or disciplinary issues. Threats are analyzed not only by checking for policy violations but also through analytics that establish user behavior baselines and detect deviations. The platform offers a wide range of templates to help users quickly begin building detailed risk policies. Policies can be tailored to prioritize risk and help reduce alert noise.Â 

The solution integrates with Microsoft Flow, enabling customers to create extended orchestrations for threats and trigger actions across other Microsoft and third-party applications. Its forensic investigation feature enhances incident analysis by allowing session recording, which can be triggered by specific actions to help maintain privacy. Microsoft has also expanded its capabilities in AI services, providing insights into their use and enabling the enforcement of controls to mitigate the threat posed by AI misuse.

The vendor will continue to add new capabilities, which customers can expect to see delivered within the existing Microsoft 365 platform.

Microsoft is positioned as a Leader and Fast Mover in the Maturity/Feature Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
Microsoft scored well on a number of decision criteria, including:

- **Enterprise security stack integration:** The solution offers several integrations with security tools commonly employed in enterprises. However, it is Microsoftâs market position that ensures the majority of enterprise security vendors will provide seamless integration into the Microsoft ecosystem, whether Microsoft does so or not. This makes it likely that any customer can connect their existing security tools to Microsoftâs Insider Risk solution.Â
- **Response automation: **Integration with Microsoft Flow offers customers a flexible orchestration and automation engine. It provides a no-code workflow engine, allowing customers to build response orchestration capabilities across multiple platforms, including both Microsoft 365 and third-party tools integrated into the platform.Â
- **User behavior analytics:** The solution can collect extensive telemetry from various sources and user interactions across a customer's Microsoft 365 infrastructure, as well as their interactions with non-Microsoft web applications and user activities on endpoints. It also includes the ability to integrate with non-technical systems, such as HR systems, to enable notification of new hires, leavers, or other information that can inform risk assessments. This allows the solution to create a context-rich view of insider threats.Â

**Opportunities**
Microsoft has room for improvement in a few decision criteria, including:

- **User education:** User education is limited to notifications of potentially risky actions. Although the platform offers an integrated phishing awareness tool, it does not cover broader insider risk education. Adding a native tool or expanding integrations between insider risk metrics and external solutions will help customers enhance their education programs.Â
- **Compliance reporting:** Like many of the solutions assessed in this report, compliance reporting in the product is limited to identifying data such as PII that could pose a potential compliance risk. However, the solution does not offer a compliance-centric view of risk. Including this in the platform would be valuable for those responsible for implementing compliance programs within organizations.Â
- **Risk source integration:** While the solution can seamlessly gather information from 365, Windows, and Cloud App telemetry (an agent is needed for macOS), it remains very Microsoft 365-centric. Extending this to include areas such as network telemetry, and the ability to analyze non-technical areas like sentiment analysis, would further enhance the solution and make it an even more attractive proposition.Â

**Purchase Considerations**
Microsoft Purview Insider Risk is enabled with a Microsoft 365 E5 license. It is licensed on a per-user/month subscription basis. Pricing is available on the Microsoft website, as well as directly from the vendor or one of its partners.

The solution is enabled within Microsoft 365, with little additional configuration needed to deploy it. Customers may need help to take advantage of its comprehensive capabilities. These services are available from Microsoft and its extensive partner network.

While this solution is technically suitable for smaller customers, the requirements for an E5 license will likely make it less attractive for these customers.Â 

**Use Cases**
Microsoft offers a strong solution that can address several use cases. For Microsoft customers with an E5 license who want a robust insider risk program, Purview Insider Risk provides a compelling solution as it is integrated tightly across the entire Microsoft 365 infrastructure, as well as with Windows-based endpoints. It is quick to deploy, can gather detailed telemetry, provide comprehensive risk analysis, and enable effective insider risk remediation.

### Mimecast: Incydr*

**Solution Overview**
Mimecast is a cybersecurity provider offering solutions such as email security, collaboration security, and security awareness training. In 2024, it acquired insider risk management technology from Code42, using its Incydr product to provide insider risk protection.

Incydr is part of Mimecastâs broader portfolio. It is offered as a SaaS solution and managed through Mimecastâs cloud-based administration console. The SaaS solution relies on agents installed on endpoints as its primary source of telemetry. It also includes a library of API integrations with major SaaS applications, as well as a browser extension for monitoring web traffic.

Incydr monitors cloud, endpoint, and email events within a single solution. It employs a context-driven prioritization model that uses over 250 risk indicators to identify and score data events. This is further strengthened by its integration into the broader Mimecast portfolio. As a result, Incydr is part of a comprehensive human risk analysis platform that offers a multi-context view of insider behavior and potential threats, including data from email security and training platforms.

Incydr enables users to create policy-based responses, but it can also flag risks it detects outside of these policies and allows users to establish guidelines based on these risks. It supports a wide range of threat responses, from automated microlearning modules for accidental, non-malicious risks to automatic blocking for the highest-risk scenarios. More complex response workflows can be developed through integration with external SOAR platforms.

Incydr is part of Mimecast's overall modular platform; however, it can be purchased as a standalone solution.

Mimecast continues to acquire new technologies to expand its comprehensive human risk portfolio. Customers can expect this trend to continue and may anticipate changes to the platform that will require additional training and workflow adjustments.Â 

Mimecast is positioned as a Leader and Fast Mover in the Innovation/Platform Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
Mimecast scored well on a number of decision criteria, including:

- **Risk source integration:** The solution provides more than 30 integrations across cloud storage/email, IAMs, SIEM, SOAR, EDR/XDR, email security tools, ticketing apps, messaging, and HR platforms. It utilizes telemetry from this broad range of risk sources to build a comprehensive contextual view of insider risk.Â
- **User education:** The vendorâs Instructor Micro Training Program can provide varied and targeted education, ranging from brief nudge training notes to help improve user behavior to full micro-training videos (of less than two minutes) that help customers understand risk behavior and how to avoid it. In addition, the solutionâs integration with Mimecast also provides access to Mimecast's comprehensive SAT solution.Â
- **Data loss prevention:** Mimecastâs Human Risk threat analytics enables the solution to consider the broader context when evaluating data loss risk. For example, proactive information, such as about cases where users have failed phishing tests or been victims of attempted phishing, can help determine whether user actions might pose a greater risk of data loss. When data loss risk is identified, the solution can mitigate risks with actions such as blocking file uploads, paste activity, removable media, and external sharing of cloud files.Â

**Opportunities**
Mimecast has room for improvement in a few decision criteria, including:

- **Collaborative case management:** The solution offers incident response analytics, enabling users to evaluate detailed information on potential high-risk insider behaviors. Incorporating more comprehensive case management features, such as screen recording and the ability to share case access with non-IT personnel, would be useful to customers who require detailed forensic investigations within a single platform.Â
- **Compliance reporting:** The solution identifies frameworks that can be used to display controls and guidance on attack chains, such as the NIST and CIS frameworks, but it does not provide a comprehensive portfolio of compliance frameworks against which customers can assess their data security posture. Incorporating a more compliance-focused perspective, along with a broader range of frameworks, would help customers directly improve insider risk compliance.Â
- **Response automation:** The platform can use policy-based rules to automate responses, such as blocking file movement and educating users when risky behaviors are identified. This could be enhanced by enabling integration with third-party tools like Tines. However, developing a more comprehensive orchestration capability within the product would simplify this process for customers and eliminate the need to acquire or learn additional applications.Â

**Purchase Considerations**
Incydr is licensed based on the number of seats and the specific product plan selected. Licensing options include various tiers, such as Incydr Professional, which offers risk detection for endpoints, as well as features like dashboards, forensic search, and exfiltrated file collection. Additional add-ons, such as email integration for Microsoft 365 and Gmail, can also be licensed. Licensing is per user and subscription-based.

As a SaaS-based solution, Incydr should not be overly complex to deploy, though Mimecast does offer professional services and support if needed. Professional services can also be provided via its extensive partner network.

This is a solution suitable for businesses of any size, from SMBs to enterprises.

**Use Cases**
Mimecast enables customers to manage the risks associated with departing employees by integrating with HR and ticketing tools, allowing them to assess risks based on historical activity and identify potential data exfiltration by departing employees. The solution also supports proactive threat detection with over 250 customizable risk indicators for precise monitoring. Its comprehensive human risk detection can significantly reduce false positives and improve the ability to identify insider threats.

### Proofpoint: Proofpoint Insider Threat Management (ITM)

**Solution Overview**
Proofpoint is a leading cybersecurity and compliance company. It offers an integrated suite of cloud-based solutions that help stop targeted threats, protect data, and make users more resilient against cyberattacks.

Proofpoint Insider Threat Management (ITM) is part of the Data Security platform, providing a unified solution to guard against data loss, exposure, and insider threats. Proofpoint ITM is cloud-based, although it does retain an on-premises option. It uses a lightweight agent to collect endpoint telemetry. It also integrates with SOC tools like SIEM and SOAR via APIs.

Proofpointâs Human Risk Explorer (HRE) leverages extensive context and behavior telemetry to identify risky actions and gather evidence. This accelerates investigations, supports teamwork, and ensures appropriate responses while reducing business disruption and data loss. HRE provides a comprehensive view of human risk, encompassing employee vulnerabilities, behaviors, attack exposure, data handling, security awareness, and identity management. It provides clear risk scores to help prioritize mitigation, enforce policies, and recommend actions for security analysts.

Its case management system offers detailed incident data, including screen captures, to provide comprehensive insights into user behavior. Proofpoint has also invested in GenAI protection, featuring a central dashboard that provides a view of data leakage into GenAI tools. Its endpoint agent can also enforce risk mitigation policies to block unsanctioned GenAI tools and restrict access to sensitive data to authorized tools. Proofpoint ITM is part of the Data Security Platform, which provides a unified management platform for policy creation, reporting, alerting, and investigations.

Proofpoint ITM is part of a modular offering; however, the insider risk components can be deployed as a standalone solution.

Proofpoint offers a range of services to its existing customer base from its familiar platforms. The vendor takes a thoughtful approach to new developments, and customers should expect to see these integrated into the existing solution.Â 

Proofpoint is positioned as a Leader and Fast Mover in the Maturity/Platform Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
Proofpoint scored well on a number of decision criteria, including:

- **User behavior analytics: **The HRE solution enables the platform to ingest extensive telemetry from multiple sources, providing a rich, contextual view of risk. It uses this risk evaluation to help implement dynamic policies or present details to customers about risks, including insights into where the risk is happening and the best ways to address it. This contextual risk assessment helps reduce false positives and gives customers an accurate view of insider threats.Â
- **Collaborative case management:** While the vendor is not attempting to build a complete case management system into its product, the ITM solution does offer comprehensive incident analysis. It provides workflows to support investigations, which allow security analysts to easily triage, manage, and respond to incidents collaboratively on the dashboard. The platform gathers additional insights such as a timeline of user and data activity, file lineage, and screenshots of user activityâall valuable aids in an incident investigation.Â
- **Data loss prevention:** The solution provides a layered set of controls for data loss prevention. At the endpoint, it offers a range of controls that include blocking or restricting data transfer to USB, web upload, and cloud synchronization, among other features. It can also block the movement of sensitive information into GenAI prompts.Â

**Opportunities**
Proofpoint has room for improvement in a few decision criteria, including:

- **User education:** The platform educates users by providing notifications and user justification options when they violate corporate policy. These notifications can link to the relevant policy. However, the vendor does not natively offer more structured training within the platform. While users can link the solutions to Proofpoint Zenguide or other external tools, integrating more comprehensive training directly into IRM would help them take advantage of insider risk-related training more easily.Â
- **Compliance reporting:** The solution supports attribute-based controls, offering a flexible and straightforward approach to managing data access. This method can identify data and classify it under frameworks such as PII. However, the solution lacks a compliance-focused view. Adding a compliance-centric dashboard that supports common frameworks would be a valuable addition for customers in compliance-sensitive industries.Â
- **Enterprise security stack integration:** The platform takes an API-first approach that allows analysts to manage alerts and responses via APIs with SIEM, SOAR, ITSM, EDR, and XDR. However, it lacks a library of enterprise integrations. Adding these would help customers integrate ITM more quickly into an enterprise security stack.Â

**Purchase Considerations**
Proofpoint ITM licensing is available in both SaaS and on-premises models. Licensing models differ for the two deployment options. ITM SaaS is licensed per user, while ITM on-premises licensing is based on the number of endpoints with the agent installed. Pricing information is available through Proofpoint or its partner channel.

Deployment should not be overly complex; customers' deployments are supported by Proofpoint Professional Services, which assist customers in customizing the solution during the initial setup and enable three to five best practice use cases.

This solution is equally targeted and suitable for both SMBs and enterprises.Â 

**Use Cases**
Proofpointâs comprehensive solutions address a wide range of use cases. They can help customers manage three distinct insider risk challenges. The first involves the careless user, someone with good intentions but who makes mistakes. The second addresses malicious users aiming to harm the organization, such as departing employees who steal intellectual property before leaving or employees engaging in sabotage, espionage, or fraud. The third assists organizations in dealing with compromised users whose credentials have been stolen by threat actors, enabling quick identification of these risks before attackers can move across the organization's systems. The platformâs range of capabilities allows customers to handle each of these scenarios effectively by applying controls that are proportional to the different risks these users pose.Â 

### Safetica

**Solution Overview**
Safetica provides intelligent data security for data loss prevention and insider risk management in both on-premises and cloud environments, safeguarding business-critical data against evolving insider and external threats. It combines data protection, insider risk management, compliance readiness, and data discovery to protect sensitive information and minimize risk across any enterprise setting.

Safetica combines DLP and IRM into a single solution, providing a comprehensive view of insider behavior. The platform is SaaS-based but also offers self-hosted deployment options. Safetica uses an endpoint agent, available for both Windows and macOS, which enables it to analyze device and user details. It also integrates with Microsoft 365 to monitor behavior and data movement within the platform. The solution examines various risk areas, including user behavior, based on detailed factors such as how employees work, print, and use hardware and software assets, as well as unusual usage patterns that include hours of operation and location data. Safetica offers an out-of-the-box configuration that includes dynamic risk detection, helping identify data security risks without the need to set up policies, thereby speeding up adoption for customers.

The vendor has added some basic case management features to the platform to assist with investigations and has invested in AI to help with summarizing information.

The vendor continues to develop within its established product, and customers can expect this activity to continue.

Safetica is positioned as a Challenger and Fast Mover in the Maturity/Platform Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
Safetica scored well on a number of decision criteria, including:

- **Data loss prevention:** The solution offers comprehensive DLP capabilities that allow users to identify and classify data; it then audits all behavior related to this data. When insider risk behavior or threats target this data, it can apply controls, including those at the device level.Â
- **User behavior analytics: **The use of an agent, combined with its integration with Microsoft 365, provides valuable insights into user activity. The agent delivers detailed information not only about traffic to and from the endpoint device but also about how data moves between the device and peripherals, creating a view of user behavior that can help model expected actions more accurately. The solution uses this analysis to generate an event risk score against which it can apply controls.Â
- **Compliance reporting:** While the platform does not offer out-of-the-box compliance-centric reports, it provides customers with the ability to generate their own reports. This flexibility allows customers to build reports using a range of templates that identify regulatory policies, including GDPR, CCPA, PIPEDA, LGPD, financial compliance frameworks such as PCI DSS, and healthcare data regulations like HIPAA.Â

**Opportunities**
Safetica has room for improvement in a few decision criteria, including:

- **User education:** Education options are limited to user notifications, which users can override to prevent them from interrupting workflows. However, there are no more structured or detailed types of training available on the platform. Developing more advanced capabilities, such as nudge-based advisory notifications or links to external SAT tools, would help customers create insider risk-centric training programs.Â
- **Response automation:** The solution's automation features are limited, lacking formal SOAR integration or internal workflow creation. It sends security events as syslog messages to third-party systems, such as SIEM. Improving these features would attract larger organizations with more complex workflows. Adding a formal workflow engine or integrations with SOAR would enhance the platformâs integration into threat mitigation workflows.Â
- **Enterprise security stack integration:** While the platform offers a library of integrations, this library is limited in scope. Increasing it and broadening the range of prebuilt integrations would help customers integrate the solution more quickly into their existing security ecosystem.Â

**Purchase Considerations**
Safetica is licensed per user, with a fair use policy that covers up to three devices per user to prevent overcharging in multi-device or hybrid environments (on-premises and cloud). Licensing is subscription-based and varies depending on whether the solution is deployed in the cloud or on-premises. Safetica Cloud offers a one-year subscription, paid annually. Safetica On-Premises provides multiyear subscriptions (one to three years). Pricing is published by Safetica on its website in select regions (for example, the US and Canada). In the other areas, pricing is available on request through Safetica Partners.

While the solution should not be overly complex to deploy, Safetica offers three standard professional services engagement types if needed. Product Implementation is available for enterprises with complex configuration or environmental requirements. Safetica Expert Check helps validate or optimize an existing partner-delivered implementation. A Premium Support SLA is also available, providing direct post-sales support from the vendor. Basic product training for administrators is included with all subscriptions and is delivered by Safetica or certified partners.

This solution is suitable for small to medium organizations and can scale to meet the needs of organizations with up to approximately 10,000 seats.

**Use Cases**
Safeticaâs solution can help customers address several use cases. It can identify potential insider risk activity through contextual analysis and dynamic policy enforcement, protecting data without affecting productivity. The solution also helps organizations identify behavioral anomalies that may indicate insider threats. By analyzing user behavior patterns and deviations from normal activities, Safetica flags suspicious actions with automated alerts and notifies security teams for immediate investigation and response. This enables organizations to take proactive measures and reduce the impact of high-risk insider activity.Â 

### Securonix: Securonix Unified Defense SIEM

**Solution Overview**
Securonix provides threat detection and insider risk management solutions. Its cloud-native platform functions as a full SIEM or as a UEBA layer to complement existing tools.

Securonix provides insider risk management through its cloud platform, which features behavioral analytics, threat detection, case management, and automated response. Built on Snowflake Data Cloud, it enables scalable data ingestion and retention of searchable data. It is a SaaS-based solution, but also provides an on-premises option for select clients. Additionally, it integrates with over 750 data sources, including endpoints, SaaS applications, DLP tools, identity providers, and HR systems. Risk detection employs policy-driven approaches, behavioral analytics, and contextual modeling, along with a dynamic policy feature that identifies uncovered risksâthose without a specific policy assignedâand recommends corresponding responses. Alerts are risk-scored, linked to users and entities, and visualized in the Security Command Center for further investigation and analysis.

Securonix has enhanced risk analysis with its Insider Intent metrics, which analyze user communication channels, considering intent, language, and emotion to give deeper insights into risk. This is achieved through syntactic text analysis rather than focusing on specific words or language. Customers can create complex responses using a no-code workflow builder. Investigation tools anonymize data to minimize bias. Dashboards are fully customizable, offering comprehensive reporting on compliance risks and supporting users in applying their frameworks.

Securonix also offers strategically deployed AI, including a policy and response agent, to streamline policy creation, investigation, threat hunting, and searches.

The solution is modular, with the behavioral analysis module available as a standalone service, allowing deployment either as a separate insider risk solution or as part of a broader SIEM strategy.

The vendorâs approach is innovative, suggesting customers can expect a range of new developments that may require additional education and a review of existing processes.Â 

Securonix is positioned as a Leader and Outperformer in the Innovation/Platform Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
Securonix scored well on a number of decision criteria, including:

- **User behavior analytics:** The platform offers advanced behavioral analytics through its specialized UEBA foundation and the development of agentic AI capabilities. It utilizes statistical baselining, peer group analysis, machine learning, and sequential modeling to identify insider threats related to file access, application usage, identity behavior, and communication. Its new Insider Intent feature further improves this by utilizing GenAI to analyze tone, language, and communication patterns for signs of malicious intent, emotional shifts, or disengagement.Â
- **Response automation: **The solution offers integrated SOAR capabilities available to all customers, which can be upgraded to advanced SOAR with an additional license. It enables the creation of orchestrations and response workflows to lessen analyst workload. Out-of-the-box automation features include prebuilt connectors and playbook actions for standard tools such as EDRs, identity platforms, network devices, threat intelligence feeds, and ITSM systems.
- **Compliance reporting: **The platform offers ready-to-use compliance content for major regulations, including PCI DSS, HIPAA, SOX, GDPR, FISMA, GLBA, GPG13, and FERC/NERC CIP. These packages feature prebuilt policies, use cases, dashboards, and reports that enable real-time monitoring and investigation of activities related to compliance. Organizations can customize these frameworks to meet regional or industry-specific compliance requirements. All content is fully adaptable, and customers can also create their own policies, reports, and workflows to match internal controls or evolving standards.

Securonix was classified as an Outperformer, having introduced several innovations and new capabilities to the platform since our last report. It shows an equally aggressive roadmap for the next 12 months, which should keep the vendor well-positioned as a leader in this space.Â 

**Opportunities**
Securonix has room for improvement in a few decision criteria, including:

- **User education:** The solution is designed for SOC teams to manage console alerts, with analysts determining the next steps, including user follow-up. It doesn't train or alert end users about risky behavior, though it can redirect them via custom alerts. Providing more insight for end users involved in high-risk behavior would enhance the safety of the organization.Â
- **Data loss prevention:** While the solution can leverage its analytics features to identify data risks and provide enriched content inspection data, including identity and behavioral signals that DLP tools can use to enforce controls, it does not include native DLP capabilities. Adding some native controls would enable security teams to not only identify risks but also implement mitigation measures, which could help reduce the risk of data loss.Â
- **Collaborative case management:** The platform features a built-in case and incident management system designed to support collaborative workflows for insider threat investigations. Cases can be generated automatically through detection policies or threat models, or manually by analysts, with complete contextual connections to alerts, user risk scores, and relevant events. The vendor could enhance this feature by providing broader access for non-IT users on the platform; currently, non-IT users receive case updates only via email notifications.Â

**Purchase Considerations**
Securonix offers a tiered subscription model tailored to different operational needs. Customers can select from predefined packages (P1 Basic, P2 Standard, P3 Advanced, P4 All-In) that include features like SIEM, UEBA, Data Pipeline Manager, and AI-Reinforced Analytics. Optional add-ons can be activated using a license key. Pricing depends on data volume (GB/day) and is billed based on annual or multiyear subscription commitments. Pricing details are available through Securonix sales or authorized partners.Â 

Customers should be aware that professional services are usually necessary for initial deployment, particularly in large or complex environments. Securonix provides these services through clearly defined service packages.

This solution targets midmarket to enterprise customers. It is less suitable for the smallest clients.Â 

**Use Cases**
Securonix is a security analyst-focused tool that addresses various security operations use cases. This includes identifying high-risk users through behavioral analytics, policy violations, and contextual risk modeling. The solution helps organizations detect privileged access misuse via risk-based analytics that monitors privileged accounts for misuse, compromised credentials, or account sharing. It also supports analysts in identifying indicators of compromise, such as data exfiltration, lateral movement, and malware infections, by correlating data across user, endpoint, and network activities.Â 

### Syteca

**Solution Overview**
Syteca, formerly Ekran Systems, is a software provider focused on inside perimeter security. The solution offers advanced user activity monitoring (UAM) and privileged access management (PAM) solutions to organizations across all industries and sectors.

Syteca UAM and PAM products are available as SaaS or self-hosted solutions, either on-premises or in the cloud. Customers should be aware that there are some functional differences between these product variants. The risk telemetry is mainly collected by an endpoint agent that supports Windows, Mac, Linux, and AIX and tracks metrics like web access, USB devices, keystrokes, and session recordings. User behavior analytics enhance threat detection, such as recognizing activity during unusual hours, although this feature isn't included in the SaaS version. It offers insider risk mitigation actions, such as user blocking, alerts, and USB controls.

Additionally, the platform offers threat investigation tools, which include searchable metadata to enable analysts to quickly locate relevant sessions or events during investigations, so they can efficiently review potential risky activities and alert or block emerging threats. Sytecaâs investigation tools include Monitored Data Pseudonymisation to help protect user privacy during investigations.

Syteca offers several complementary tools to mitigate insider risk. This includes managing passwords and secrets, controlling access, and implementing extra safeguards on endpoint device access, such as enforcing multifactor authentication (MFA) for specific accounts. Additionally, account discovery helps identify and onboard privileged accounts, enhancing access control and insider risk mitigation.

The solution is modular, with both UAM and PAM available as standalone products.

Syteca has an established platform and continues to enhance its functionality, a trend customers can expect to continue.Â 

Syteca is positioned as a Challenger and Forward Mover in the Maturity/Platform Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
Syteca scored well on a number of decision criteria, including:

- **Collaborative case management: **The platform provides detailed threat investigation information with itemized behavior logs that can be analyzed alongside full-screen recordings. Its behavior analytics feature can also display data on application usage, work patterns, data transfers, and keylogging to give a complete view of user activity.
- **Response automation: **While most native responses are driven by the platformâs policy engine, enabling threat detection and automated notification or response, the solution also offers strong integration capabilities. These include built-in support for ServiceNow and API-based connections with external automation tools such as ITSM and SIEM platforms, allowing it to function seamlessly as part of a broader security workflow.
- **Compliance reporting: **The solution provides ready-to-use reporting on compliance across several global frameworks. These reports identify potential regulatory breach risks based on data and insider risk behaviors.Â

**Opportunities**
Syteca has room for improvement in a few decision criteria, including:

- **Risk source integration:** The solution is primarily client-based, and while it supports a variety of client devices, it does not collect telemetry from other locations. Insider risk for many organizations extends beyond endpoint behavior. Adding more integrations with solutions such as identity platforms and SaaS applications will help customers gather richer context for insider risk detection and analysis.Â
- **User education:** The platform offers limited user notifications when behavior might violate policies. This does not meet the standards seen in some vendors' structured and targeted training and warning systems. Improving the information or integrating with more organized training tools will help customers promote insider risk education.Â
- **User behavior analytics:** Users can create rules to detect threats, such as unusual work hours, and send alerts to security personnel with an associated risk score. However, customers should be aware that currently, UEBA is not available in the SaaS application. Adding this capability will help achieve feature parity and make the solution more appealing to SaaS-first customers.Â

Syteca is classified as a Forward Mover due to slower-than-expected platform development since our last report. The addition of a SaaS deployment option will be beneficial, but there are still feature gaps between SaaS and on-premises deployments, which will hinder adoption. The vendor is also close to a new version release, which includes significant feature additions; however, this was not available for us to assess for this report.Â 

**Purchase Considerations**
Syteca does not provide license or pricing information publicly. However, its user documentation outlines that licenses are different depending on the module selected. The PAM module is licensed per seat, and the UAM module per endpoint. The vendor does not provide information on whether they offer subscription or perpetual license models.

As this is a SaaS solution with endpoint agents, installation should not be complicated. However, users deploying a self-hosted version may need to consider minimum requirements, build, and maintenance. If required, Syteca provides professional services for its customers. Its partner channel can also support professional services requirements.Â 

This solution is suitable for SME customers.Â 

**Use Cases**
Syteca addresses several use cases, including detecting data exfiltration by using its IRM to monitor data access patterns and flag unusual activities, such as employees downloading large amounts of sensitive data. The solution also helps clients address unauthorized system access by tracking access to sensitive information and detecting unauthorized attempts to view, copy, or modify data. Syteca also allows customers to monitor risky behavior, looking for violations of security policies, such as attempts to bypass security controls or engage in risky activities, which could indicate a potential insider threat.Â 

### Teramind

**Solution Overview**
Teramind provides comprehensive user behavior analytics, insider threat detection, and data loss prevention solutions. Teramind helps organizations gain deep visibility into user activities, enhance cybersecurity, optimize productivity, and ensure compliance. The solution is modular, but is offered as a single product.

Teramind offers insider risk analysis by monitoring user activity, identifying sensitive data, and enforcing policies to prevent risky behaviors. Available as SaaS, on-premises, or private cloud, Teramind deploys an endpoint agent to collect telemetry and analyze user behavior. It also integrates with security tools like SIEM, IAM, ServiceNow, and Microsoft Purview, which it uses for compliance labeling.

The management interface enables policy creation, reporting, alert dashboards, and investigations. Policy alert building allows customers to develop detection and response capabilities, including blocking, lockout, and screen recording before, during, and after a violation.

Teramindâs AI engine offers a user behavior analytics feature that monitors a wide range of activities, including web access and instant messaging. It can record screens and log keystrokes. This enables it to identify warning signs, such as withdrawal and antisocial behavior, early on, alerting organizations so they can respond promptly.

The vendor continues to drive new capabilities into its established platform. Customers should expect this to continue.

Teramind is positioned as a Challenger and Fast Mover in the Maturity/Platform Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
Teramind scored well on a number of decision criteria, including:

- **Collaborative case management:** The platform provides investigation capabilities and captures details such as activity logs, emails, file transfers, and network monitoring. Its Teramind AI adds further case context and enables investigations to be initiated directly from risk alerts. The platform also takes screen snapshots that can be triggered, retained, and used for case development. Additionally, the solution can integrate with external case management tools.
- **User behavior analytics: **Teramind AI adds detailed behavioral analytics to the solution. It monitors all user activities, including web access, instant messaging, and OCR scanning, looking for users who view sensitive information for extended periods. It uses this data to identify early behavioral red flags. Teramind AI is also able to assess sentiment analysis to provide additional rich context to its behavioral analytics.Â
- **Enterprise security stack integration:** The solution offers a library of prebuilt integrations and provides customizable API connections to create tailored integrations. It supports integrations with various enterprise security tools, including SIEM/Log Analytics, Ticketing/Help Desk/ITSM, and Analytics.Â

**Opportunities**
Teramind has room for improvement in a few decision criteria, including:

- **Risk source integration:** The solution collects telemetry only from its endpoint agent, but insider risk for many organizations goes beyond endpoint data. Adding integrations that can pull telemetry from various tools like SaaS applications or HR systems would help expand analytics data points and give customers broader context regarding insider threats.Â
- **User education:** User education is limited to simple notifications when risky behavior is detected. Adding options to educate users at this stage would benefit customers, whether through real-time training nudges or more formal SAT programs. This would help assist customers in managing insider risk more effectively.Â
- **Compliance reporting:** The solution provides (and is limited to) MITRE ATT&CK insights with 350 sample behavior policies. It allows policies to be created that could trigger potential compliance framework breaches, but there are no templated capabilities outside of MITRE to support this, and there are no dashboards that display risks against formal frameworks or controls. Compliance-focused reporting is important to many organizations. Adding some additional compliance framework templates with suitable reports and dashboards would enhance the solutionâs appeal to compliance-focused organizations.Â

**Purchase Considerations**
Teramind offers subscription licensing, which is based on a per-user model with a minimum commitment of five users. Subscription contracts last at least 12 months, with multiyear options available. Pricing details for standard tiers can be found on the website. Custom pricing is also available directly from the vendor.

In most cases, professional services are unnecessary for cloud customers, although they may be required for complex on-premises setups, deep custom integrations, or highly specialized business process optimization (BPO) use cases. Teramind can offer professional services in these cases.

Teramindâs solution has traditionally been targeted at SMBs from 10 to 1,000 users, as well as its MSP market. In addition, it is now seeing increased success with larger enterprises.

**Use Cases**
Teramind helps users handle various use cases, including preventing data leaks by automatically blocking or warning users against accidentally sharing sensitive information through unauthorized channels. It also detects insider threats, providing forensic evidence for malicious activities like data theft by disgruntled employees. Additionally, it supports customers through user behavior analytics, screen recordings, and OCR.

### Varonis: Data Security Platform

**Solution Overview**
Varonis is a data security company that focuses on providing automated results to customers. Its cloud-native platform helps organizations quickly find sensitive data, control access to it, and watch for breaches. Organizations use Varonis to prevent data breaches, stay compliant, and expand their security teams with 24/7 monitoring.

Varonis is offered as a SaaS solution that can be easily deployed and integrated into desired data domains either via API or with a local collector. Varonis can collect telemetry through a wide range of integrations across multiple platform types. It employs an agentless approach to gather data on user activity and data interactions, creating a detailed view of risk. It provides robust behavioral analytics, including peer analytics. It offers detailed risk activity insights that analysts can use to investigate threats. This is supported by Athena AI, which provides AI guides for query creation and guided case investigation. Users can automate responses and build comprehensive remediation workflows within the platform. It also supports a strong compliance framework, and users can create custom dashboards to monitor regulatory compliance status.

Varonis enhances proactive security by automating permissions management to ensure minimal access. It also provides risk assessments by analyzing file sensitivity, access patterns, and activity. Additionally, it offers customers access to its internal incident response team, which monitors their environments, identifies risks, and notifies them.

The solution is a single platform.Â 

The vendor has dedicated significant time to transitioning its established solutions into a SaaS environment. Customers should now anticipate that updates will be delivered within this platform.Â 

Varonis is positioned as a Leader and Fast Mover in the Maturity/Platform Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
Varonis scored well on a number of decision criteria, including:

- **Risk source integration:** The platform monitors diverse data sources like SaaS apps, IaaS, on-premises servers, NAS, email, databases, AD, Entra ID, Okta, VPN, DNS, and proxy devices to track data activity and detect threats. It adds metadata such as data sensitivity and user privileges to create behavioral baselines. Alerts integrate with SIEM and SOAR tools via prebuilt connectors (Splunk, QRadar, Cortex XSOAR, Google Chronicle, and others).
- **Data loss prevention: **The solution is multilayered and allows customers to perform both data discovery and classification, with which DLP classifications and labeling can be carried out to enforce data controls. This has been extended further with its native cloud DLP solution that allows it to provide controls for cloud-based activities.Â
- **User behavior analytics: **The platform utilizes machine learning to create user behavior profiles and baselines for every user and device. Analysis is not limited to data access alone but also covers functions such as unusual file access activity, email send/receive actions, permissions changes, geo-hopping, account configuration, GPO policies, app assignments, and more to detect abnormal or unusual activity that may indicate a threat. All of this aims to provide a comprehensive view of insider risk.Â

**Opportunities**
Varonis has room for improvement in a few decision criteria, including:

- **Collaborative case management:** The solution offers solid incident management capabilities, but it lacks more advanced case management features. For instance, including the ability to anonymize data during an investigation is a crucial aspect of case management, as it could help minimize investigation bias. While customers can integrate with enterprise case management tools to add this feature, implementing it natively would be beneficial for users.Â
- **User education:** The platform offers basic notifications to users when blocking risky actions. Adding more comprehensive information here would enable customers to deliver just-in-time training using technology such as nudge suggestions or microtraining. This would help customers who want to implement insider risk-based training programs.Â

**Purchase Considerations**
Licensing for Varonis is on a per-user subscription basis, which can be canceled at any time. Varonis no longer provides perpetual licenses for new customers.

The solution is lightweight and simple to deploy, and the vendor provides dedicated professional services to support customers with adoption. For those needing extra resources to supplement their internal teams, Varonis offers a managed data detection and response service as an additional option.

The solution targets enterprises with over 1,000 employees, making it less suitable for smaller businesses.

**Use Cases**
Varonis offers a comprehensive solution that is built for complex data and user environments that require thorough risk management and effective mitigation and remediation steps. It enables a comprehensive view of user behavior and in-depth insight into insider risks related to data usage. Additionally, it offers proactive, automated, and least-privilege remediations to ensure users have only the necessary permissions to access business resources.

### Veriato: IRM

**Solution Overview**
Veriato provides workforce behavior intelligence to help organizations manage insider risk and monitor employee activities in remote, hybrid, and in-office settings.

The unified platform features three main components: User Access Management, User Behavior Analytics, and Insider Risk Management. Veriato can be deployed either through the cloud or on-premises. Its modular, microservices-based architecture allows for real-time behavioral telemetry collection from user endpoints via an agent, SaaS environments, and directory services like AD and Azure AD.

Veriato gathers telemetry data to monitor behavioral cues like tone, sentiment, or unauthorized access, which are compared to baselines to produce real-time risk scores. These scores are displayed on dashboards for security, compliance, or HR teams. The system is designed for operations staff rather than end users, offering minimal interaction for users. It is managed through a single console for setting policies, monitoring alerts, generating reports, and analyzing risk trends.

Veriato continues to invest in AI to improve its behavioral analysis, including a real-time AI scoring system that is pretrained to detect shifts in tone, engagement, and anomalies. This enables security and operations teams to gain earlier insights into emerging risks before traditional controls are triggered. The solution also offers robust case management, including data anonymization to minimize bias, with an innovative capability to maintain this anonymization when sharing data with external tools such as ITSM.

The vendor continues to redefine its approach with new tools and new human-focused solutions. Customers should expect to see a change in the platform over the contract lifecycle.

Veriato is positioned as a Challenger and Fast Mover in the Innovation/Platform Play quadrant of the GigaOm Radar for insider risk management chart.

**Strengths**
Veriato scored well on a number of decision criteria, including:

- **Collaborative case management:** The platform provides a flexible and role-aware case management framework that enables full lifecycle investigations, from detection and evidence gathering to cross-functional collaboration and final resolution. The platform is built to facilitate transparency, chain of custody, and accountability, whether investigations remain internal or involve third parties.Â
- **User behavior analytics: **Veriato incorporates real-time activity monitoring, risk modeling, and sentiment analysis to surface risky patterns before they become incidents. The system continuously learns each userâs baseline across work habits, application engagement, file interaction, and communication behavior to generate context-aware risk scores. These behavioral insights help build individualized profiles for every monitored user.Â Â
- **Response automation:** The platform features a highly customizable alert builder, which automatically triggers threat alerts when a specific anomaly, event, behavior, or keyword is identified. Users can specify how they would like the alert to be handled and who gets the emails. This alert data can be integrated into an ITSM, case management, or SOAR tool.

**Opportunities**
Veriato has room for improvement in a few decision criteria, including:

- **User education:** The platform focuses on providing visibility and actionable intelligence to security, HR, and compliance teams. Alerts go to admins, allowing for user education tailored by department and user; however, this is a process outside of the Veriato platform. Adding detailed notifications for real-time learning opportunities would enhance value and help businesses use Veriato for insider risk training.Â
- **Data loss prevention:** While the solution includes native DLP-like functionality that detects, flags, and escalates risky data-handling behaviors, its ability to apply controls is more limited. Adding additional capabilities that allow the solution to apply native DLP controls, such as labeling, blocking, and potentially longer-term data masking, will help customers consolidate insider risk and DLP into the Veriato platform.Â
- **Compliance frameworks:** Currently, the platform is limited to identifying potential risks but does not currently present these as specific compliance risks in dashboards or reports. Adding a more compliance-centric view, whether through dashboards or reporting, would be valuable to customers aiming to enhance compliance through insider risk management.Â

**Purchase Considerations**
Veriato uses a subscription-based licensing model. Clients are licensed by the user. Minimum subscription commitment is 12 months. Pricing is provided through direct engagement with Veriato or certified reseller partners.Â 

While the solution is unlikely to require extensive professional services due to its SaaS model and out-of-the-box templates and policies, professional services packages are available where needed.

This is a solution suitable for SME and enterprises.

**Use Cases**
Veriatoâs solution can handle various use cases. This includes assisting customers with proactive insider threat detection through real-time risk scoring, which highlights early behavioral changes. For those needing the ability to conduct workforce investigations, it gathers comprehensive data, including keystrokes, apps, communications, and screenshots. Its role-based access allows HR, legal, and compliance teams to act independently.


## Analystâs Outlook

Insider risk management is not a new discipline, but it is one that continues to evolve. Today, the market is splitting into two distinct approaches. Some vendors focus on consolidating multiple telemetry streams into a unified risk analysis platform, delivering detailed insights that help SecOps teams detect and respond to internal threats. Others are taking a more data-centric approach, combining data risk analysis with user behavior monitoring to create platforms that focus specifically on protecting sensitive information. This latter strategy is built on the premise that malicious insider behavior typically targets an organizationâs data assets.

This divergence should be a key consideration for organizations evaluating insider risk solutions. Neither approach is inherently superiorâthey simply serve different priorities. For organizations with robust data security and compliance frameworks already in place, adding another layer of data-centric tools may offer diminishing returns. In such cases, a broader analytics-driven platform may deliver greater value.

Here are some key priorities to consider as you evaluate this space:

- **AI and GenAI threats:** An emerging factor in the space is the rising risk posed by AI technologies, particularly GenAI tools now operating across many businesses. While organizations may see these tools as productivity boosters, they also introduce new avenues for insider threats. Itâs critical to ensure AI tools are used appropriately and do not become blind spots in insider risk programs.
- **Contextual awareness:** Context plays a crucial role in accurately evaluating risk. Vendors are increasingly incorporating non-technical user information, such as recent resignations, new hires, or disciplinary actions, into risk profiles. For instance, a user under investigation or one who has recently submitted their resignation presents a very different risk profile compared to other employees. Platforms that account for this type of context can offer significantly more accurate insights.
- **Case investigation capabilities:** When incidents are flagged, organizations with capable security teams may want to conduct full investigations. While some vendors offer deep visibility into incidents, they may lack robust case management features. Others provide built-in case management along with privacy-preserving capabilities such as anonymized data to reduce bias. The ability to manage cases effectively and fairly is an increasingly important feature for mature security teams.
- **AI-supported analysis:** AI is playing a central role in the next phase of insider risk management. Vendors are using it to streamline investigations, gather and correlate telemetry quickly, generate relevant queries through natural language input, prioritize threats, and recommend appropriate responses. These capabilities not only save time but also make complex investigations more accessible and actionableâespecially for leaner teams.
- **Automation and response:** Unchecked insider risks can quickly escalate. The ability to respond immediately is essential. Platforms vary in their level of automation: from simple policy-based responses like alerts and notifications to more advanced workflows that can automatically block risky actions (for example, stopping file transfers). Leading solutions offer customizable playbooks that can execute multiple response tasks, including integration with ITSM systems to create tickets and ensure incidents are tracked and resolved as part of the broader security workflow.


---

#### What to Look for in a Solution

The insider risk management space is likely to continue its shift toward data-centric strategies, with increasing reliance on AI to support analysis. Vendors that deliver well-integrated, intuitive tools for automation, contextual risk analysis, and rapid response will be better positioned to meet the needs of todayâs complex threat environment.

When evaluating solutions, consider key factors such as data protection, automation, contextual insight, and AI capabilities. Just as importantly, assess your organizationâs existing internal skill sets and technology maturity to ensure any solution aligns with your operational reality.

The insider threat is not going away. In fact, itâs evolving. For forward-thinking IT and security leaders, putting a strong insider risk program in place is no longer optional, itâs essential.
